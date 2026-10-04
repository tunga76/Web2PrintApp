import { DeleteObjectCommand } from '@aws-sdk/client-s3';
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
  const asset = await getDb().artworkAsset.findFirst({ where: { id, status: 'QUARANTINED', deletedAt: null } });
  if (!asset) return NextResponse.json({ error: 'ARTWORK_NOT_FOUND' }, { status: 404 });
  try {
    const result = await scanArtworkObject(asset.objectKey);
    if (!result.clean) {
      const { client, bucket } = getS3Storage();
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: asset.objectKey }));
      await getDb().artworkAsset.update({ where: { id: asset.id }, data: { deletedAt: new Date(), status: 'QUARANTINED' } });
      return NextResponse.json({ error: 'MALWARE_DETECTED' }, { status: 422 });
    }
    await getDb().$transaction([
      getDb().artworkAsset.update({ where: { id: asset.id }, data: { status: 'REVIEW_REQUIRED' } }),
      getDb().adminAuditLog.create({ data: { actorUserId: session.user.id, action: 'artwork.virus_scan_passed', entityType: 'ArtworkAsset', entityId: asset.id, after: { status: 'REVIEW_REQUIRED' } } }),
    ]);
    return NextResponse.json({ status: 'REVIEW_REQUIRED' });
  } catch (error) {
    console.error('Manual malware scan retry failed.', error);
    return NextResponse.json({ error: 'ANTIVIRUS_UNAVAILABLE' }, { status: 503 });
  }
}
