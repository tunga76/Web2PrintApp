import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getPurchasingAccount } from '@/features/cart/cart-service';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your account', robots: { index: false, follow: false } };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const owner = await getPurchasingAccount(session.user.id);
  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link className="font-black tracking-tight" href="/">web2print</Link><Link className="text-sm font-semibold" href="/cart">Basket</Link></div></header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Your account</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Hello{session.user.name ? `, ${session.user.name}` : ''}.</h1>
        {owner && <p className="mt-3 text-sm text-muted-foreground">{owner.account.displayName} · {owner.account.type === 'BUSINESS' ? 'Business account' : 'Personal account'}</p>}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['/account/orders', 'Orders', 'Track production and delivery, approve proofs and reorder past print.'],
            ['/account/artwork', 'Artwork', 'Review the artwork files saved to your account.'],
            ['/cart', 'Basket', 'Continue configuring products and finish checkout.'],
          ].map(([href, title, detail]) => <Link className="rounded-3xl border border-border bg-white p-6 transition hover:border-primary/50 hover:shadow-sm" href={href} key={href}><h2 className="text-lg font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p><span className="mt-5 inline-flex text-sm font-bold text-primary">Open <span aria-hidden="true" className="ml-2">↗</span></span></Link>)}
        </div>
      </div>
    </main>
  );
}
