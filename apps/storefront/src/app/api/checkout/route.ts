import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { calculateProductPrice, calculateVatMinor } from '@/features/catalog/pricing';
import { checkoutSchema } from '@/features/checkout/checkout-schema';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { getDb } from '@/lib/db';
import { getAppUrl, getStripeEnv } from '@/lib/env';
import { isSameOrigin } from '@/lib/http';
import { Prisma } from '@/generated/prisma/client';
import { randomBytes } from 'node:crypto';

export const runtime = 'nodejs';

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function paymentRedirect(url: string) {
  return NextResponse.json({ url });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'ORIGIN_FORBIDDEN' }, { status: 403 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 24_576) return NextResponse.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 });
  const body: unknown = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_CHECKOUT', issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const owner = await getPurchasingAccount(session.user.id);
  if (!owner || owner.membership.role === 'BILLING') return NextResponse.json({ error: 'ACCOUNT_FORBIDDEN' }, { status: 403 });
  if (!owner.user.email) return NextResponse.json({ error: 'EMAIL_REQUIRED' }, { status: 422 });

  let stripe: Stripe;
  try {
    stripe = new Stripe(getStripeEnv().STRIPE_SECRET_KEY);
  } catch {
    return NextResponse.json({ error: 'STRIPE_TEST_CONFIGURATION_REQUIRED' }, { status: 503 });
  }

  const db = getDb();
  const cart = await db.cart.findFirst({
    where: { userId: session.user.id, customerAccountId: owner.account.id, status: 'ACTIVE' },
    include: {
      lines: {
        orderBy: { createdAt: 'asc' },
        include: { product: true, options: { select: { optionValueId: true } }, artwork: { include: { artwork: true } } },
      },
      order: { include: { payments: { orderBy: { attempt: 'desc' }, take: 1 } } },
    },
  });
  if (!cart?.lines.length) return NextResponse.json({ error: 'EMPTY_CART' }, { status: 409 });
  const shippingAddress = parsed.data.shippingAddress;
  const billingAddress = parsed.data.billingSameAsShipping ? shippingAddress : parsed.data.billingAddress!;
  const billingSnapshot = { ...billingAddress, email: owner.user.email } satisfies Prisma.InputJsonValue;
  const shippingSnapshot = { ...shippingAddress, email: owner.user.email } satisfies Prisma.InputJsonValue;

  let order = cart.order;
  if (order && order.status !== 'PENDING_PAYMENT') {
    return NextResponse.json({ error: 'ORDER_ALREADY_PLACED', orderNumber: order.orderNumber }, { status: 409 });
  }
  if (order) {
    const previousPayment = order.payments[0];
    if (previousPayment?.status === 'PROCESSING') {
      return paymentRedirect(`${getAppUrl()}/checkout/success?order=${encodeURIComponent(order.id)}`);
    }
    if (previousPayment?.stripeCheckoutSessionId && previousPayment.status === 'PENDING') {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(previousPayment.stripeCheckoutSessionId);
        if (existingSession.status === 'open' && existingSession.url) return paymentRedirect(existingSession.url);
        if (existingSession.status === 'complete') {
          return paymentRedirect(`${getAppUrl()}/checkout/success?order=${encodeURIComponent(order.id)}`);
        }
      } catch (error) {
        console.error('Could not retrieve the existing Stripe test session.', error);
        return NextResponse.json({ error: 'PAYMENT_PROVIDER_UNAVAILABLE' }, { status: 502 });
      }
    }
    if (previousPayment?.status === 'SUCCEEDED') {
      return NextResponse.json({ error: 'ORDER_ALREADY_PAID', orderNumber: order.orderNumber }, { status: 409 });
    }
    await db.$transaction(async (transaction) => {
      if (previousPayment) {
        await transaction.payment.update({ where: { id: previousPayment.id }, data: { status: 'CANCELLED' } });
        await transaction.paymentEvent.create({
          data: { paymentId: previousPayment.id, eventType: 'checkout.session.replaced', previousStatus: previousPayment.status, nextStatus: 'CANCELLED', message: 'A new checkout attempt replaced an unavailable session.' },
        });
      }
      await transaction.order.update({ where: { id: order!.id }, data: { status: 'CANCELLED', cartId: null } });
    });
    order = null;
  }

  const deliveryMethod = await db.deliveryMethod.findFirst({
    where: { code: parsed.data.deliveryMethodCode, isActive: true },
  });
  if (!deliveryMethod) return NextResponse.json({ error: 'DELIVERY_UNAVAILABLE' }, { status: 422 });

  const linePrices = [];
  for (const line of cart.lines) {
    if (line.artwork.some(({ artwork }) => artwork.customerAccountId !== owner.account.id || artwork.status !== 'APPROVED' || artwork.deletedAt !== null)) {
      return NextResponse.json({ error: 'ARTWORK_REVIEW_REQUIRED', lineId: line.id }, { status: 422 });
    }
    const price = await calculateProductPrice({
      productSlug: line.product.slug,
      quantity: line.quantity,
      optionValueIds: line.options.map((option) => option.optionValueId),
    });
    if (!price.ok) return NextResponse.json({ error: 'CART_PRICE_CHANGED', lineId: line.id, reason: price.code }, { status: 409 });
    if (price.product.indicativePricing) return NextResponse.json({ error: 'INDICATIVE_PRICE_NOT_ORDERABLE', lineId: line.id }, { status: 422 });
    const tier = await db.productPriceTier.findFirst({
      where: { productId: line.productId, quantity: line.quantity, isActive: true, startsAt: { lte: new Date() }, OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }] },
    });
    if (!tier) return NextResponse.json({ error: 'CART_PRICE_CHANGED', lineId: line.id }, { status: 409 });
    const optionValues = await db.productOptionValue.findMany({
      where: { id: { in: line.options.map((option) => option.optionValueId) } },
      include: { group: { select: { code: true, name: true } } },
    });
    linePrices.push({ line, price, tier, optionValues });
  }

  const lineNet = linePrices.reduce((total, item) => total + BigInt(item.price.netMinor), 0n);
  const lineVat = linePrices.reduce((total, item) => total + BigInt(item.price.vatMinor), 0n);
  const deliveryVat = calculateVatMinor(deliveryMethod.priceNetMinor, deliveryMethod.vatRateBps);
  const totalGross = lineNet + lineVat + deliveryMethod.priceNetMinor + deliveryVat;
  if (totalGross > BigInt(Number.MAX_SAFE_INTEGER)) return NextResponse.json({ error: 'ORDER_TOTAL_UNSUPPORTED' }, { status: 422 });

  let createdOrderId: string | null = null;
  try {
      const orderNumber = `W2P-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
      const newOrder = await db.order.create({
        data: {
          orderNumber,
          customerAccountId: owner.account.id,
          placedByUserId: session.user.id,
          cartId: cart.id,
          deliveryMethodId: deliveryMethod.id,
          customerEmailSnapshot: owner.user.email,
          billingAddressSnapshot: billingSnapshot,
          shippingAddressSnapshot: shippingSnapshot,
          subtotalNetMinor: lineNet,
          taxMinor: lineVat,
          deliveryNetMinor: deliveryMethod.priceNetMinor,
          deliveryVatMinor: deliveryVat,
          totalGrossMinor: totalGross,
          currency: 'GBP',
          lines: {
            create: linePrices.map(({ line, price, tier, optionValues }) => ({
              productId: line.productId,
              priceTierId: tier.id,
              productNameSnapshot: line.product.name,
              productSkuSnapshot: line.product.sku,
              quantity: line.quantity,
              configurationSnapshot: {
                ...(line.configurationSnapshot as Record<string, unknown>),
                options: optionValues.map(({ id, code, label, group }) => ({ id, code, label, groupCode: group.code, groupName: group.name })),
                price: { netMinor: price.netMinor, vatRateBps: price.vatRateBps, vatMinor: price.vatMinor, grossMinor: price.grossMinor, currency: price.currency },
              } as Prisma.InputJsonValue,
              lineNetMinor: BigInt(price.netMinor),
              vatRateBps: price.vatRateBps,
              vatMinor: BigInt(price.vatMinor),
              lineGrossMinor: BigInt(price.grossMinor),
              currency: 'GBP',
              artwork: { create: line.artwork.map(({ artworkId }) => ({ artworkId })) },
            })),
          },
        },
      });
      createdOrderId = newOrder.id;

    const attempt = (await db.payment.aggregate({ where: { orderId: newOrder.id }, _max: { attempt: true } }))._max.attempt ?? 0;
    const payment = await db.payment.create({
      data: {
        orderId: newOrder.id,
        attempt: attempt + 1,
        amountMinor: totalGross,
        currency: 'GBP',
        idempotencyKey: `${newOrder.id}:attempt:${attempt + 1}`,
        events: { create: { eventType: 'checkout.created', nextStatus: 'PENDING', message: 'Stripe test checkout attempt created.' } },
      },
    });
    const stripeSession = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        customer_email: owner.user.email,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: Number(totalGross),
            product_data: { name: `Web2Print order ${newOrder.orderNumber}` },
          },
        }],
        metadata: { orderId: newOrder.id, paymentId: payment.id, orderNumber: newOrder.orderNumber },
        payment_intent_data: { metadata: { orderId: newOrder.id, paymentId: payment.id, orderNumber: newOrder.orderNumber } },
        success_url: `${getAppUrl()}/checkout/success?order=${encodeURIComponent(newOrder.id)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getAppUrl()}/checkout?cancelled=1`,
      },
      { idempotencyKey: payment.idempotencyKey },
    );
    if (!stripeSession.url) throw new Error('Stripe did not provide a checkout URL.');
    await db.payment.update({
      where: { id: payment.id },
      data: { stripeCheckoutSessionId: stripeSession.id },
    });
    await db.paymentEvent.create({
      data: { paymentId: payment.id, eventType: 'checkout.session.created', nextStatus: 'PENDING', message: 'Stripe test Checkout Session created.', metadata: { sessionId: stripeSession.id } },
    });
    return paymentRedirect(stripeSession.url);
  } catch (error) {
    if (isUniqueViolation(error)) return NextResponse.json({ error: 'CHECKOUT_ALREADY_STARTED' }, { status: 409 });
    if (createdOrderId) {
      const latest = await db.payment.findFirst({ where: { orderId: createdOrderId }, orderBy: { attempt: 'desc' } });
      if (latest?.status === 'PENDING' && !latest.stripeCheckoutSessionId) {
        await db.payment.update({ where: { id: latest.id }, data: { status: 'FAILED', failureCode: 'SESSION_CREATE_FAILED' } });
        await db.paymentEvent.create({ data: { paymentId: latest.id, eventType: 'checkout.session.failed', previousStatus: 'PENDING', nextStatus: 'FAILED', message: 'The Stripe test session could not be created.' } });
      }
    }
    console.error('Stripe test checkout creation failed.', error);
    return NextResponse.json({ error: 'PAYMENT_PROVIDER_UNAVAILABLE' }, { status: 502 });
  }
}
