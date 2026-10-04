import { describe, expect, it } from 'vitest';
import { applyPriceModifiers, calculateVatMinor, priceRequestSchema } from '@/features/catalog/pricing';

describe('print price calculations', () => {
  it('adds fixed option adjustments in pence', () => {
    const amount = applyPriceModifiers(1900n, 100, [
      { modifierType: 'FIXED', modifierValue: 500n },
      { modifierType: 'FIXED', modifierValue: 500n },
    ]);
    expect(amount).toBe(2900n);
  });

  it('multiplies per-unit adjustments by the selected quantity', () => {
    const amount = applyPriceModifiers(1000n, 250, [
      { modifierType: 'PER_UNIT', modifierValue: 3n },
    ]);
    expect(amount).toBe(1750n);
  });

  it('applies percentage adjustments to the running net price with penny rounding', () => {
    const amount = applyPriceModifiers(105n, 100, [
      { modifierType: 'PERCENTAGE_BPS', modifierValue: 1000n },
    ]);
    expect(amount).toBe(116n);
  });

  it('rounds half pennies up when calculating VAT', () => {
    expect(calculateVatMinor(5n, 1000)).toBe(1n);
    expect(calculateVatMinor(105n, 2000)).toBe(21n);
    expect(calculateVatMinor(105n, 0)).toBe(0n);
  });

  it('rejects invalid quantities, negative totals and unbounded modifiers', () => {
    expect(applyPriceModifiers(100n, 0, [])).toBeNull();
    expect(applyPriceModifiers(100n, 1, [{ modifierType: 'FIXED', modifierValue: -101n }])).toBeNull();
    expect(applyPriceModifiers(100n, 1, [{ modifierType: 'PERCENTAGE_BPS', modifierValue: 100_001n }])).toBeNull();
  });

  it('validates pricing API boundaries before database reads', () => {
    expect(priceRequestSchema.safeParse({ productSlug: 'business-cards', quantity: 250, optionValueIds: ['one'] }).success).toBe(true);
    expect(priceRequestSchema.safeParse({ productSlug: '../invalid', quantity: -1, optionValueIds: [] }).success).toBe(false);
    expect(priceRequestSchema.safeParse({ productSlug: 'cards', quantity: 250, optionValueIds: Array.from({ length: 33 }, (_, i) => String(i)) }).success).toBe(false);
  });
});
