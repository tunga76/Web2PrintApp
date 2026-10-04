'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  loginAccount,
  registerAccount,
  requestPasswordReset,
  resetPassword,
} from '@/features/auth/actions';

type FormState = { error?: string; success?: boolean };

function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return <p aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>;
  }
  if (state.success) {
    return <p aria-live="polite" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">If an account exists for that email, we’ve sent a reset link.</p>;
  }
  return null;
}

export function LoginForm({ callbackUrl = '/account' }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    async (_previous, formData) => loginAccount(formData),
    {},
  );
  return (
    <form action={action} className="space-y-5">
      <input name="callbackUrl" type="hidden" value={callbackUrl} />
      <div className="space-y-2"><Label htmlFor="email">Email address</Label><Input autoComplete="email" id="email" name="email" required type="email" /></div>
      <div className="space-y-2"><div className="flex justify-between"><Label htmlFor="password">Password</Label><Link className="text-sm font-semibold text-primary hover:underline" href="/forgot-password">Forgot password?</Link></div><Input autoComplete="current-password" id="password" name="password" required type="password" /></div>
      <div className="space-y-2"><Label htmlFor="otp">Authenticator code <span className="text-muted-foreground">(admin accounts only)</span></Label><Input autoComplete="one-time-code" id="otp" inputMode="numeric" maxLength={6} name="otp" pattern="[0-9]{6}" /></div>
      <FormMessage state={state} />
      <Button className="h-11 w-full" disabled={pending} type="submit">{pending ? 'Signing in…' : 'Sign in'}</Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    async (_previous, formData) => registerAccount(formData),
    {},
  );
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="name">Your name</Label><Input autoComplete="name" id="name" maxLength={160} name="name" required /></div>
      <div className="space-y-2"><Label htmlFor="email">Email address</Label><Input autoComplete="email" id="email" maxLength={254} name="email" required type="email" /></div>
      <div className="space-y-2"><Label htmlFor="accountType">Account type</Label><select className="flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" defaultValue="PERSONAL" id="accountType" name="accountType"><option value="PERSONAL">Personal</option><option value="BUSINESS">Business</option></select></div>
      <div className="space-y-2"><Label htmlFor="businessName">Business name <span className="text-muted-foreground">(if business account)</span></Label><Input autoComplete="organization" id="businessName" maxLength={160} name="businessName" /></div>
      <div className="space-y-2"><Label htmlFor="password">Password</Label><Input autoComplete="new-password" id="password" maxLength={128} minLength={12} name="password" required type="password" /><p className="text-xs text-muted-foreground">At least 12 characters, including uppercase, lowercase and a number.</p></div>
      <FormMessage state={state} />
      <Button className="h-11 w-full" disabled={pending} type="submit">{pending ? 'Creating account…' : 'Create account'}</Button>
      <p className="text-xs leading-5 text-muted-foreground">By creating an account, you agree to our Terms of Sale and Privacy Policy. These legal pages must be reviewed before launch.</p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    async (_previous, formData) => requestPasswordReset(formData),
    {},
  );
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="email">Email address</Label><Input autoComplete="email" id="email" name="email" required type="email" /></div>
      <FormMessage state={state} />
      <Button className="h-11 w-full" disabled={pending} type="submit">{pending ? 'Sending…' : 'Send reset link'}</Button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    async (_previous, formData) => resetPassword(formData),
    {},
  );
  return (
    <form action={action} className="space-y-5">
      <input name="token" type="hidden" value={token} />
      <div className="space-y-2"><Label htmlFor="password">New password</Label><Input autoComplete="new-password" id="password" maxLength={128} minLength={12} name="password" required type="password" /><p className="text-xs text-muted-foreground">At least 12 characters, including uppercase, lowercase and a number.</p></div>
      <FormMessage state={state} />
      <Button className="h-11 w-full" disabled={pending} type="submit">{pending ? 'Updating…' : 'Set new password'}</Button>
    </form>
  );
}
