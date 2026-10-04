'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type OptionGroup = {
  id: string;
  code: string;
  name: string;
  required: boolean;
  values: Array<{ id: string; label: string }>;
};
type PriceTier = { quantity: number };
type DeliveryMethod = { code: string; name: string; estimatedDaysMin: number; estimatedDaysMax: number };
type PriceResponse = {
  ok: boolean;
  code?: string;
  currency?: string;
  netMinor?: string;
  vatMinor?: string;
  grossMinor?: string;
  vatRateBps?: number;
  indicativePricing?: boolean;
  estimatedOrderGrossMinor?: string;
  delivery?: DeliveryMethod | null;
};

function formatMoney(minor: string | undefined, currency: string | undefined) {
  if (!minor || !currency) return '—';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(Number(minor) / 100);
}

export function ProductConfigurator({
  slug,
  groups,
  quantities,
  deliveryMethods,
  indicativePricing,
}: {
  slug: string;
  groups: OptionGroup[];
  quantities: PriceTier[];
  deliveryMethods: DeliveryMethod[];
  indicativePricing: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.map((group) => [group.id, group.values[0]?.id ?? ''])),
  );
  const [quantity, setQuantity] = useState(quantities[0]?.quantity ?? 0);
  const [deliveryCode, setDeliveryCode] = useState(deliveryMethods[0]?.code ?? '');
  const [price, setPrice] = useState<PriceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const selectionKey = useMemo(() => groups.map((group) => selected[group.id]).join(','), [groups, selected]);

  useEffect(() => {
    if (!quantity || Object.values(selected).some((value) => !value)) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productSlug: slug,
            quantity,
            optionValueIds: Object.values(selected),
            ...(deliveryCode ? { deliveryMethodCode: deliveryCode } : {}),
          }),
          signal: controller.signal,
        });
        const result = (await response.json()) as PriceResponse;
        if (!response.ok || !result.ok) throw new Error(result.code ?? 'PRICE_UNAVAILABLE');
        setPrice(result);
      } catch (cause) {
        if (cause instanceof Error && cause.name !== 'AbortError') {
          setError('A price is not available for this selection. Choose another option or quantity.');
          setPrice(null);
        }
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [slug, quantity, selectionKey, deliveryCode, groups, selected]);

  async function addToBasket() {
    setAdding(true);
    setError(null);
    try {
      const response = await fetch('/api/cart/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: slug, quantity, optionValueIds: Object.values(selected) }),
      });
      if (response.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? 'ADD_TO_BASKET_FAILED');
      }
      setAdded(true);
    } catch {
      setError('We could not add this product to your basket. Please refresh the price and try again.');
    } finally {
      setAdding(false);
    }
  }

  return (
    <section aria-label="Configure your product" className="rounded-3xl border border-border bg-white p-5 sm:p-7">
      <div className="space-y-5">
        {groups.map((group) => (
          <div className="space-y-2" key={group.id}>
            <Label htmlFor={`option-${group.id}`}>{group.name}{group.required ? ' *' : ''}</Label>
            <select
              className="flex h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              id={`option-${group.id}`}
              onChange={(event) => setSelected((current) => ({ ...current, [group.id]: event.target.value }))}
              value={selected[group.id] ?? ''}
            >
              {group.values.map((value) => <option key={value.id} value={value.id}>{value.label}</option>)}
            </select>
          </div>
        ))}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <select className="flex h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" id="quantity" onChange={(event) => setQuantity(Number(event.target.value))} value={quantity}>
            {quantities.map((tier) => <option key={tier.quantity} value={tier.quantity}>{tier.quantity.toLocaleString('en-GB')}</option>)}
          </select>
        </div>
        {deliveryMethods.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery estimate *</Label>
            <select className="flex h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" id="delivery" onChange={(event) => setDeliveryCode(event.target.value)} value={deliveryCode}>
              {deliveryMethods.map((method) => <option key={method.code} value={method.code}>{method.name} · {method.estimatedDaysMin}–{method.estimatedDaysMax} working days</option>)}
            </select>
          </div>
        )}
      </div>

      {indicativePricing && <p className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-950">Indicative development pricing only. Commercial prices and delivery terms are not yet approved; ordering is disabled.</p>}
      {error && <p aria-live="polite" className="mt-5 rounded-xl bg-red-50 px-3 py-3 text-sm text-red-800">{error}</p>}
      <div aria-live="polite" className="mt-6 border-t border-border pt-5">
        <div className="flex items-baseline justify-between"><span className="text-sm font-semibold text-muted-foreground">Including VAT</span><span className="text-2xl font-black tracking-tight">{loading ? 'Calculating…' : formatMoney(price?.estimatedOrderGrossMinor, price?.currency)}</span></div>
        {price && <p className="mt-2 text-xs text-muted-foreground">Print {formatMoney(price.netMinor, price.currency)} + VAT {formatMoney(price.vatMinor, price.currency)} · delivery included in estimate</p>}
      </div>
      {added ? <Link className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground" href="/cart">Added — view basket</Link> : (
        <Button className="mt-5 h-12 w-full" disabled={!price?.ok || indicativePricing || loading || adding} onClick={addToBasket} type="button">
          {indicativePricing ? 'Ordering unavailable' : adding ? 'Adding…' : 'Add to basket'}
        </Button>
      )}
      {indicativePricing && <p className="mt-2 text-center text-xs text-muted-foreground">An administrator must approve this product’s pricing before it can be ordered.</p>}
    </section>
  );
}
