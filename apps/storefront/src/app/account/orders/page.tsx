import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your orders', robots: { index: false, follow: false } };

function formatMoney(value: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value) / 100);
}

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner) redirect('/account');
  const orders = await getDb().order.findMany({
    where: { customerAccountId: owner.account.id },
    orderBy: { placedAt: 'desc' },
    include: { lines: { select: { id: true, productNameSnapshot: true, quantity: true, productionJob: { select: { status: true } }, proof: { where: { status: 'AWAITING_CUSTOMER' }, select: { id: true } } } }, shipments: { orderBy: { createdAt: 'desc' } } },
  });
  return (
    <main className="min-h-screen"><header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link className="font-black tracking-tight" href="/">web2print</Link><Link className="text-sm font-semibold" href="/account">Your account</Link></div></header>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14"><p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Account</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Your orders</h1>
        {orders.length ? <ul className="mt-8 space-y-4">{orders.map((order) => <li className="rounded-3xl border border-border bg-white p-5 sm:p-6" key={order.id}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><Link className="text-lg font-extrabold text-primary hover:underline" href={`/account/orders/${order.orderNumber}`}>{order.orderNumber}</Link><p className="mt-1 text-sm text-muted-foreground">Placed {order.placedAt.toLocaleDateString('en-GB')} · {order.lines.length} {order.lines.length === 1 ? 'product' : 'products'}</p></div><div className="sm:text-right"><p className="font-black">{formatMoney(order.totalGrossMinor)}</p><span className="mt-1 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-bold">{order.status.toLowerCase().replaceAll('_', ' ')}</span></div></div><ul className="mt-4 flex flex-wrap gap-2">{order.lines.map((line) => <li className="rounded-full border border-border px-3 py-1 text-xs" key={line.id}>{line.productNameSnapshot} × {line.quantity.toLocaleString('en-GB')}</li>)}</ul>
          {order.lines.some((line) => line.proof.length > 0) && <p className="mt-3 text-sm font-bold text-amber-800">A proof is waiting for your approval.</p>}
          {order.shipments.map((shipment) => shipment.trackingUrl && <a className="mt-3 inline-flex text-sm font-bold text-primary hover:underline" href={shipment.trackingUrl} key={shipment.id} rel="noreferrer" target="_blank">Track with {shipment.carrierName ?? 'carrier'} ↗</a>)}
        </li>)}</ul> : <div className="mt-8 rounded-3xl border border-dashed border-border bg-white p-10 text-center"><h2 className="font-extrabold">No orders yet</h2><p className="mt-2 text-sm text-muted-foreground">Your order updates will appear here.</p><Link className="mt-5 inline-flex font-bold text-primary hover:underline" href="/products">Browse print products</Link></div>}
      </div>
    </main>
  );
}
