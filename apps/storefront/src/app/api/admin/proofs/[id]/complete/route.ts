import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { scanArtworkObject } from '@/features/artwork/antivirus';
import { getS3Storage } from '@/features/artwork/storage';
import { getDb } from '@/lib/db';
import { isSameOrigin } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id || !['ADMIN', 'PRODUCTION'].includes(session.user.role)) return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  const { id } = await params;
  const proof = await getDb().artworkProof.findFirst({ where: { id, status: 'PREPARING' }, include: { orderLine: { include: { productionJob: true } } } });
  if (!proof?.proofObjectKey || !proof.orderLine.productionJob || proof.orderLine.productionJob.status !== 'ARTWORK_REVIEW') return NextResponse.json({ error: 'PROOF_NOT_FOUND_OR_JOB_NOT_READY' }, { status: 404 });

  try {
    const { client, bucket } = getS3Storage();
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: proof.proofObjectKey }));
    const size = head.ContentLength ?? 0;
    if (size < 1 || size > 20 * 1024 * 1024 || head.ContentType !== 'application/pdf') {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: proof.proofObjectKey }));
      await getDb().artworkProof.update({ where: { id: proof.id }, data: { status: 'SUPERSEDED' } });
      return NextResponse.json({ error: 'PROOF_FILE_METADATA_INVALID' }, { status: 422 });
    }
    const range = await client.send(new GetObjectCommand({ Bucket: bucket, Key: proof.proofObjectKey, Range: 'bytes=0-15' }));
    const bytes = await range.Body?.transformToByteArray();
    if (!bytes || new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: proof.proofObjectKey }));
      await getDb().artworkProof.update({ where: { id: proof.id }, data: { status: 'SUPERSEDED' } });
      return NextResponse.json({ error: 'PROOF_FILE_SIGNATURE_INVALID' }, { status: 422 });
    }
    const scan = await scanArtworkObject(proof.proofObjectKey);
    if (!scan.clean) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: proof.proofObjectKey }));
      await getDb().artworkProof.update({ where: { id: proof.id }, data: { status: 'SUPERSEDED' } });
      return NextResponse.json({ error: 'MALWARE_DETECTED' }, { status: 422 });
    }

    await getDb().$transaction(async (transaction) => {
      const now = new Date();
      await transaction.artworkProof.update({ where: { id: proof.id, status: 'PREPARING' }, data: { status: 'AWAITING_CUSTOMER', reviewedByUserId: session.user.id, reviewedAt: now } });
      await transaction.productionJob.update({ where: { id: proof.orderLine.productionJob!.id, status: 'ARTWORK_REVIEW' }, data: { status: 'AWAITING_PROOF_APPROVAL' } });
      await transaction.productionStatusEvent.create({ data: { productionJobId: proof.orderLine.productionJob!.id, fromStatus: 'ARTWORK_REVIEW', toStatus: 'AWAITING_PROOF_APPROVAL', actorUserId: session.user.id, note: `Proof v${proof.version} sent to customer for approval.` } });
      await transaction.adminAuditLog.create({ data: { actorUserId: session.user.id, action: 'proof.sent_for_approval', entityType: 'ArtworkProof', entityId: proof.id, after: { version: proof.version, status: 'AWAITING_CUSTOMER' } } });
    });
    return NextResponse.json({ status: 'AWAITING_CUSTOMER' });
  } catch (error) {
    console.error('Proof validation failed.', error);
    return NextResponse.json({ error: 'PROOF_VALIDATION_UNAVAILABLE' }, { status: 503 });
  }
}
