import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { getDb } from '@/lib/db';
import { isSameOrigin } from '@/lib/http';

const attachSchema = z.object({ artworkId: z.string().min(1).max(40) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const { id } = await params;
  const body: unknown = await request.json().catch(() => null);
  const parsed = attachSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner) return NextResponse.json({ error: 'ACCOUNT_REQUIRED' }, { status: 403 });
  const [line, asset] = await Promise.all([
    getDb().cartLine.findFirst({ where: { id, cart: { userId: session.user.id, customerAccountId: owner.account.id, status: 'ACTIVE', order: { is: null } } }, select: { id: true } }),
    getDb().artworkAsset.findFirst({ where: { id: parsed.data.artworkId, customerAccountId: owner.account.id, status: 'APPROVED', deletedAt: null }, select: { id: true } }),
  ]);
  if (!line) return NextResponse.json({ error: 'LINE_NOT_FOUND_OR_LOCKED' }, { status: 404 });
  if (!asset) return NextResponse.json({ error: 'ARTWORK_NOT_APPROVED' }, { status: 422 });
  await getDb().cartLineArtwork.upsert({
    where: { cartLineId_artworkId: { cartLineId: line.id, artworkId: asset.id } },
    create: { cartLineId: line.id, artworkId: asset.id },
    update: {},
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const { id } = await params;
  const artworkId = new URL(request.url).searchParams.get('artworkId');
  const parsed = z.string().min(1).max(40).safeParse(artworkId);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner) return NextResponse.json({ error: 'ACCOUNT_REQUIRED' }, { status: 403 });
  const result = await getDb().cartLineArtwork.deleteMany({
    where: {
      cartLineId: id,
      artworkId: parsed.data,
      cartLine: { cart: { userId: session.user.id, customerAccountId: owner.account.id, status: 'ACTIVE', order: { is: null } } },
    },
  });
  return result.count ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'ARTWORK_NOT_ATTACHED' }, { status: 404 });
}
