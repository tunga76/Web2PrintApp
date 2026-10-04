'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ReorderButton({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function reorder() {
    setPending(true);
    setError('');
    const response = await fetch(`/api/account/orders/${encodeURIComponent(orderNumber)}/reorder`, { method: 'POST' });
    const result = (await response.json()) as { redirectTo?: string; error?: string };
    setPending(false);
    if (!response.ok || !result.redirectTo) {
      setError(result.error === 'REORDER_PRICE_UNAVAILABLE' ? 'Some saved options or prices are no longer available. Configure those products again.' : 'The order could not be added to your basket.');
      return;
    }
    router.push(result.redirectTo);
    router.refresh();
  }
  return <div><Button disabled={pending} onClick={reorder} type="button">{pending ? 'Checking prices…' : 'Reorder these products'}</Button>{error && <p className="mt-2 max-w-sm text-xs leading-5 text-red-700" role="alert">{error}</p>}</div>;
}
