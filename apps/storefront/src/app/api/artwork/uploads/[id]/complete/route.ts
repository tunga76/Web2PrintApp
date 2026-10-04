import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { getS3Storage } from '@/features/artwork/storage';
import { scanArtworkObject } from '@/features/artwork/antivirus';
import { getDb } from '@/lib/db';
import { isSameOrigin } from '@/lib/http';

export const runtime = 'nodejs';

function detectMime(bytes: Uint8Array) {
  if (new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-') return 'application/pdf';
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)) return 'image/png';
  if (bytes.length >= 4 && ((bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0) || (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0 && bytes[3] === 0x2a))) return 'image/tiff';
  return null;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const { id } = await params;
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner) return NextResponse.json({ error: 'ACCOUNT_REQUIRED' }, { status: 403 });
  const asset = await getDb().artworkAsset.findFirst({
    where: { id, customerAccountId: owner.account.id, uploadedByUserId: session.user.id, status: 'UPLOADING', deletedAt: null },
  });
  if (!asset) return NextResponse.json({ error: 'UPLOAD_NOT_FOUND' }, { status: 404 });

  try {
    const { client, bucket } = getS3Storage();
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: asset.objectKey }));
    const sizeMatches = BigInt(head.ContentLength ?? -1) === asset.sizeBytes;
    const mimeMatches = head.ContentType === asset.mimeType;
    if (!sizeMatches || !mimeMatches) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: asset.objectKey }));
      await getDb().artworkAsset.update({ where: { id: asset.id }, data: { status: 'QUARANTINED', deletedAt: new Date() } });
      return NextResponse.json({ error: 'FILE_METADATA_MISMATCH' }, { status: 422 });
    }
    const range = await client.send(new GetObjectCommand({ Bucket: bucket, Key: asset.objectKey, Range: 'bytes=0-15' }));
    const bytes = await range.Body?.transformToByteArray();
    const detectedMime = bytes ? detectMime(bytes) : null;
    if (!detectedMime || detectedMime !== asset.mimeType) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: asset.objectKey }));
      await getDb().artworkAsset.update({ where: { id: asset.id }, data: { status: 'QUARANTINED', deletedAt: new Date() } });
      return NextResponse.json({ error: 'FILE_SIGNATURE_MISMATCH' }, { status: 422 });
    }
    const scan = await scanArtworkObject(asset.objectKey);
    if (!scan.clean) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: asset.objectKey }));
      await getDb().artworkAsset.update({ where: { id: asset.id }, data: { status: 'QUARANTINED', deletedAt: new Date() } });
      return NextResponse.json({ error: 'MALWARE_DETECTED' }, { status: 422 });
    }
    await getDb().artworkAsset.update({ where: { id: asset.id }, data: { status: 'REVIEW_REQUIRED' } });
    return NextResponse.json({ status: 'REVIEW_REQUIRED', message: 'Virus scan passed. A production team member must review print quality before this file can be attached to an order.' });
  } catch (error) {
    await getDb().artworkAsset.update({ where: { id: asset.id }, data: { status: 'QUARANTINED' } }).catch(() => undefined);
    console.error('Could not verify uploaded artwork.', error);
    return NextResponse.json({ error: 'UPLOAD_VERIFICATION_UNAVAILABLE' }, { status: 502 });
  }
}
