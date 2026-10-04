import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { removeCartLine, repriceCartLine } from '@/features/cart/cart-service';
import { isSameOrigin } from '@/lib/http';
import { Prisma } from '@/generated/prisma/client';

const quantitySchema = z.object({ quantity: z.number().int().positive().max(1_000_000) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const { id } = await params;
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 4096) return NextResponse.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 });
  const body: unknown = await request.json().catch(() => null);
  const parsed = quantitySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_QUANTITY' }, { status: 400 });
  let result: Awaited<ReturnType<typeof repriceCartLine>>;
  try {
    result = await repriceCartLine(session.user.id, id, parsed.data.quantity);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'CART_LINE_ALREADY_EXISTS' }, { status: 409 });
    }
    throw error;
  }
  if (!result.ok) {
    const status = result.code === 'ACCOUNT_FORBIDDEN' ? 403 : result.code === 'CHECKOUT_IN_PROGRESS' ? 409 : result.code === 'LINE_NOT_FOUND' ? 404 : 422;
    return NextResponse.json({ error: result.code }, { status });
  }
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(_request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const { id } = await params;
  const removed = await removeCartLine(session.user.id, id);
  return removed ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'LINE_NOT_FOUND' }, { status: 404 });
}
