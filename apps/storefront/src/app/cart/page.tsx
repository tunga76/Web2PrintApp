import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { CartLineControls } from '@/features/cart/cart-line-controls';
import { CartLineArtwork } from '@/features/cart/cart-line-artwork';
import { calculateProductPrice } from '@/features/catalog/pricing';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your basket', robots: { index: false, follow: false } };

function formatMoney(minor: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(minor) / 100);
}

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?callbackUrl=%2Fcart');
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner) return <main className="mx-auto max-w-4xl px-5 py-16"><h1 className="text-3xl font-black">No customer account is linked to your profile.</h1></main>;
  const cart = await getDb().cart.findFirst({
    where: { userId: session.user.id, customerAccountId: owner.account.id, status: 'ACTIVE' },
    orderBy: { updatedAt: 'desc' },
    include: {
      order: { include: { payments: { orderBy: { attempt: 'desc' }, take: 1 } } },
      lines: {
        orderBy: { createdAt: 'asc' },
        include: {
          product: { include: { priceTiers: { where: { isActive: true }, orderBy: { quantity: 'asc' }, select: { quantity: true } } } },
          options: { include: { optionValue: { include: { group: { select: { name: true } } } } } },
          artwork: { include: { artwork: { select: { id: true, originalFilename: true } } } },
        },
      },
    },
  });
  const lines = cart?.lines ?? [];
  const approvedArtwork = await getDb().artworkAsset.findMany({
    where: { customerAccountId: owner.account.id, status: 'APPROVED', deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true, originalFilename: true },
  });
  const currentPrices = await Promise.all(lines.map((line) =>
    calculateProductPrice({
      productSlug: line.product.slug,
      quantity: line.quantity,
      optionValueIds: line.options.map((option) => option.optionValueId),
    }),
  ));
  const hasUnavailableOrIndicative = currentPrices.some((price) => !price.ok || price.product.indicativePricing);
  const latestPayment = cart?.order?.payments[0];
  const checkoutInProgress = cart?.order?.status === 'PENDING_PAYMENT' && (latestPayment?.status === 'PENDING' || latestPayment?.status === 'PROCESSING');
  const subtotalNet = lines.reduce((sum, line) => sum + line.lineNetMinor, 0n);
  const tax = lines.reduce((sum, line) => sum + line.vatMinor, 0n);
  const total = lines.reduce((sum, line) => sum + line.lineGrossMinor, 0n);

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link className="font-black tracking-tight" href="/">web2print</Link><Link className="text-sm font-semibold" href="/products">Continue shopping</Link></div></header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Your order</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Basket</h1>
        {!lines.length ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-white px-6 py-14 text-center"><h2 className="text-xl font-extrabold">Your basket is empty</h2><p className="mt-2 text-sm text-muted-foreground">Choose a print product to start configuring your order.</p><Link className="mt-5 inline-flex font-bold text-primary hover:underline" href="/products">Browse print products</Link></div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <section aria-label="Basket items" className="space-y-4">
              {lines.map((line, index) => {
                const price = currentPrices[index];
                return (
                  <article className="rounded-3xl border border-border bg-white p-5 sm:p-6" key={line.id}>
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <Link className="text-lg font-extrabold hover:text-primary" href={`/products/${line.product.slug}`}>{line.product.name}</Link>
                        <p className="mt-1 text-sm text-muted-foreground">{line.quantity.toLocaleString('en-GB')} copies</p>
                        <ul className="mt-3 flex flex-wrap gap-2">{line.options.map(({ optionValue }) => <li className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground" key={optionValue.id}>{optionValue.group.name}: {optionValue.label}</li>)}</ul>
                        {line.product.isIndicativePricing && <p className="mt-3 text-sm font-semibold text-amber-800">Indicative sample item. It cannot be ordered until pricing is approved.</p>}
                        {(!price?.ok || !line.product.isIndicativePricing) && price?.ok === false && <p className="mt-3 text-sm font-semibold text-red-700">This price or configuration has changed. Update the item or remove it.</p>}
                      </div>
                      <p className="shrink-0 text-lg font-black">{formatMoney(line.lineGrossMinor)}</p>
                    </div>
                    <CartLineControls id={line.id} quantities={line.product.priceTiers.map((tier) => tier.quantity)} quantity={line.quantity} locked={checkoutInProgress} />
                    <CartLineArtwork lineId={line.id} attached={line.artwork.map(({ artwork }) => artwork)} available={approvedArtwork} locked={checkoutInProgress} />
                  </article>
                );
              })}
            </section>
            <aside className="h-fit rounded-3xl border border-border bg-white p-5 sm:p-6">
              <h2 className="text-lg font-extrabold">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Items, ex VAT</dt><dd className="font-semibold">{formatMoney(subtotalNet)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">VAT</dt><dd className="font-semibold">{formatMoney(tax)}</dd></div><div className="flex justify-between border-t border-border pt-3 text-base"><dt className="font-bold">Items total</dt><dd className="font-black">{formatMoney(total)}</dd></div></dl>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">Delivery is calculated separately at checkout. Prices are checked again before payment.</p>
              {checkoutInProgress && <p className="mt-4 rounded-xl bg-sky-50 p-3 text-sm leading-5 text-sky-900">A Stripe checkout session is open for this basket. Continue to return to the current payment session.</p>}
              {hasUnavailableOrIndicative && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900">Remove sample items or wait for approved prices before checking out.</p>}
              <Link aria-disabled={hasUnavailableOrIndicative} className={`mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg text-sm font-bold ${hasUnavailableOrIndicative ? 'pointer-events-none bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`} href="/checkout">Continue to checkout</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
