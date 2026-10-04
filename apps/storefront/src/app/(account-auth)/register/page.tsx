import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/features/auth/auth-forms';

export const metadata: Metadata = { title: 'Create an account', robots: { index: false, follow: false } };

export default function RegisterPage() {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-primary">Start printing</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">Create your account</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Save your artwork, follow orders and make repeat printing easier.</p>
      <div className="mt-6"><RegisterForm /></div>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-bold text-primary hover:underline" href="/login">Sign in</Link></p>
    </>
  );
}
