import { z } from 'zod';
import { getDb } from '@/lib/db';

export const priceRequestSchema = z.object({
  productSlug: z.string().min(1).max(160),
  quantity: z.number().int().positive().max(1_000_000),
  optionValueIds: z.array(z.string().min(1).max(40)).max(32),
  deliveryMethodCode: z.string().min(1).max(48).optional(),
});

export function calculateVatMinor(amount: bigint, basisPoints: number) {
  const numerator = amount * BigInt(basisPoints);
  return (numerator + 5_000n) / 10_000n;
}

function ensureSafeMoney(value: bigint) {
  if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Calculated money is outside the supported range.');
  }
  return value.toString();
}

export function applyPriceModifiers(
  baseAmount: bigint,
  quantity: number,
  modifiers: Array<{ modifierType: 'NONE' | 'FIXED' | 'PER_UNIT' | 'PERCENTAGE_BPS'; modifierValue: bigint }>,
) {
  if (baseAmount < 0n || !Number.isSafeInteger(quantity) || quantity < 1) return null;
  let net = baseAmount;
  for (const modifier of modifiers) {
    if (modifier.modifierType === 'FIXED') net += modifier.modifierValue;
    if (modifier.modifierType === 'PER_UNIT') net += modifier.modifierValue * BigInt(quantity);
    if (modifier.modifierType === 'PERCENTAGE_BPS') {
      const basisPoints = Number(modifier.modifierValue);
      if (!Number.isSafeInteger(basisPoints) || basisPoints < 0 || basisPoints > 100_000) return null;
      net += calculateVatMinor(net, basisPoints);
    }
    if (net < 0n || net > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  }
  return net;
}

export async function calculateProductPrice(input: z.infer<typeof priceRequestSchema>) {
  const db = getDb();
  const now = new Date();
  const product = await db.product.findFirst({
    where: { slug: input.productSlug, status: 'ACTIVE', deletedAt: null },
    include: {
      optionGroups: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { values: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      },
      priceTiers: {
        where: {
          quantity: input.quantity,
          isActive: true,
          startsAt: { lte: now },
          OR: [{ endsAt: null }, { endsAt: { gt: now } }],
        },
        take: 1,
      },
    },
  });
  if (!product) return { ok: false as const, code: 'PRODUCT_UNAVAILABLE' };
  const tier = product.priceTiers[0];
  if (!tier) return { ok: false as const, code: 'QUANTITY_UNAVAILABLE' };

  const uniqueIds = new Set(input.optionValueIds);
  if (uniqueIds.size !== input.optionValueIds.length) {
    return { ok: false as const, code: 'DUPLICATE_OPTIONS' };
  }
  const selectedValues = product.optionGroups.flatMap((group) =>
    group.values.filter((value) => uniqueIds.has(value.id)).map((value) => ({ group, value })),
  );
  if (selectedValues.length !== uniqueIds.size) {
    return { ok: false as const, code: 'INVALID_OPTIONS' };
  }
  for (const group of product.optionGroups) {
    const selectedInGroup = selectedValues.filter((selection) => selection.group.id === group.id);
    if (group.isRequired && selectedInGroup.length === 0) {
      return { ok: false as const, code: 'OPTIONS_REQUIRED' };
    }
    if (!group.allowMultiple && selectedInGroup.length > 1) {
      return { ok: false as const, code: 'TOO_MANY_OPTIONS' };
    }
  }

  if (uniqueIds.size > 1) {
    const conflicts = await db.productOptionIncompatibility.findFirst({
      where: {
        OR: [
          { leftValueId: { in: [...uniqueIds] }, rightValueId: { in: [...uniqueIds] } },
          { rightValueId: { in: [...uniqueIds] }, leftValueId: { in: [...uniqueIds] } },
        ],
      },
      select: { id: true },
    });
    if (conflicts) return { ok: false as const, code: 'INCOMPATIBLE_OPTIONS' };
  }

  const net = applyPriceModifiers(
    tier.basePriceMinor,
    input.quantity,
    selectedValues.map(({ value }) => ({ modifierType: value.modifierType, modifierValue: value.modifierValue })),
  );
  if (net === null) return { ok: false as const, code: 'INVALID_PRICE_CONFIGURATION' };

  const vatRateBps = tier.vatRateBps ?? product.vatRateBps;
  if (!Number.isSafeInteger(vatRateBps) || vatRateBps < 0 || vatRateBps > 100_000) {
    return { ok: false as const, code: 'INVALID_VAT_CONFIGURATION' };
  }
  const vat = calculateVatMinor(net, vatRateBps);
  let delivery: null | {
    code: string;
    name: string;
    priceNetMinor: string;
    vatRateBps: number;
    vatMinor: string;
    grossMinor: string;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
  } = null;
  if (input.deliveryMethodCode) {
    const method = await db.deliveryMethod.findFirst({
      where: { code: input.deliveryMethodCode, isActive: true },
    });
    if (!method) return { ok: false as const, code: 'DELIVERY_UNAVAILABLE' };
    const deliveryVat = calculateVatMinor(method.priceNetMinor, method.vatRateBps);
    delivery = {
      code: method.code,
      name: method.name,
      priceNetMinor: ensureSafeMoney(method.priceNetMinor),
      vatRateBps: method.vatRateBps,
      vatMinor: ensureSafeMoney(deliveryVat),
      grossMinor: ensureSafeMoney(method.priceNetMinor + deliveryVat),
      estimatedDaysMin: method.estimatedDaysMin,
      estimatedDaysMax: method.estimatedDaysMax,
    };
  }
  return {
    ok: true as const,
    product: { slug: product.slug, name: product.name, indicativePricing: product.isIndicativePricing },
    quantity: input.quantity,
    currency: tier.currency,
    netMinor: ensureSafeMoney(net),
    vatRateBps,
    vatMinor: ensureSafeMoney(vat),
    grossMinor: ensureSafeMoney(net + vat),
    delivery,
    estimatedOrderGrossMinor: ensureSafeMoney(net + vat + (delivery ? BigInt(delivery.grossMinor) : 0n)),
  };
}
