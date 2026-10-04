import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { verify } from '@node-rs/argon2';
import { verify as verifyTotp } from 'otplib';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { decryptMfaSecret } from '@/features/auth/mfa-crypto';

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(256),
  otp: z.string().regex(/^\d{6}$/).optional(),
});
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'Authenticator code', type: 'text' },
      },
      async authorize(rawCredentials) {
        const otp = typeof rawCredentials.otp === 'string' ? rawCredentials.otp.trim() : '';
        const parsed = credentialsSchema.safeParse({
          ...rawCredentials,
          ...(otp ? { otp } : { otp: undefined }),
        });
        if (!parsed.success) return null;

        const db = getDb();
        const user = await db.user.findFirst({
          where: { email: parsed.data.email, deletedAt: null },
          include: { mfaCredential: true },
        });
        if (!user?.passwordHash) return null;

        const now = new Date();
        if (user.lockedUntil && user.lockedUntil > now) return null;

        const valid = await verify(user.passwordHash, parsed.data.password).catch(() => false);
        if (!valid) {
          await db.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: { increment: 1 } },
          });
          await db.user.updateMany({
            where: { id: user.id, failedLoginAttempts: { gte: 5 } },
            data: { lockedUntil: new Date(now.getTime() + 15 * 60 * 1000) },
          });
          return null;
        }

        if (user.role === 'ADMIN') {
          let validOtp = false;
          if (parsed.data.otp && user.mfaCredential?.enabledAt) {
            try {
              const result = await verifyTotp({
                secret: decryptMfaSecret(user.mfaCredential.encryptedSecret),
                token: parsed.data.otp,
                epochTolerance: 30,
              });
              validOtp = result.valid;
            } catch {
              validOtp = false;
            }
          }
          if (!validOtp) {
            await db.user.update({ where: { id: user.id }, data: { failedLoginAttempts: { increment: 1 } } });
            await db.user.updateMany({
              where: { id: user.id, failedLoginAttempts: { gte: 5 } },
              data: { lockedUntil: new Date(now.getTime() + 15 * 60 * 1000) },
            });
            return null;
          }
        }

        await db.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: now },
        });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.sessionVersion = user.sessionVersion;
        return token;
      }

      if (token.userId) {
        const current = await getDb().user.findFirst({
          where: { id: token.userId, deletedAt: null },
          select: { role: true, sessionVersion: true },
        });
        if (!current || current.sessionVersion !== token.sessionVersion) {
          return { ...token, invalidated: true };
        }
        token.role = current.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (
        session.user &&
        typeof token.userId === 'string' &&
        !token.invalidated &&
        (token.role === 'CUSTOMER' || token.role === 'ADMIN' || token.role === 'PRODUCTION')
      ) {
        session.user.id = token.userId;
        session.user.role = token.role;
      }
      return session;
    },
    async authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith('/admin')) return session?.user?.role === 'ADMIN';
      if (path.startsWith('/production')) {
        return session?.user?.role === 'PRODUCTION' || session?.user?.role === 'ADMIN';
      }
      if (/^\/(account|cart|checkout)(\/|$)/.test(path)) return Boolean(session?.user?.id);
      return true;
    },
  },
});
