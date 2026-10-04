import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { auth } from '@/auth';
import { getS3Storage } from '@/features/artwork/storage';
import { getDb } from '@/lib/db';
import { isSameOrigin } from '@/lib/http';

export const runtime = 'nodejs';

const schema = z.object({
  orderLineId: z.string().min(1).max(40),
  sourceArtworkId: z.string().min(1).max(40),
  fileSizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
  reviewNotes: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id || !['ADMIN', 'PRODUCTION'].includes(session.user.role)) return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 8192) return NextResponse.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 });
  const body: unknown = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_PROOF' }, { status: 400 });

  const db = getDb();
  const [orderLine, artwork] = await Promise.all([
    db.orderLine.findUnique({ where: { id: parsed.data.orderLineId }, include: { order: { select: { id: true } }, artwork: { where: { artworkId: parsed.data.sourceArtworkId }, select: { artworkId: true } } } }),
    db.artworkAsset.findFirst({ where: { id: parsed.data.sourceArtworkId, status: 'APPROVED', deletedAt: null }, select: { id: true, customerAccountId: true } }),
  ]);
  if (!orderLine || !artwork || !orderLine.artwork.length) return NextResponse.json({ error: 'APPROVED_ORDER_ARTWORK_REQUIRED' }, { status: 422 });
  const proofCount = await db.artworkProof.aggregate({ where: { orderLineId: orderLine.id }, _max: { version: true } });
  const version = (proofCount._max.version ?? 0) + 1;
  const objectKey = `proofs/${orderLine.order.id}/${orderLine.id}/v${version}/${randomUUID()}.pdf`;
  const proof = await db.artworkProof.create({
    data: {
      orderLineId: orderLine.id,
      sourceArtworkId: artwork.id,
      version,
      proofObjectKey: objectKey,
      reviewNotes: parsed.data.reviewNotes ?? null,
      reviewedByUserId: session.user.id,
    },
    select: { id: true, version: true },
  });
  try {
    const { client, bucket } = getS3Storage();
    const post = await createPresignedPost(client, {
      Bucket: bucket,
      Key: objectKey,
      Expires: 600,
      Fields: { 'Content-Type': 'application/pdf' },
      Conditions: [
        ['content-length-range', parsed.data.fileSizeBytes, parsed.data.fileSizeBytes],
        ['eq', '$Content-Type', 'application/pdf'],
      ],
    });
    return NextResponse.json({ proofId: proof.id, version: proof.version, uploadUrl: post.url, fields: post.fields }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    await db.artworkProof.update({ where: { id: proof.id }, data: { status: 'SUPERSEDED' } });
    console.error('Could not create a signed proof upload.', error);
    return NextResponse.json({ error: 'PROOF_STORAGE_UNAVAILABLE' }, { status: 503 });
  }
}
