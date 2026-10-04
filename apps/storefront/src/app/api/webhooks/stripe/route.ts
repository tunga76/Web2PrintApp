import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getStripeEnv } from '@/lib/env';

export const runtime = 'nodejs';

function isUniqueViolation(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

function checkoutMetadata(event: Stripe.Event) {
  if (event.type.startsWith('checkout.session.')) {
    const session = event.data.object as Stripe.Checkout.Session;
    return {
      paymentId: session.metadata?.paymentId,
      orderId: session.metadata?.orderId,
      objectId: session.id,
      amountMinor: session.amount_total,
      currency: session.currency,
      paid: session.payment_status === 'paid',
    };
  }
  if (event.type.startsWith('payment_intent.')) {
    const intent = event.data.object as Stripe.PaymentIntent;
    return {
      paymentId: intent.metadata.paymentId,
      orderId: intent.metadata.orderId,
      objectId: intent.id,
      amountMinor: intent.amount_received || intent.amount,
      currency: intent.currency,
      paid: event.type === 'payment_intent.succeeded',
    };
  }
  return null;
}

function transitionFor(event: Stripe.Event, paid: boolean) {
  if (paid) return 'SUCCEEDED' as const;
  if (event.type === 'checkout.session.expired') return 'CANCELLED' as const;
  if (event.type === 'checkout.session.async_payment_failed' || event.type === 'payment_intent.payment_failed') return 'FAILED' as const;
  if (event.type === 'checkout.session.completed') return 'PROCESSING' as const;
  return null;
}

export async function POST(request: Request) {
  let stripe: Stripe;
  let webhookSecret: string;
  try {
    const environment = getStripeEnv();
    stripe = new Stripe(environment.STRIPE_SECRET_KEY);
    webhookSecret = environment.STRIPE_WEBHOOK_SECRET;
  } catch {
    return NextResponse.json({ error: 'STRIPE_TEST_CONFIGURATION_REQUIRED' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'SIGNATURE_REQUIRED' }, { status: 400 });
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 400 });
  }

  const db = getDb();
  const metadata = checkoutMetadata(event);
  try {
    await db.stripeWebhookReceipt.create({
      data: { stripeEventId: event.id, eventType: event.type, objectId: metadata?.objectId ?? null },
    });
  } catch (error) {
    if (!isUniqueViolation(error)) return NextResponse.json({ error: 'RECEIPT_STORE_FAILED' }, { status: 500 });
    const existingReceipt = await db.stripeWebhookReceipt.findUnique({ where: { stripeEventId: event.id } });
    if (existingReceipt?.processedAt) return NextResponse.json({ received: true, duplicate: true });
    await db.stripeWebhookReceipt.update({ where: { stripeEventId: event.id }, data: { attemptCount: { increment: 1 } } });
  }

  try {
    const nextStatus = transitionFor(event, metadata?.paid ?? false);
    if (metadata?.paymentId && metadata.orderId && nextStatus) {
      const payment = await db.payment.findFirst({
        where: { id: metadata.paymentId, orderId: metadata.orderId },
      });
      if (!payment) throw new Error('Payment record does not match webhook metadata.');

      const amountMatches = nextStatus !== 'SUCCEEDED' || (metadata.amountMinor !== null && metadata.amountMinor !== undefined && BigInt(metadata.amountMinor) === payment.amountMinor);
      const currencyMatches = nextStatus !== 'SUCCEEDED' || Boolean(metadata.currency && metadata.currency.toLowerCase() === payment.currency.toLowerCase());
      const finalStatus = nextStatus === 'SUCCEEDED' && (!amountMatches || !currencyMatches) ? 'FAILED' : nextStatus;
      const safeMessage = !amountMatches || !currencyMatches ? 'Stripe amount or currency did not match the saved order.' : null;

      await db.$transaction(async (transaction) => {
        const currentPayment = await transaction.payment.findUnique({ where: { id: payment.id }, select: { status: true } });
        if (!currentPayment) throw new Error('Payment record disappeared during webhook processing.');
        let appliedStatus = currentPayment.status;
        if (currentPayment.status !== 'SUCCEEDED' && currentPayment.status !== finalStatus) {
          const transition = await transaction.payment.updateMany({
            where: { id: payment.id, status: { not: 'SUCCEEDED' } },
            data: {
              status: finalStatus,
              ...(finalStatus === 'SUCCEEDED' ? { succeededAt: new Date() } : {}),
              ...(finalStatus === 'FAILED' ? { failureCode: safeMessage ? 'AMOUNT_MISMATCH' : event.type } : {}),
              ...(finalStatus === 'FAILED' && safeMessage ? { failureMessage: safeMessage } : {}),
              ...(event.type.startsWith('payment_intent.') ? { stripePaymentIntentId: metadata.objectId } : {}),
            },
          });
          if (transition.count === 1) appliedStatus = finalStatus;
          else {
            const latestPayment = await transaction.payment.findUnique({ where: { id: payment.id }, select: { status: true } });
            if (!latestPayment) throw new Error('Payment record disappeared during webhook transition.');
            appliedStatus = latestPayment.status;
          }
        }
        await transaction.paymentEvent.upsert({
          where: { stripeEventId: event.id },
          create: {
            paymentId: payment.id,
            stripeEventId: event.id,
            eventType: event.type,
            previousStatus: currentPayment.status,
            nextStatus: appliedStatus,
            message: safeMessage ?? `Signed Stripe test event ${event.type} processed.`,
            metadata: { objectId: metadata.objectId },
          },
          update: {},
        });

        if (appliedStatus === 'SUCCEEDED') {
          const order = await transaction.order.update({
            where: { id: metadata.orderId },
            data: { status: 'CONFIRMED' },
            include: { lines: { include: { artwork: { select: { artworkId: true } } } } },
          });
          const address = order.shippingAddressSnapshot as {
            recipient: string; company: string | null; line1: string; line2: string | null;
            city: string; region: string | null; postcode: string; countryCode: string; phone: string | null;
          };
          const existingAddress = await transaction.customerAddress.findFirst({
            where: {
              accountId: order.customerAccountId, deletedAt: null,
              line1: address.line1, postcode: address.postcode, recipient: address.recipient,
            },
          });
          if (!existingAddress) {
            const hasDefaultAddress = await transaction.customerAddress.count({ where: { accountId: order.customerAccountId, deletedAt: null, isDefault: true } });
            await transaction.customerAddress.create({
              data: {
                accountId: order.customerAccountId, label: 'Shipping address', ...address,
                isDefault: hasDefaultAddress === 0,
              },
            });
          }
          if (order.cartId) await transaction.cart.updateMany({ where: { id: order.cartId }, data: { status: 'CONVERTED' } });
          for (const line of order.lines) {
            const job = await transaction.productionJob.findUnique({ where: { orderLineId: line.id }, select: { id: true } });
            if (!job) {
              const initialStatus = line.artwork.length ? 'ARTWORK_REVIEW' : 'AWAITING_ARTWORK';
              const createdJob = await transaction.productionJob.create({ data: { orderLineId: line.id, status: initialStatus } });
              await transaction.productionStatusEvent.create({
                data: {
                  productionJobId: createdJob.id,
                  fromStatus: null,
                  toStatus: initialStatus,
                  note: line.artwork.length ? 'Payment confirmed; attached artwork is ready for production review.' : 'Payment confirmed; artwork is awaited.',
                },
              });
            }
          }
        } else if (appliedStatus === 'FAILED' || appliedStatus === 'CANCELLED') {
          const currentOrder = await transaction.order.findUnique({ where: { id: metadata.orderId }, select: { cartId: true } });
          if (currentOrder?.cartId) await transaction.cart.updateMany({ where: { id: currentOrder.cartId }, data: { status: 'ACTIVE' } });
          await transaction.order.updateMany({
            where: { id: metadata.orderId, status: 'PENDING_PAYMENT' },
            data: { status: 'CANCELLED', cartId: null },
          });
        }
      });
    }

    await db.stripeWebhookReceipt.update({
      where: { stripeEventId: event.id },
      data: { processedAt: new Date(), lastError: null },
    });
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : 'Webhook processing failed.';
    await db.stripeWebhookReceipt.update({
      where: { stripeEventId: event.id },
      data: { attemptCount: { increment: 1 }, lastError: message },
    });
    console.error('Stripe webhook processing failed.', error);
    return NextResponse.json({ error: 'WEBHOOK_PROCESSING_FAILED' }, { status: 500 });
  }
}
