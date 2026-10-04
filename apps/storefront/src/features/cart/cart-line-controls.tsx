'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CartLineControls({ id, quantity, quantities, locked = false }: { id: string; quantity: number; quantities: number[]; locked?: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState(String(quantity));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update() {
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/cart/lines/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: Number(selected) }),
    });
    setBusy(false);
    if (!response.ok) {
      setError('That quantity is not available. Choose a listed quantity.');
      return;
    }
    router.refresh();
  }

  async function remove() {
    setBusy(true);
    const response = await fetch(`/api/cart/lines/${id}`, { method: 'DELETE' });
    setBusy(false);
    if (!response.ok) {
      setError('This item could not be removed. Refresh and try again.');
      return;
    }
    router.refresh();
  }

  if (locked) return <p className="mt-4 text-xs text-muted-foreground">This basket is locked while Stripe Checkout is open. Complete or cancel the payment session to edit it.</p>;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={`quantity-${id}`}>Quantity</label>
      <select className="h-9 rounded-lg border border-input bg-white px-2 text-sm" id={`quantity-${id}`} onChange={(event) => setSelected(event.target.value)} value={selected}>
        {quantities.includes(quantity) ? null : <option value={quantity}>{quantity.toLocaleString('en-GB')}</option>}
        {quantities.map((value) => <option key={value} value={value}>{value.toLocaleString('en-GB')}</option>)}
      </select>
      <Button disabled={busy || selected === String(quantity)} onClick={update} size="sm" type="button" variant="outline">Update</Button>
      <Button disabled={busy} onClick={remove} size="sm" type="button" variant="ghost">Remove</Button>
      {error && <p className="w-full text-xs text-red-700" role="alert">{error}</p>}
    </div>
  );
}
