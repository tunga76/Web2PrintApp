import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/features/auth/auth-forms';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Account recovery</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">Reset your password</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter your account email. If it matches an account, we’ll send a one-time link.</p>
      <div className="mt-6"><ForgotPasswordForm /></div>
      <p className="mt-6 text-center text-sm text-muted-foreground"><Link className="font-bold text-primary hover:underline" href="/login">Back to sign in</Link></p>
    </>
  );
}
