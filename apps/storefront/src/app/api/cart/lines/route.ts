import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { addConfiguredProduct } from '@/features/cart/cart-service';
import { priceRequestSchema } from '@/features/catalog/pricing';
import { isSameOrigin } from '@/lib/http';
import { Prisma } from '@/generated/prisma/client';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 16_384) return NextResponse.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 });
  const body: unknown = await request.json().catch(() => null);
  const parsed = priceRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_REQUEST', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  let result: Awaited<ReturnType<typeof addConfiguredProduct>>;
  try {
    result = await addConfiguredProduct(session.user.id, parsed.data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'CART_LINE_ALREADY_EXISTS' }, { status: 409 });
    }
    throw error;
  }
  if (!result.ok) {
    const status = result.code === 'ACCOUNT_FORBIDDEN' ? 403 : result.code === 'CHECKOUT_IN_PROGRESS' ? 409 : result.code === 'PRODUCT_UNAVAILABLE' ? 404 : 422;
    return NextResponse.json({ error: result.code }, { status });
  }
  return NextResponse.json(result, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
