'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddressPrefix = 'shipping' | 'billing';

type DefaultAddress = { recipient: string; company: string | null; line1: string; line2: string | null; city: string; region: string | null; postcode: string; phone: string | null };

function AddressFields({ prefix, heading, defaultAddress }: { prefix: AddressPrefix; heading: string; defaultAddress?: DefaultAddress | null }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-extrabold">{heading}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2"><Label htmlFor={`${prefix}-recipient`}>Full name</Label><Input autoComplete="name" defaultValue={defaultAddress?.recipient} id={`${prefix}-recipient`} maxLength={160} name={`${prefix}.recipient`} required /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor={`${prefix}-company`}>Company <span className="text-muted-foreground">(optional)</span></Label><Input autoComplete="organization" defaultValue={defaultAddress?.company ?? ''} id={`${prefix}-company`} maxLength={200} name={`${prefix}.company`} /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor={`${prefix}-line1`}>Address line 1</Label><Input autoComplete={prefix === 'shipping' ? 'shipping address-line1' : 'billing address-line1'} defaultValue={defaultAddress?.line1} id={`${prefix}-line1`} maxLength={200} name={`${prefix}.line1`} required /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor={`${prefix}-line2`}>Address line 2 <span className="text-muted-foreground">(optional)</span></Label><Input autoComplete={prefix === 'shipping' ? 'shipping address-line2' : 'billing address-line2'} defaultValue={defaultAddress?.line2 ?? ''} id={`${prefix}-line2`} maxLength={200} name={`${prefix}.line2`} /></div>
        <div className="space-y-2"><Label htmlFor={`${prefix}-city`}>Town or city</Label><Input autoComplete={prefix === 'shipping' ? 'shipping address-level2' : 'billing address-level2'} defaultValue={defaultAddress?.city} id={`${prefix}-city`} maxLength={120} name={`${prefix}.city`} required /></div>
        <div className="space-y-2"><Label htmlFor={`${prefix}-postcode`}>Postcode</Label><Input autoComplete={prefix === 'shipping' ? 'shipping postal-code' : 'billing postal-code'} defaultValue={defaultAddress?.postcode} id={`${prefix}-postcode`} maxLength={16} name={`${prefix}.postcode`} required /></div>
        <div className="space-y-2"><Label htmlFor={`${prefix}-region`}>County <span className="text-muted-foreground">(optional)</span></Label><Input autoComplete={prefix === 'shipping' ? 'shipping address-level1' : 'billing address-level1'} defaultValue={defaultAddress?.region ?? ''} id={`${prefix}-region`} maxLength={120} name={`${prefix}.region`} /></div>
        <div className="space-y-2"><Label htmlFor={`${prefix}-phone`}>Phone <span className="text-muted-foreground">(optional)</span></Label><Input autoComplete="tel" defaultValue={defaultAddress?.phone ?? ''} id={`${prefix}-phone`} maxLength={32} name={`${prefix}.phone`} type="tel" /></div>
      </div>
      <input name={`${prefix}.countryCode`} type="hidden" value="GB" />
    </fieldset>
  );
}

export function CheckoutForm({
  email,
  deliveryMethods,
  defaultAddress,
}: {
  email: string;
  deliveryMethods: Array<{ code: string; name: string; description: string | null; priceNetMinor: string; estimatedDaysMin: number; estimatedDaysMax: number }>;
  defaultAddress?: DefaultAddress | null;
}) {
  const [billingSame, setBillingSame] = useState(true);
  const [deliveryCode, setDeliveryCode] = useState(deliveryMethods[0]?.code ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function getAddress(data: FormData, prefix: AddressPrefix) {
    return {
      recipient: data.get(`${prefix}.recipient`),
      company: data.get(`${prefix}.company`),
      line1: data.get(`${prefix}.line1`),
      line2: data.get(`${prefix}.line2`),
      city: data.get(`${prefix}.city`),
      region: data.get(`${prefix}.region`),
      postcode: data.get(`${prefix}.postcode`),
      countryCode: data.get(`${prefix}.countryCode`),
      phone: data.get(`${prefix}.phone`),
    };
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const payload = {
      deliveryMethodCode: deliveryCode,
      shippingAddress: getAddress(data, 'shipping'),
      billingSameAsShipping: billingSame,
      ...(billingSame ? {} : { billingAddress: getAddress(data, 'billing') }),
    };
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        const known: Record<string, string> = {
          STRIPE_TEST_CONFIGURATION_REQUIRED: 'Stripe test credentials are not configured for this environment.',
          INDICATIVE_PRICE_NOT_ORDERABLE: 'This development sample cannot be ordered. An administrator must approve its price first.',
          CART_PRICE_CHANGED: 'A product price or configuration changed. Return to your basket and review it.',
          DELIVERY_UNAVAILABLE: 'That delivery option is no longer available. Refresh and choose another.',
          EMPTY_CART: 'Your basket is empty.',
          PAYMENT_PROVIDER_UNAVAILABLE: 'The test payment service could not start. Try again in a moment.',
        };
        throw new Error(known[result.error ?? ''] ?? 'We could not start checkout. Review your basket and try again.');
      }
      window.location.assign(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not start checkout. Try again.');
      setPending(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={submit}>
      <div className="rounded-2xl border border-border bg-white p-5">
        <p className="text-sm font-semibold text-muted-foreground">Order updates will be sent to</p>
        <p className="mt-1 font-bold">{email}</p>
      </div>
      <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
        <Label htmlFor="deliveryMethodCode">Delivery option</Label>
        <select className="flex h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" id="deliveryMethodCode" onChange={(event) => setDeliveryCode(event.target.value)} value={deliveryCode}>
          {deliveryMethods.map((method) => <option key={method.code} value={method.code}>{method.name} · {method.estimatedDaysMin}–{method.estimatedDaysMax} working days · £{(Number(method.priceNetMinor) / 100).toFixed(2)} + VAT</option>)}
        </select>
        {deliveryMethods.find((method) => method.code === deliveryCode)?.description && <p className="text-sm leading-5 text-muted-foreground">{deliveryMethods.find((method) => method.code === deliveryCode)?.description}</p>}
      </div>
      <div className="rounded-2xl border border-border bg-white p-5"><AddressFields defaultAddress={defaultAddress} heading="Delivery address" prefix="shipping" /></div>
      <div className="rounded-2xl border border-border bg-white p-5">
        <label className="flex items-center gap-3 text-sm font-semibold"><input checked={billingSame} className="size-4 accent-primary" onChange={(event) => setBillingSame(event.target.checked)} type="checkbox" />Billing address is the same as delivery</label>
        {!billingSame && <div className="mt-6"><AddressFields heading="Billing address" prefix="billing" /></div>}
      </div>
      {error && <p aria-live="polite" className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p>}
      <div className="rounded-2xl bg-[#172b3a] p-5 text-sm leading-6 text-white/80">
        <p className="font-bold text-white">Secure test payment</p>
        <p className="mt-1">You’ll enter payment details on Stripe Checkout in test mode. No live payment is enabled.</p>
      </div>
      <Button className="h-12 w-full" disabled={pending || !deliveryCode} type="submit">{pending ? 'Opening secure checkout…' : 'Continue to test payment'}</Button>
    </form>
  );
}
