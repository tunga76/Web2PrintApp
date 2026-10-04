import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { addConfiguredProduct, getPurchasingAccount } from '@/features/cart/cart-service';
import { calculateProductPrice } from '@/features/catalog/pricing';
import { getDb } from '@/lib/db';
import { isSameOrigin } from '@/lib/http';

export async function POST(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner || owner.membership.role === 'BILLING') return NextResponse.json({ error: 'ACCOUNT_FORBIDDEN' }, { status: 403 });
  const { orderNumber } = await params;
  const order = await getDb().order.findFirst({
    where: { orderNumber, customerAccount: { members: { some: { userId: session.user.id } } } },
    include: { lines: { include: { product: true, order: { select: { customerAccountId: true } } } } },
  });
  if (!order) return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });

  const requests: Array<{ productSlug: string; quantity: number; optionValueIds: string[] }> = [];
  for (const line of order.lines) {
    const snapshot = line.configurationSnapshot as { options?: unknown };
    const optionIds = z.array(z.object({ id: z.string().min(1).max(40) })).safeParse(snapshot.options);
    if (!optionIds.success) return NextResponse.json({ error: 'ORDER_CONFIGURATION_UNAVAILABLE', line: line.productNameSnapshot }, { status: 409 });
    requests.push({ productSlug: line.product.slug, quantity: line.quantity, optionValueIds: optionIds.data.map((option) => option.id) });
  }
  if (!requests.length) return NextResponse.json({ error: 'ORDER_HAS_NO_LINES' }, { status: 409 });

  for (const item of requests) {
    const price = await calculateProductPrice(item);
    if (!price.ok) return NextResponse.json({ error: 'REORDER_PRICE_UNAVAILABLE', productSlug: item.productSlug }, { status: 409 });
    if (price.product.indicativePricing) return NextResponse.json({ error: 'INDICATIVE_PRICE_NOT_ORDERABLE', productSlug: item.productSlug }, { status: 422 });
  }
  for (const item of requests) {
    const added = await addConfiguredProduct(session.user.id, item);
    if (!added.ok) return NextResponse.json({ error: added.code, partial: true }, { status: 409 });
  }
  return NextResponse.json({ ok: true, redirectTo: '/cart' }, { status: 201 });
}
