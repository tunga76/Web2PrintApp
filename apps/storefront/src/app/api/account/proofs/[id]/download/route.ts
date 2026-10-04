import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getS3Storage } from '@/features/artwork/storage';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const { id } = await params;
  const proof = await getDb().artworkProof.findFirst({
    where: {
      id,
      status: { in: ['AWAITING_CUSTOMER', 'APPROVED', 'CHANGES_REQUESTED', 'SUPERSEDED'] },
      orderLine: { order: { customerAccount: { members: { some: { userId: session.user.id } } } } },
    },
    select: { id: true, proofObjectKey: true, version: true, status: true },
  });
  if (!proof?.proofObjectKey) return NextResponse.json({ error: 'PROOF_NOT_FOUND' }, { status: 404 });
  try {
    const { client, bucket } = getS3Storage();
    const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: proof.proofObjectKey, ResponseContentType: 'application/pdf', ResponseContentDisposition: `inline; filename="proof-v${proof.version}.pdf"` }), { expiresIn: 300 });
    return NextResponse.json({ url, status: proof.status }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'PROOF_STORAGE_UNAVAILABLE' }, { status: 502 });
  }
}
