# Web2Print Platform Workspace

This repository is the starting workspace for multiple e-commerce storefronts that share a Node.js/TypeScript backend foundation.

## Layout

- `apps/storefront` — Next.js storefront applications will live here.
- `apps/api` — the Node.js/TypeScript API and domain modules will live here.
- `packages/shared-kernel` — backend-only primitives and ports shared across domains and sites.
- `packages/contracts` — runtime-safe request/response schemas shared with storefronts where appropriate.
- `.ai` — architecture, domain, security, and workflow rules.

The confirmed foundation is Node.js 24 LTS, TypeScript, pnpm workspaces, Next.js App Router, Fastify, PostgreSQL, and Prisma ORM. The `shared-kernel` package has its first framework-independent primitives and build configuration. See `.ai/project-foundation.md` for the decisions and remaining provider choices.

## Local development

- Use Node.js 24 and pnpm 12.8.1 (the package manager is pinned in `package.json`).
- Install workspace dependencies with `pnpm install`.
- Check the shared kernel with `pnpm --filter @web2print/shared-kernel typecheck`.
- Build it with `pnpm --filter @web2print/shared-kernel build`.

## Shared-kernel boundary

`shared-kernel` must remain small, framework- and database-independent, and safe to reuse across storefronts. Product, order, payment, shipping, inventory, tax, and web-to-print policies belong to their owning domain modules.
