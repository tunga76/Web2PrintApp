import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { auth } from '@/auth';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { artworkUploadSchema } from '@/features/artwork/artwork-schema';
import { getS3Storage } from '@/features/artwork/storage';
import { getDb } from '@/lib/db';
import { isSameOrigin } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 8192) return NextResponse.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 });
  const body: unknown = await request.json().catch(() => null);
  const parsed = artworkUploadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_FILE', issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const owner = await getPurchasingAccount(session.user.id);
  if (!owner) return NextResponse.json({ error: 'ACCOUNT_REQUIRED' }, { status: 403 });
  let storage: ReturnType<typeof getS3Storage>;
  try {
    storage = getS3Storage();
  } catch {
    return NextResponse.json({ error: 'S3_CONFIGURATION_REQUIRED' }, { status: 503 });
  }

  const objectKey = `${owner.account.id}/${session.user.id}/${randomUUID()}`;
  const asset = await getDb().artworkAsset.create({
    data: {
      customerAccountId: owner.account.id,
      uploadedByUserId: session.user.id,
      storageProvider: 'S3',
      bucket: storage.bucket,
      objectKey,
      originalFilename: parsed.data.filename,
      mimeType: parsed.data.contentType,
      sizeBytes: BigInt(parsed.data.sizeBytes),
      status: 'UPLOADING',
    },
    select: { id: true },
  });

  try {
    const post = await createPresignedPost(storage.client, {
      Bucket: storage.bucket,
      Key: objectKey,
      Expires: 600,
      Fields: { 'Content-Type': parsed.data.contentType },
      Conditions: [
        ['content-length-range', parsed.data.sizeBytes, parsed.data.sizeBytes],
        ['eq', '$Content-Type', parsed.data.contentType],
      ],
    });
    return NextResponse.json({ artworkId: asset.id, uploadUrl: post.url, fields: post.fields }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    await getDb().artworkAsset.update({ where: { id: asset.id }, data: { status: 'QUARANTINED', deletedAt: new Date() } });
    console.error('Could not create a signed artwork upload.', error);
    return NextResponse.json({ error: 'UPLOAD_PROVIDER_UNAVAILABLE' }, { status: 502 });
  }
}
