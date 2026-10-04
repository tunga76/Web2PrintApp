import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/auth-forms';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Welcome back</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">Sign in to your account</h2>
      {params.registered === '1' && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Your account is ready. Sign in to continue.</p>}
      {params.passwordReset === '1' && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Your password has been updated. Sign in with your new password.</p>}
      <div className="mt-7"><LoginForm callbackUrl={typeof params.callbackUrl === 'string' ? params.callbackUrl : '/account'} /></div>
      <p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link className="font-bold text-primary hover:underline" href="/register">Create an account</Link></p>
    </>
  );
}
