import { createHash } from 'node:crypto';
import { getDb } from '@/lib/db';
import { calculateProductPrice, priceRequestSchema } from '@/features/catalog/pricing';
import type { z } from 'zod';

type PriceInput = z.infer<typeof priceRequestSchema>;

export async function getPurchasingAccount(userId: string) {
  const user = await getDb().user.findFirst({
    where: { id: userId, deletedAt: null },
    include: {
      memberships: {
        where: { account: { deletedAt: null } },
        orderBy: { createdAt: 'asc' },
        include: { account: true },
      },
    },
  });
  const membership = user?.memberships[0];
  if (!user || !membership) return null;
  return { user, membership, account: membership.account };
}

async function getEditableCart(userId: string, accountId: string) {
  const db = getDb();
  const cart = await db.cart.findFirst({
    where: { userId, customerAccountId: accountId, status: 'ACTIVE' },
    orderBy: { updatedAt: 'desc' },
    include: { order: { include: { payments: { orderBy: { attempt: 'desc' }, take: 1 } } } },
  });
  if (cart?.order?.status === 'PENDING_PAYMENT') {
    const latestPayment = cart.order.payments[0];
    if (latestPayment?.status === 'PENDING' || latestPayment?.status === 'PROCESSING') return null;
    await db.$transaction(async (transaction) => {
      await transaction.order.updateMany({
        where: { id: cart.order!.id, status: 'PENDING_PAYMENT' },
        data: { status: 'CANCELLED', cartId: null },
      });
    });
  }
  return cart;
}

function cartConfigurationHash(input: PriceInput) {
  const selection = [...input.optionValueIds].sort();
  return createHash('sha256')
    .update(JSON.stringify({ productSlug: input.productSlug, quantity: input.quantity, selection }))
    .digest('hex');
}

export async function addConfiguredProduct(userId: string, input: PriceInput) {
  const owner = await getPurchasingAccount(userId);
  if (!owner || owner.membership.role === 'BILLING') return { ok: false as const, code: 'ACCOUNT_FORBIDDEN' };
  const editableCart = await getEditableCart(userId, owner.account.id);
  if (editableCart === null) return { ok: false as const, code: 'CHECKOUT_IN_PROGRESS' };
  const price = await calculateProductPrice(input);
  if (!price.ok) return price;
  if (price.product.indicativePricing) return { ok: false as const, code: 'INDICATIVE_PRICE_NOT_ORDERABLE' };

  const db = getDb();
  const product = await db.product.findFirst({ where: { slug: input.productSlug, status: 'ACTIVE', deletedAt: null } });
  const tier = await db.productPriceTier.findFirst({
    where: {
      productId: product?.id,
      quantity: input.quantity,
      isActive: true,
      startsAt: { lte: new Date() },
      OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
    },
  });
  if (!product || !tier) return { ok: false as const, code: 'PRICE_CHANGED' };

  const selected = await db.productOptionValue.findMany({
    where: { id: { in: input.optionValueIds } },
    include: { group: { select: { code: true, name: true } } },
  });
  const configurationSnapshot = {
    productSlug: product.slug,
    quantity: input.quantity,
    options: selected.map(({ id, code, label, group }) => ({ id, code, label, groupCode: group.code, groupName: group.name })),
  };
  const configurationHash = cartConfigurationHash(input);
  const netMinor = BigInt(price.netMinor);
  const vatMinor = BigInt(price.vatMinor);
  const grossMinor = BigInt(price.grossMinor);

  const cart = editableCart ?? await db.cart.create({
    data: { userId, customerAccountId: owner.account.id, currency: 'GBP' },
  });

  const line = await db.$transaction(async (transaction) => {
    const existing = await transaction.cartLine.findUnique({
      where: { cartId_configurationHash: { cartId: cart.id, configurationHash } },
      select: { id: true },
    });
    if (existing) {
      await transaction.cartLineOption.deleteMany({ where: { cartLineId: existing.id } });
      return transaction.cartLine.update({
        where: { id: existing.id },
        data: {
          quantity: input.quantity, priceTierId: tier.id, configurationSnapshot,
          lineNetMinor: netMinor, vatRateBps: price.vatRateBps, vatMinor,
          lineGrossMinor: grossMinor, currency: price.currency,
          options: { create: input.optionValueIds.map((optionValueId) => ({ optionValueId })) },
        },
      });
    }
    return transaction.cartLine.create({
      data: {
        cartId: cart.id, productId: product.id, priceTierId: tier.id,
        quantity: input.quantity, configurationHash, configurationSnapshot,
        lineNetMinor: netMinor, vatRateBps: price.vatRateBps, vatMinor,
        lineGrossMinor: grossMinor, currency: price.currency,
        options: { create: input.optionValueIds.map((optionValueId) => ({ optionValueId })) },
      },
    });
  });
  return { ok: true as const, cartId: cart.id, lineId: line.id };
}

export async function repriceCartLine(userId: string, lineId: string, quantity: number) {
  const owner = await getPurchasingAccount(userId);
  if (!owner || owner.membership.role === 'BILLING') return { ok: false as const, code: 'ACCOUNT_FORBIDDEN' };
  const editableCart = await getEditableCart(userId, owner.account.id);
  if (!editableCart) return { ok: false as const, code: 'CHECKOUT_IN_PROGRESS' };
  const line = await getDb().cartLine.findFirst({
    where: { id: lineId, cartId: editableCart.id, cart: { userId, customerAccountId: owner.account.id, status: 'ACTIVE' } },
    include: { product: true, options: { select: { optionValueId: true } } },
  });
  if (!line) return { ok: false as const, code: 'LINE_NOT_FOUND' };
  const price = await calculateProductPrice({
    productSlug: line.product.slug,
    quantity,
    optionValueIds: line.options.map((option) => option.optionValueId),
  });
  if (!price.ok) return price;
  if (price.product.indicativePricing) return { ok: false as const, code: 'INDICATIVE_PRICE_NOT_ORDERABLE' };
  const tier = await getDb().productPriceTier.findFirst({
    where: {
      productId: line.productId,
      quantity,
      isActive: true,
      startsAt: { lte: new Date() },
      OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
    },
  });
  if (!tier) return { ok: false as const, code: 'PRICE_CHANGED' };

  await getDb().cartLine.update({
    where: { id: line.id },
    data: {
      quantity,
      priceTierId: tier.id,
      lineNetMinor: BigInt(price.netMinor),
      vatRateBps: price.vatRateBps,
      vatMinor: BigInt(price.vatMinor),
      lineGrossMinor: BigInt(price.grossMinor),
      currency: price.currency,
      configurationSnapshot: {
        ...(line.configurationSnapshot as Record<string, unknown>),
        quantity,
      },
      configurationHash: createHash('sha256')
        .update(JSON.stringify({ productSlug: line.product.slug, quantity, selection: line.options.map((option) => option.optionValueId).sort() }))
        .digest('hex'),
    },
  });
  return { ok: true as const };
}

export async function removeCartLine(userId: string, lineId: string) {
  const owner = await getPurchasingAccount(userId);
  if (!owner || owner.membership.role === 'BILLING') return false;
  const editableCart = await getEditableCart(userId, owner.account.id);
  if (!editableCart) return false;
  const result = await getDb().cartLine.deleteMany({
    where: { id: lineId, cartId: editableCart.id, cart: { userId, customerAccountId: owner.account.id, status: 'ACTIVE' } },
  });
  return result.count === 1;
}
