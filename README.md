# Web2Print Platform Workspace

This repository contains a UK web-to-print e-commerce MVP for B2B and B2C customers.

## Layout

- `apps/storefront` — Next.js App Router storefront, admin and Route Handler API, organized by feature.
- `packages/shared-kernel` — server-only primitives and ports shared across commerce domains.
- `packages/contracts` — runtime-safe request/response schemas shared with storefronts where appropriate.
- `.ai` — architecture, domain, security, and workflow rules.

The stack is Node.js 24 LTS, TypeScript, pnpm workspaces, Next.js App Router, Tailwind CSS, shadcn/ui, PostgreSQL, Prisma ORM 7.10, and Auth.js. Stripe is restricted to test mode. See `.ai/project-foundation.md` and `.ai/assumptions.md` for scope and unresolved setup decisions.

## Local development

- Use Node.js 24 and pnpm 12.8.1 (the package manager is pinned in `package.json`).
- Install workspace dependencies with `pnpm install`.
- See [`apps/storefront/README.md`](apps/storefront/README.md) for local PostgreSQL/S3/ClamAV/Mailpit setup, Stripe test credentials, admin bootstrap and validation commands.
- Check the shared kernel with `pnpm --filter @web2print/shared-kernel typecheck`.
- Build it with `pnpm --filter @web2print/shared-kernel build`.

## Shared-kernel boundary

`shared-kernel` must remain small, framework- and database-independent, and safe to reuse across storefronts. Product, order, payment, shipping, inventory, tax, and web-to-print policies belong to their owning domain modules.
