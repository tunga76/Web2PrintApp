import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Payment update', robots: { index: false, follow: false } };

function formatMoney(value: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value) / 100);
}

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const { order: orderId } = await searchParams;
  if (!orderId) redirect('/account/orders');
  const order = await getDb().order.findFirst({
    where: { id: orderId, customerAccount: { members: { some: { userId: session.user.id } } } },
    include: { lines: { select: { id: true, productNameSnapshot: true, quantity: true } } },
  });
  if (!order) redirect('/account/orders');
  const confirmed = order.status !== 'PENDING_PAYMENT';

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-7 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">{confirmed ? 'Order received' : 'Payment confirmation'}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{confirmed ? 'Thanks. Your order is in.' : 'We’re confirming your payment.'}</h1>
        <p className="mt-3 leading-7 text-muted-foreground">Order <strong className="text-foreground">{order.orderNumber}</strong> is currently <strong className="text-foreground">{order.status.toLowerCase().replaceAll('_', ' ')}</strong>.</p>
        {!confirmed && <p className="mt-4 text-sm leading-6 text-muted-foreground">Stripe sends payment confirmation separately. This page only shows an order as paid after the signed payment event is recorded.</p>}
        <ul className="mt-6 divide-y divide-border border-y border-border">{order.lines.map((line) => <li className="flex justify-between gap-4 py-3 text-sm" key={line.id}><span>{line.productNameSnapshot} × {line.quantity.toLocaleString('en-GB')}</span></li>)}</ul>
        <div className="mt-4 flex justify-between"><span className="font-bold">Order total</span><span className="font-black">{formatMoney(order.totalGrossMinor)}</span></div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground" href="/account/orders">View your orders</Link><Link className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-bold" href="/products">Continue shopping</Link></div>
      </div>
    </main>
  );
}
