# Web2Print Platform Workspace

This repository is the starting workspace for multiple e-commerce storefronts that share a Node.js/TypeScript backend foundation.

## Layout

- `apps/storefront` — Next.js storefront applications will live here.
- `apps/api` — the Node.js/TypeScript API and domain modules will live here.
- `packages/shared-kernel` — backend-only primitives and ports shared across domains and sites.
- `packages/contracts` — runtime-safe request/response schemas shared with storefronts where appropriate.
- `.ai` — architecture, domain, security, and workflow rules.

The confirmed foundation is Node.js 24 LTS, TypeScript, pnpm workspaces, Next.js App Router, Fastify, PostgreSQL, and Prisma ORM. The initial commit contains structural application placeholders; application dependencies have not been installed yet. See `.ai/project-foundation.md` for the decisions and remaining provider choices.

## Shared-kernel boundary

`shared-kernel` must remain small, framework- and database-independent, and safe to reuse across storefronts. Product, order, payment, shipping, inventory, tax, and web-to-print policies belong to their owning domain modules.
