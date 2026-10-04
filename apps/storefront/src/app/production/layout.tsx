import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';

export default async function ProductionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user?.role || !['ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/login?callbackUrl=%2Fproduction');
  return <div className="min-h-screen bg-[#f5f7f4]"><header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-4 sm:px-8 md:flex-row md:items-center"><Link className="font-black tracking-tight" href="/production">Web2Print Production</Link><nav className="flex gap-4 text-sm font-semibold"><Link className="text-muted-foreground hover:text-primary" href="/production">Queue</Link><Link className="text-muted-foreground hover:text-primary" href="/production/artwork">Artwork review</Link></nav><form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}><button className="text-sm font-semibold text-primary hover:underline" type="submit">Sign out</button></form></div></header>{children}</div>;
}
