import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from '@node-rs/argon2';
import { generateSecret, generateURI } from 'otplib';
import { z } from 'zod';
import { PrismaClient } from '../src/generated/prisma/client';
import { encryptMfaSecret } from '../src/features/auth/mfa-crypto';
import { getDatabaseEnv } from '../src/lib/env';

const inputSchema = z.object({
  ADMIN_NAME: z.string().trim().min(2).max(160),
  ADMIN_EMAIL: z.string().trim().email().max(254),
  ADMIN_PASSWORD: z.string().min(12).max(128),
});
const input = inputSchema.parse(process.env);
const email = input.ADMIN_EMAIL.toLowerCase();
const { DATABASE_URL } = getDatabaseEnv();
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

async function createAdmin() {
  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) throw new Error('That email already has an account. Admin roles cannot be granted through the public registration form.');
  const secret = generateSecret();
  const passwordHash = await hash(input.ADMIN_PASSWORD);
  const user = await db.user.create({
    data: {
      name: input.ADMIN_NAME,
      email,
      emailVerified: new Date(),
      passwordHash,
      role: 'ADMIN',
      mfaCredential: {
        create: {
          encryptedSecret: encryptMfaSecret(secret),
          encryptionKeyVersion: 'aes-256-gcm-v1',
          enabledAt: new Date(),
        },
      },
    },
    select: { id: true, email: true },
  });
  const uri = generateURI({ issuer: 'Web2Print', label: email, secret });
  console.info(`Created administrator ${user.email} (${user.id}).`);
  console.info('Add this one-time authenticator setup URI to an authenticator app. It will not be displayed again:');
  console.info(uri);
}

createAdmin()
  .finally(async () => db.$disconnect())
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
