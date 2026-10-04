import Link from 'next/link';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatMoney(minor: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(minor) / 100);
}

export default async function AdminOrdersPage() {
  const orders = await getDb().order.findMany({
    orderBy: { placedAt: 'desc' },
    take: 100,
    include: { customerAccount: { select: { displayName: true } }, placedBy: { select: { name: true, email: true } }, payments: { orderBy: { attempt: 'desc' }, take: 1 }, _count: { select: { lines: true } } },
  });
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Order operations</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Orders</h1>
      <div className="mt-7 overflow-x-auto rounded-3xl border border-border bg-white"><table className="w-full min-w-[880px] text-left text-sm"><thead className="bg-muted/70 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-4">Order</th><th>Customer</th><th>Placed</th><th>Status</th><th>Payment</th><th>Items</th><th className="px-5">Total</th></tr></thead><tbody>{orders.map((order) => <tr className="border-t border-border" key={order.id}><td className="px-5 py-4"><Link className="font-bold text-primary hover:underline" href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link></td><td><p className="font-semibold">{order.customerAccount.displayName}</p><p className="text-xs text-muted-foreground">{order.customerEmailSnapshot}</p></td><td>{order.placedAt.toLocaleDateString('en-GB')}</td><td><span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{order.status.toLowerCase().replaceAll('_', ' ')}</span></td><td>{order.payments[0]?.status.toLowerCase() ?? '—'}</td><td>{order._count.lines}</td><td className="px-5 font-bold">{formatMoney(order.totalGrossMinor)}</td></tr>)}</tbody></table>{!orders.length && <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p>}</div>
    </main>
  );
}
