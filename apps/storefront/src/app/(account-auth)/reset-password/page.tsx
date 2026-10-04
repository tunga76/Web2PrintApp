import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from '@/features/auth/auth-forms';

export const metadata: Metadata = { title: 'Choose a new password', robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Account recovery</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">Choose a new password</h2>
      {token ? <div className="mt-6"><ResetPasswordForm token={token} /></div> : <p className="mt-4 text-sm text-muted-foreground">This reset link is missing. Request a new one to continue.</p>}
      <p className="mt-6 text-center text-sm text-muted-foreground"><Link className="font-bold text-primary hover:underline" href="/forgot-password">Request a new reset link</Link></p>
    </>
  );
}
