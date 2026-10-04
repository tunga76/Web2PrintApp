import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { CheckoutForm } from '@/features/checkout/checkout-form';
import { getPurchasingAccount } from '@/features/cart/cart-service';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } };

function formatMoney(value: bigint) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value) / 100);
}

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?callbackUrl=%2Fcheckout');
  const owner = await getPurchasingAccount(session.user.id);
  if (!owner?.user.email) redirect('/cart');
  const defaultAddress = await getDb().customerAddress.findFirst({
    where: { accountId: owner.account.id, deletedAt: null },
    orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    select: { recipient: true, company: true, line1: true, line2: true, city: true, region: true, postcode: true, phone: true },
  });
  const cart = await getDb().cart.findFirst({
    where: { userId: session.user.id, customerAccountId: owner.account.id, status: 'ACTIVE' },
    include: { lines: { include: { product: true } } },
  });
  if (!cart?.lines.length) redirect('/cart');
  const methods = await getDb().deliveryMethod.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  const params = await searchParams;
  const indicative = cart.lines.some((line) => line.product.isIndicativePricing);
  const subtotal = cart.lines.reduce((sum, line) => sum + line.lineGrossMinor, 0n);

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link className="font-black tracking-tight" href="/">web2print</Link><Link className="text-sm font-semibold" href="/cart">Back to basket</Link></div></header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Checkout</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Delivery and payment</h1>
        {params.cancelled === '1' && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Payment was not completed. Your basket is still here if you want to try again.</p>}
        {indicative && <p className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">This local sample basket uses illustrative prices. Commercial approval is required before checkout can continue.</p>}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <CheckoutForm deliveryMethods={methods.map((method) => ({ ...method, priceNetMinor: method.priceNetMinor.toString() }))} email={owner.user.email} defaultAddress={defaultAddress ?? undefined} />
          <aside className="h-fit rounded-3xl border border-border bg-white p-5 sm:p-6">
            <h2 className="text-lg font-extrabold">Order summary</h2>
            <ul className="mt-4 divide-y divide-border">{cart.lines.map((line) => <li className="flex justify-between gap-4 py-3 text-sm" key={line.id}><span>{line.product.name} <span className="text-muted-foreground">× {line.quantity.toLocaleString('en-GB')}</span></span><span className="shrink-0 font-semibold">{formatMoney(line.lineGrossMinor)}</span></li>)}</ul>
            <div className="flex justify-between border-t border-border pt-4"><span className="font-bold">Products incl. VAT</span><span className="font-black">{formatMoney(subtotal)}</span></div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Delivery and its VAT are added below. The final total is recalculated before payment.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
