import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductConfigurator } from '@/features/catalog/product-configurator';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDb().product.findFirst({
    where: { slug, status: 'ACTIVE', deletedAt: null },
    select: { name: true, shortDescription: true },
  });
  return product ? { title: product.name, description: product.shortDescription ?? `Configure ${product.name} for your project.` } : { title: 'Product not found' };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getDb().product.findFirst({
    where: { slug, status: 'ACTIVE', deletedAt: null },
    include: {
      category: { select: { name: true } },
      optionGroups: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { values: { where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, label: true } } },
      },
      priceTiers: {
        where: { isActive: true, startsAt: { lte: new Date() }, OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }] },
        orderBy: { quantity: 'asc' },
        select: { quantity: true },
      },
    },
  });
  if (!product) notFound();

  const deliveryMethods = await getDb().deliveryMethod.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { code: true, name: true, estimatedDaysMin: true, estimatedDaysMax: true },
  });

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link className="font-black tracking-tight" href="/">web2print</Link>
          <nav aria-label="Shop navigation" className="flex items-center gap-4 text-sm font-semibold"><Link href="/products">All products</Link><Link href="/login">Sign in</Link><Link href="/cart">Basket</Link></nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link className="hover:text-primary" href="/products">Print products</Link><span className="mx-2">/</span><span>{product.category.name}</span></nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-start">
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">{product.category.name}</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{product.shortDescription ?? 'Choose the size, material, print and finish that suit your project.'}</p>
            {product.isIndicativePricing && <p className="mt-6 max-w-2xl rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950">This is development data for the local demo catalog. The price and delivery estimates are illustrative. An administrator needs to approve commercial terms before an order can be placed.</p>}
            {product.description && <div className="prose mt-7 max-w-none text-sm leading-7 text-muted-foreground">{product.description}</div>}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ['Make it your own', 'Choose material, print and finish options for this product.'],
                ['See the estimate', 'The price updates when you change your options or quantity.'],
                ['Send your artwork', 'Upload print-ready artwork after your product is configured.'],
                ['Track the order', 'Review proof and production updates from your account.'],
              ].map(([title, detail]) => <div className="rounded-2xl border border-border bg-white p-4" key={title}><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p></div>)}
            </div>
          </section>
          <ProductConfigurator
            deliveryMethods={deliveryMethods}
            groups={product.optionGroups.map((group) => ({ id: group.id, code: group.code, name: group.name, required: group.isRequired, values: group.values }))}
            indicativePricing={product.isIndicativePricing}
            quantities={product.priceTiers}
            slug={product.slug}
          />
        </div>
      </div>
    </main>
  );
}
