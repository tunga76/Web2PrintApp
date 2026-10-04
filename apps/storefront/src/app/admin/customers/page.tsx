import Link from 'next/link';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim().slice(0, 100);
  const customers = await getDb().customerAccount.findMany({
    where: {
      deletedAt: null,
      ...(query ? { OR: [
        { displayName: { contains: query, mode: 'insensitive' } },
        { legalName: { contains: query, mode: 'insensitive' } },
        { members: { some: { user: { email: { contains: query, mode: 'insensitive' } } } } },
      ] } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { members: { include: { user: { select: { name: true, email: true } } } }, _count: { select: { orders: true } } },
  });
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12"><p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Customer records</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Customers</h1>
      <form action="/admin/customers" className="mt-6 flex max-w-lg gap-2"><input className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-white px-3 text-sm" defaultValue={query} maxLength={100} name="q" placeholder="Search name or email" type="search" /><button className="h-11 rounded-lg bg-primary px-5 text-sm font-bold text-white" type="submit">Search</button></form>
      <div className="mt-7 overflow-x-auto rounded-3xl border border-border bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-muted/70 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-4">Customer account</th><th>Type</th><th>Members</th><th>Orders</th><th>Created</th></tr></thead><tbody>{customers.map((customer) => <tr className="border-t border-border" key={customer.id}><td className="px-5 py-4"><Link className="font-bold text-primary hover:underline" href={`/admin/customers/${customer.id}`}>{customer.displayName}</Link>{customer.legalName && <p className="text-xs text-muted-foreground">{customer.legalName}</p>}</td><td>{customer.type}</td><td>{customer.members.map((member) => member.user.email).filter(Boolean).join(', ') || '—'}</td><td>{customer._count.orders}</td><td>{customer.createdAt.toLocaleDateString('en-GB')}</td></tr>)}</tbody></table>{!customers.length && <p className="p-8 text-center text-sm text-muted-foreground">No customer accounts found.</p>}</div>
    </main>
  );
}
