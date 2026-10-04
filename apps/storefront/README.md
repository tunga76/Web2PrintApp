# Web2Print Storefront

UK-focused hybrid B2B/B2C print store MVP built with Next.js App Router, Node.js Route Handlers, Prisma, PostgreSQL, Auth.js, and Stripe test Checkout.

## Local setup

1. Install Node.js 24 and pnpm 12.8.1, then run `pnpm install` from the repository root.
2. Copy this app's `.env.example` to `.env` and generate local secrets from PowerShell:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
   ```

   Use a fresh value for `AUTH_SECRET`; generate a separate value and base64-encode 32 random bytes for `MFA_ENCRYPTION_KEY` (same command). Set the resulting values only in `.env`.

3. Start local services from the repository root with `docker compose up -d postgres minio clamav mailpit`. PostgreSQL is on port 54329, the SeaweedFS S3-compatible endpoint is on port 9000, ClamAV is on 3310, and Mailpit SMTP/UI is on 1025/8025. The S3 bucket is created on first upload.
4. Run from this directory: `pnpm db:migrate`, `pnpm db:seed`, then `pnpm dev`.
5. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to Stripe test-mode values before checkout. For local webhooks, forward Stripe test events to `http://localhost:3000/api/webhooks/stripe`.
6. Open `http://localhost:8025` to inspect password-reset emails captured by Mailpit.
7. Create the first admin from this directory using `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` environment variables, then `pnpm admin:create`. The command prints a one-time TOTP enrollment URI; scan it with an authenticator app and store the MFA encryption key safely.

## Checks

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` from this directory. Tests cover pricing and UK checkout address validation.

The development seed catalog is explicitly illustrative and blocked from checkout. Replace it with commercially approved product pricing and VAT rules before staging transactions. Do not use live Stripe credentials. Production deployment requires explicit approval.

Storefront code must not import backend-only modules from `packages/shared-kernel`; use `packages/contracts` for client-safe API contracts.
