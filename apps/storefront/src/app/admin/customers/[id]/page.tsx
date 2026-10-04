import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatMoney(minor: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(minor) / 100);
}

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getDb().customerAccount.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true, role: true, lastLoginAt: true, deletedAt: true } } } },
      addresses: { where: { deletedAt: null }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] },
      orders: { orderBy: { placedAt: 'desc' }, take: 50, select: { id: true, orderNumber: true, status: true, totalGrossMinor: true, placedAt: true } },
    },
  });
  if (!customer) notFound();
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12"><Link className="text-sm font-semibold text-primary hover:underline" href="/admin/customers">← Customers</Link><p className="mt-6 text-xs font-bold uppercase tracking-[0.17em] text-primary">{customer.type} account</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">{customer.displayName}</h1>{customer.legalName && <p className="mt-2 text-muted-foreground">Legal name: {customer.legalName}</p>}<p className="mt-2 text-sm text-muted-foreground">Created {customer.createdAt.toLocaleDateString('en-GB')} · VAT number {customer.vatNumber ?? 'not provided'}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-3xl border border-border bg-white p-5"><h2 className="text-lg font-extrabold">Account members</h2><ul className="mt-4 divide-y divide-border">{customer.members.map((member) => <li className="py-3" key={member.userId}><div className="flex justify-between"><p className="font-bold">{member.user.name ?? member.user.email}</p><span className="text-xs font-bold">{member.role}</span></div><p className="mt-1 text-sm text-muted-foreground">{member.user.email} · {member.user.role}{member.user.deletedAt ? ' · disabled' : ''}</p><p className="mt-1 text-xs text-muted-foreground">Last sign-in: {member.user.lastLoginAt?.toLocaleString('en-GB') ?? 'Never'}</p></li>)}</ul></section>
        <section className="rounded-3xl border border-border bg-white p-5"><h2 className="text-lg font-extrabold">Saved addresses</h2>{customer.addresses.length ? <ul className="mt-4 space-y-3">{customer.addresses.map((address) => <li className="rounded-2xl bg-muted/50 p-3 text-sm leading-6" key={address.id}><p className="font-bold">{address.label}{address.isDefault ? ' · Default' : ''}</p><address className="not-italic text-muted-foreground">{address.recipient}<br />{address.company && <>{address.company}<br /></>}{address.line1}<br />{address.line2 && <>{address.line2}<br /></>}{address.city}, {address.postcode}</address></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No saved addresses.</p>}</section></div>
      <section className="mt-6 rounded-3xl border border-border bg-white p-5"><h2 className="text-lg font-extrabold">Order history</h2><ul className="mt-4 divide-y divide-border">{customer.orders.map((order) => <li className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center" key={order.id}><div><Link className="font-bold text-primary hover:underline" href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link><p className="text-xs text-muted-foreground">{order.placedAt.toLocaleDateString('en-GB')}</p></div><span className="text-sm">{order.status.toLowerCase().replaceAll('_', ' ')}</span><strong>{formatMoney(order.totalGrossMinor)}</strong></li>)}</ul>{!customer.orders.length && <p className="mt-3 text-sm text-muted-foreground">No orders.</p>}</section>
    </main>
  );
}
