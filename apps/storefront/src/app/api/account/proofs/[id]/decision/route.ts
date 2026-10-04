import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';
import { isSameOrigin } from '@/lib/http';

export const runtime = 'nodejs';

const decisionSchema = z.object({ decision: z.enum(['APPROVED', 'CHANGES_REQUESTED']), response: z.string().trim().max(1000).optional() }).refine((data) => data.decision !== 'CHANGES_REQUESTED' || Boolean(data.response), { path: ['response'], message: 'Tell the production team what needs changing.' });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const { id } = await params;
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 4096) return NextResponse.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 });
  const body: unknown = await request.json().catch(() => null);
  const parsed = decisionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_DECISION', issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const db = getDb();
  const proof = await db.artworkProof.findFirst({
    where: {
      id,
      status: 'AWAITING_CUSTOMER',
      orderLine: {
        order: {
          customerAccount: {
            members: { some: { userId: session.user.id, role: { in: ['OWNER', 'MANAGER', 'BUYER'] } } },
          },
        },
      },
    },
    include: { orderLine: { include: { productionJob: true, order: { select: { id: true } } } } },
  });
  if (!proof?.orderLine.productionJob || proof.orderLine.productionJob.status !== 'AWAITING_PROOF_APPROVAL') return NextResponse.json({ error: 'PROOF_NOT_AWAITING_DECISION' }, { status: 409 });

  const updatedStatus = parsed.data.decision;
  const nextProductionStatus = updatedStatus === 'APPROVED' ? 'READY_FOR_PRODUCTION' : 'ARTWORK_REVIEW';
  try {
    await db.$transaction(async (transaction) => {
      const claimed = await transaction.artworkProof.updateMany({ where: { id: proof.id, status: 'AWAITING_CUSTOMER' }, data: { status: updatedStatus, customerResponse: parsed.data.response ?? null, ...(updatedStatus === 'APPROVED' ? { approvedByUserId: session.user.id, approvedAt: new Date() } : {}) } });
      if (claimed.count !== 1) throw new Error('Proof already received a decision.');
      await transaction.productionJob.update({ where: { id: proof.orderLine.productionJob!.id, status: 'AWAITING_PROOF_APPROVAL' }, data: { status: nextProductionStatus } });
      await transaction.productionStatusEvent.create({ data: { productionJobId: proof.orderLine.productionJob!.id, fromStatus: 'AWAITING_PROOF_APPROVAL', toStatus: nextProductionStatus, actorUserId: session.user.id, note: updatedStatus === 'APPROVED' ? `Customer approved proof v${proof.version}.` : `Customer requested changes to proof v${proof.version}.` } });
      await transaction.adminAuditLog.create({ data: { actorUserId: session.user.id, action: `proof.customer_${updatedStatus.toLowerCase()}`, entityType: 'ArtworkProof', entityId: proof.id, after: { status: updatedStatus, response: parsed.data.response ?? null } } });
    });
    return NextResponse.json({ status: updatedStatus, productionStatus: nextProductionStatus });
  } catch {
    return NextResponse.json({ error: 'PROOF_DECISION_NOT_APPLIED' }, { status: 409 });
  }
}
