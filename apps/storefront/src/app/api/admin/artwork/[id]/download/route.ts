import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getS3Storage } from '@/features/artwork/storage';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !['ADMIN', 'PRODUCTION'].includes(session.user.role)) return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  const { id } = await params;
  const asset = await getDb().artworkAsset.findFirst({
    where: { id, status: { in: ['REVIEW_REQUIRED', 'APPROVED', 'REJECTED'] }, deletedAt: null },
  });
  if (!asset) return NextResponse.json({ error: 'ARTWORK_NOT_FOUND' }, { status: 404 });
  try {
    const { client, bucket } = getS3Storage();
    const url = await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: asset.objectKey, ResponseContentType: 'application/octet-stream', ResponseContentDisposition: `attachment; filename="${asset.originalFilename.replace(/["\\\r\n]/g, '_')}"` }), { expiresIn: 300 });
    await getDb().adminAuditLog.create({
      data: { actorUserId: session.user.id, action: 'artwork.download_url_created', entityType: 'ArtworkAsset', entityId: asset.id, after: { status: asset.status } },
    });
    return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Could not create an authorized artwork download.', error);
    return NextResponse.json({ error: 'ARTWORK_STORAGE_UNAVAILABLE' }, { status: 502 });
  }
}
