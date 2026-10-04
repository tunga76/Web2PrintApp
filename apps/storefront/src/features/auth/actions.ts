'use server';

import { hash } from '@node-rs/argon2';
import type { Algorithm } from '@node-rs/argon2';
import { createHash, randomBytes } from 'node:crypto';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { z } from 'zod';
import { getDb } from '@/lib/db';

const credentialsSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(12).max(128),
  accountType: z.enum(['PERSONAL', 'BUSINESS']),
  businessName: z.string().trim().max(160).optional(),
});

const passwordSchema = z
  .string()
  .min(12, 'Use at least 12 characters.')
  .max(128)
  .regex(/[a-z]/, 'Include a lowercase letter.')
  .regex(/[A-Z]/, 'Include an uppercase letter.')
  .regex(/[0-9]/, 'Include a number.');

export async function loginAccount(formData: FormData) {
  const credentials = z
    .object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256) })
    .safeParse({ email: formData.get('email'), password: formData.get('password') });
  if (!credentials.success) return { error: 'Enter a valid email and password.' };

  const requestedPath = z.string().max(500).safeParse(formData.get('callbackUrl'));
  const redirectTo = requestedPath.success && /^\/(?!\/)/.test(requestedPath.data) && !requestedPath.data.includes('\\')
    ? requestedPath.data
    : '/account';

  try {
    await signIn('credentials', {
      email: credentials.data.email,
      password: credentials.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Email or password is incorrect, or the account is temporarily locked.' };
    throw error;
  }
  return { error: 'Email or password is incorrect, or the account is temporarily locked.' };
}

export async function registerAccount(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    accountType: formData.get('accountType'),
    businessName: formData.get('businessName') || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your details.' };
  if (!passwordSchema.safeParse(parsed.data.password).success) {
    return { error: 'Use at least 12 characters with uppercase, lowercase and a number.' };
  }
  if (parsed.data.accountType === 'BUSINESS' && !parsed.data.businessName?.trim()) {
    return { error: 'Enter your business name.' };
  }

  const passwordHash = await hash(parsed.data.password, {
    algorithm: 2 as Algorithm,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
  });
  const displayName =
    parsed.data.accountType === 'BUSINESS' ? parsed.data.businessName!.trim() : parsed.data.name;

  try {
    await getDb().user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        memberships: {
          create: {
            role: 'OWNER',
            account: {
              create: { type: parsed.data.accountType, displayName },
            },
          },
        },
      },
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return { error: 'An account with this email already exists. Try signing in instead.' };
    }
    throw error;
  }

  redirect('/login?registered=1');
}

function tokenDigest(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function requestPasswordReset(formData: FormData) {
  const email = z.string().trim().email().max(254).safeParse(formData.get('email'));
  if (!email.success) return { error: 'Enter a valid email address.' };

  const db = getDb();
  const normalizedEmail = email.data.toLowerCase();
  const user = await db.user.findFirst({
    where: { email: normalizedEmail, deletedAt: null },
    select: { id: true, email: true },
  });
  if (!user?.email) return { success: true };

  const now = new Date();
  const recentRequests = await db.passwordResetToken.count({
    where: { userId: user.id, createdAt: { gte: new Date(now.getTime() - 10 * 60 * 1000) } },
  });
  if (recentRequests >= 3) return { success: true };

  const token = randomBytes(32).toString('base64url');
  const resetToken = await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: tokenDigest(token),
      expiresAt: new Date(now.getTime() + 30 * 60 * 1000),
    },
  });

  try {
    const [{ default: nodemailer }, { getMailEnv, getAppUrl }] = await Promise.all([
      import('nodemailer'),
      import('@/lib/env'),
    ]);
    const mail = getMailEnv();
    const transport = nodemailer.createTransport(mail.SMTP_URL);
    const resetUrl = new URL('/reset-password', getAppUrl());
    resetUrl.searchParams.set('token', token);
    await transport.sendMail({
      from: mail.EMAIL_FROM,
      to: user.email,
      subject: 'Reset your Web2Print password',
      text: `Use this one-time link within 30 minutes to reset your password: ${resetUrl.toString()}`,
    });
  } catch (error) {
    await db.passwordResetToken.delete({ where: { id: resetToken.id } });
    console.error('Password reset email delivery failed.', error);
    return { success: true };
  }
  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = z.string().min(32).max(128).safeParse(formData.get('token'));
  const password = passwordSchema.safeParse(formData.get('password'));
  if (!token.success) return { error: 'This password reset link is invalid or expired.' };
  if (!password.success) return { error: password.error.issues[0]?.message ?? 'Check your password.' };

  const db = getDb();
  const tokenRecord = await db.passwordResetToken.findUnique({
    where: { tokenHash: tokenDigest(token.data) },
    select: { id: true, userId: true, expiresAt: true, usedAt: true },
  });
  if (!tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt <= new Date()) {
    return { error: 'This password reset link is invalid or expired.' };
  }

  const passwordHash = await hash(password.data, {
    algorithm: 2 as Algorithm,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
  });
  const now = new Date();
  const completed = await db.$transaction(async (transaction) => {
    const claimed = await transaction.passwordResetToken.updateMany({
      where: {
        id: tokenRecord.id,
        userId: tokenRecord.userId,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });
    if (claimed.count !== 1) return false;
    await transaction.user.update({
      where: { id: tokenRecord.userId },
      data: {
        passwordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
        sessionVersion: { increment: 1 },
      },
    });
    await transaction.passwordResetToken.updateMany({
      where: { userId: tokenRecord.userId, id: { not: tokenRecord.id }, usedAt: null },
      data: { usedAt: now },
    });
    return true;
  });
  if (!completed) return { error: 'This password reset link is invalid or expired.' };
  redirect('/login?passwordReset=1');
}
