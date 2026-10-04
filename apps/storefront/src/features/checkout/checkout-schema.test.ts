import { describe, expect, it } from 'vitest';
import { checkoutSchema } from '@/features/checkout/checkout-schema';

const address = {
  recipient: 'Taylor Example',
  company: '',
  line1: '10 Sample Street',
  line2: '',
  city: 'London',
  region: '',
  postcode: 'SW1A 1AA',
  countryCode: 'GB',
  phone: '',
};

describe('checkout address validation', () => {
  it('accepts UK shipping and matching billing addresses', () => {
    expect(checkoutSchema.safeParse({
      deliveryMethodCode: 'standard',
      shippingAddress: address,
      billingSameAsShipping: true,
    }).success).toBe(true);
  });

  it('requires a billing address when billing differs', () => {
    expect(checkoutSchema.safeParse({
      deliveryMethodCode: 'standard',
      shippingAddress: address,
      billingSameAsShipping: false,
    }).success).toBe(false);
  });

  it('rejects non-UK shipping countries and malformed postcode input', () => {
    expect(checkoutSchema.safeParse({ deliveryMethodCode: 'standard', shippingAddress: { ...address, countryCode: 'US' }, billingSameAsShipping: true }).success).toBe(false);
    expect(checkoutSchema.safeParse({ deliveryMethodCode: 'standard', shippingAddress: { ...address, postcode: '!!!' }, billingSameAsShipping: true }).success).toBe(false);
  });
});
