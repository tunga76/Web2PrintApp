import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Print products' };

function formatMoney(netMinor: bigint, vatRateBps: number) {
  const vatMinor = (netMinor * BigInt(vatRateBps) + 5000n) / 10000n;
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(netMinor + vatMinor) / 100);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 100);
  const category = params.category?.trim().slice(0, 120);
  const products = await getDb().product.findMany({
    where: {
      status: 'ACTIVE',
      deletedAt: null,
      ...(category ? { category: { slug: category, isActive: true } } : {}),
      ...(query ? { OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
      ] } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      category: { select: { name: true } },
      priceTiers: {
        where: { isActive: true, startsAt: { lte: new Date() }, OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }] },
        orderBy: { quantity: 'asc' },
        take: 1,
      },
    },
  });
  const categories = await getDb().category.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: { slug: true, name: true },
  });

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="font-black tracking-tight" href="/">web2print</Link>
          <nav aria-label="Account" className="flex items-center gap-4 text-sm font-semibold"><Link href="/login">Sign in</Link><Link href="/cart">Basket</Link></nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Print products</p>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><h1 className="text-4xl font-black tracking-[-0.05em]">Find your next print.</h1><p className="mt-2 max-w-xl leading-6 text-muted-foreground">Choose a product and configure the print specifications that work for you.</p></div>
          <form action="/products" className="flex w-full max-w-md gap-2">
            <input className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" defaultValue={query} maxLength={100} name="q" placeholder="Search print products" type="search" />
            <button className="h-11 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground" type="submit">Search</button>
          </form>
        </div>
        {categories.length > 0 && <nav aria-label="Product categories" className="mt-8 flex flex-wrap gap-2">{categories.map((item) => <Link className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === item.slug ? 'border-primary bg-primary text-white' : 'border-border bg-white text-foreground hover:border-primary'}`} href={`/products?category=${encodeURIComponent(item.slug)}`} key={item.slug}>{item.name}</Link>)}</nav>}
        {products.length ? (
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const tier = product.priceTiers[0];
              const vat = tier?.vatRateBps ?? product.vatRateBps;
              return (
                <Link className="group rounded-3xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-38px_rgba(23,43,58,0.4)]" href={`/products/${product.slug}`} key={product.id}>
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-primary">{product.category.name}</p>
                  <h2 className="mt-3 text-xl font-extrabold tracking-tight">{product.name}</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{product.shortDescription ?? 'Configure size, material and finishing.'}</p>
                  <div className="mt-5 border-t border-border pt-4">
                    {product.isIndicativePricing && <p className="mb-2 text-xs font-bold text-amber-800">Illustrative development price</p>}
                    {tier ? <p className="text-sm text-muted-foreground">From <span className="text-lg font-black text-foreground">{formatMoney(tier.basePriceMinor, vat)}</span> incl. VAT <span className="text-xs">for {tier.quantity.toLocaleString('en-GB')}</span></p> : <p className="text-sm text-muted-foreground">Pricing currently unavailable</p>}
                  </div>
                  <span className="mt-5 inline-flex text-sm font-bold text-primary group-hover:underline">Configure product <span aria-hidden="true" className="ml-2">↗</span></span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-white/70 px-6 py-14 text-center">
            <h2 className="text-xl font-extrabold">No products found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try another search or clear the category filter.</p>
            <Link className="mt-5 inline-flex font-bold text-primary hover:underline" href="/products">View all products</Link>
          </div>
        )}
      </div>
    </main>
  );
}
