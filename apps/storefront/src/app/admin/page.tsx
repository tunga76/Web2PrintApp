import Link from 'next/link';
import { getDb } from '@/lib/db';

export default async function AdminDashboard() {
  const db = getDb();
  const [openOrders, customers, activeProducts, artworkReview, jobs, recentOrders] = await Promise.all([
    db.order.count({ where: { status: { in: ['CONFIRMED', 'IN_PRODUCTION', 'PARTIALLY_SHIPPED'] } } }),
    db.customerAccount.count({ where: { deletedAt: null } }),
    db.product.count({ where: { status: 'ACTIVE', deletedAt: null } }),
    db.artworkAsset.count({ where: { status: 'QUARANTINED', deletedAt: null } }),
    db.productionJob.groupBy({ by: ['status'], _count: { id: true } }),
    db.order.findMany({ take: 6, orderBy: { placedAt: 'desc' }, include: { customerAccount: { select: { displayName: true } } } }),
  ]);
  const metrics = [
    ['Open orders', openOrders, '/admin/orders'],
    ['Customer accounts', customers, '/admin/customers'],
    ['Published products', activeProducts, '/admin/products'],
    ['Artwork awaiting review', artworkReview, '/admin/orders'],
  ];
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Operations overview</p>
      <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value, href]) => <Link className="rounded-3xl border border-border bg-white p-5 transition hover:border-primary/40" href={String(href)} key={String(label)}><p className="text-sm font-semibold text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></Link>)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-border bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Recent orders</h2><Link className="text-sm font-bold text-primary hover:underline" href="/admin/orders">All orders</Link></div><ul className="mt-4 divide-y divide-border">{recentOrders.map((order) => <li className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center" key={order.id}><div><Link className="font-bold hover:text-primary" href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link><p className="text-xs text-muted-foreground">{order.customerAccount.displayName} · {order.placedAt.toLocaleDateString('en-GB')}</p></div><span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-bold">{order.status.toLowerCase().replaceAll('_', ' ')}</span></li>)}</ul></section>
        <section className="rounded-3xl border border-border bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Production queue</h2><Link className="text-sm font-bold text-primary hover:underline" href="/admin/production">Open queue</Link></div><ul className="mt-4 space-y-3">{jobs.length ? jobs.map((entry) => <li className="flex justify-between text-sm" key={entry.status}><span className="text-muted-foreground">{entry.status.toLowerCase().replaceAll('_', ' ')}</span><strong>{entry._count.id}</strong></li>) : <li className="text-sm text-muted-foreground">No production jobs yet.</li>}</ul></section>
      </div>
    </main>
  );
}
