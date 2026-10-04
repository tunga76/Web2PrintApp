import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/login?callbackUrl=%2Fadmin');
  return (
    <div className="min-h-screen bg-[#f5f7f4]">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-4 sm:px-8 md:flex-row md:items-center">
          <Link className="font-black tracking-tight" href="/admin">Web2Print <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-wider text-primary">Admin</span></Link>
          <nav aria-label="Admin navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted-foreground">
            <Link className="hover:text-primary" href="/admin/products">Products</Link>
            <Link className="hover:text-primary" href="/admin/orders">Orders</Link>
            <Link className="hover:text-primary" href="/admin/customers">Customers</Link>
            <Link className="hover:text-primary" href="/admin/production">Production</Link>
            <Link className="hover:text-primary" href="/admin/artwork">Artwork</Link>
            <Link className="hover:text-primary" href="/">View shop</Link>
          </nav>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}><button className="text-sm font-semibold text-primary hover:underline" type="submit">Sign out</button></form>
        </div>
      </header>
      {children}
    </div>
  );
}
