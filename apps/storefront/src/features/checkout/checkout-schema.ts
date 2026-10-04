import { z } from 'zod';

const addressSchema = z.object({
  recipient: z.string().trim().min(2).max(160),
  company: z.string().trim().max(200).optional().transform((value) => value || null),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional().transform((value) => value || null),
  city: z.string().trim().min(2).max(120),
  region: z.string().trim().max(120).optional().transform((value) => value || null),
  postcode: z.string().trim().toUpperCase().min(5).max(16).regex(/^[A-Z0-9 ]+$/),
  countryCode: z.literal('GB'),
  phone: z.string().trim().max(32).optional().transform((value) => value || null),
});

export const checkoutSchema = z.object({
  deliveryMethodCode: z.string().min(1).max(48),
  shippingAddress: addressSchema,
  billingSameAsShipping: z.boolean(),
  billingAddress: addressSchema.optional(),
}).refine((data) => data.billingSameAsShipping || Boolean(data.billingAddress), {
  path: ['billingAddress'],
  message: 'A billing address is required.',
});

export type CheckoutAddress = z.infer<typeof addressSchema>;
