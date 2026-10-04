import { z } from 'zod';

function parse<T extends z.ZodType>(schema: T) {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid server environment:\n${details}`);
  }
  return parsed.data as z.infer<T>;
}

export const getDatabaseEnv = () =>
  parse(z.object({
    DATABASE_URL: z
      .string()
      .min(1)
      .default('postgresql://web2print:local-development-only@localhost:54329/web2print?schema=public'),
  }));

export const getAuthEnv = () =>
  parse(
    z.object({
      AUTH_SECRET: z.string().min(32),
      NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    }),
  );

export const getMailEnv = () =>
  parse(
    z.object({
      SMTP_URL: z.string().url(),
      EMAIL_FROM: z.string().email().or(z.string().regex(/^.+ <[^<>]+>$/)),
    }),
  );

export const getS3Env = () =>
  parse(
    z.object({
      S3_ENDPOINT: z.string().url().optional(),
      S3_REGION: z.string().default('us-east-1'),
      S3_BUCKET: z.string().min(3),
      S3_ACCESS_KEY_ID: z.string().min(1),
      S3_SECRET_ACCESS_KEY: z.string().min(1),
    }),
  );

export const getStripeEnv = () =>
  parse(
    z.object({
      STRIPE_SECRET_KEY: z.string().startsWith('sk_test_'),
      STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
    }),
  );

export const getAppUrl = () =>
  parse(z.object({ APP_URL: z.string().url().default('http://localhost:3000') })).APP_URL;

export function getMfaEncryptionKey() {
  const { MFA_ENCRYPTION_KEY } = parse(z.object({ MFA_ENCRYPTION_KEY: z.string().min(1) }));
  const key = Buffer.from(MFA_ENCRYPTION_KEY, 'base64');
  if (key.length !== 32) throw new Error('MFA_ENCRYPTION_KEY must decode from base64 to exactly 32 bytes.');
  return key;
}

export function getClamAvEnv() {
  return parse(z.object({
    CLAMAV_HOST: z.string().min(1),
    CLAMAV_PORT: z.coerce.number().int().min(1).max(65_535).default(3310),
  }));
}
