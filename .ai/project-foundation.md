# Project Foundation

This document records the product architecture and confirmed MVP scope. The repository uses a pnpm monorepo with one Next.js App Router application containing the storefront, admin UI, and Node.js Route Handler APIs. The application is a modular monolith backed by PostgreSQL and Prisma ORM.

## Product boundary

Build a Solopress-style UK web-to-print commerce MVP for B2B and B2C customers using hybrid manufacturing. Customer-facing language is English and currency is GBP. Initial products: business cards, flyers, leaflets, posters, brochures, booklets, stickers, and banners. Options include size, orientation, material, paper type/weight, printing sides, lamination, finishing, quantity, and delivery speed.

Customer scope: registration, login, password reset, catalog/search, product configuration, instant pricing, artwork upload, persistent cart, checkout, Stripe sandbox, order tracking, and reorder.

Admin scope: product/pricing/order/customer management, proof approval, production queue, manual shipping tracking, and dashboard. Production scope: artwork review, proof workflow, and production workflow.

Out of scope: online design editor, live payment processing, automated shipping integrations, marketplaces, multi-vendor, multi-warehouse, and ERP integrations.

## Initial domain boundaries

- **Storefront and Catalog:** Product discovery, product detail, availability, and product configuration.
- **Pricing and Tax:** Authoritative price calculation, discounts, tax, shipping charge, and currency formatting.
- **Cart and Checkout:** Customer selections, revalidation, delivery/billing details, and order submission.
- **Payment:** Provider interaction, payment attempts, confirmation, refunds, disputes, and reconciliation.
- **Order:** Purchase-time snapshot, customer-visible status, and order history.
- **Artwork:** Upload, validation, proof/approval, version tracking, and production-ready asset reference.
- **Inventory and Production:** Stock reservation where applicable, production work, quality checks, and completion.
- **Shipment:** Package, carrier handoff, tracking, and delivery status.
- **Customer and Support:** Identity, addresses, order support, and authorized manual actions.
- **Administration:** Product/configuration management and operational queues with role-checked, audited actions.

Keep these as logical boundaries first. Use a modular monolith unless concrete scaling, team ownership, or isolation needs justify independently deployed services. Do not introduce distributed transactions or infrastructure that the initial workload does not require.

## End-to-end invariants

1. The server calculates the amount charged; the customer confirms the final total before payment.
2. An order preserves the exact commercial terms and product/artwork references accepted at purchase.
3. Payment, order, production, and shipment states remain distinct and move through explicit allowed transitions.
4. Retries and duplicate callbacks cannot create duplicate orders, charges, stock movements, or refunds.
5. Customer data and uploaded artwork are accessible only to authorized owners and operational roles.
6. Every manual change that can affect money, stock, artwork approval, or production is attributable and recoverable.
7. Amounts are integer GBP minor units; VAT is attached to the priced configuration and captured in order snapshots.
8. Hybrid manufacturing is tracked per order line; initial production assignment and carrier tracking are manual.

## Build sequence

1. Database schema and migrations.
2. Authentication and authorization.
3. Product catalog.
4. Product configurator.
5. Pricing and VAT calculation.
6. Artwork upload and review.
7. Persistent cart.
8. Checkout.
9. Stripe sandbox payment.
10. Order management, tracking, and reorder.
11. Admin panel.
12. Proof, production, and manual shipping workflow.

## Decisions still required

| Decision | Options to evaluate | Needed before |
|---|---|---|
| File storage provider and retention | S3-compatible provider; retention duration | Staging artwork integration |
| Email delivery provider | SMTP/mail service; credentials | Staging reset and notification email |
| Commercial price matrices | Product option combinations, quantity breaks, rates | Public sales |
| Product VAT treatment | Admin-configurable per price/configuration; accountant review | Live sales |
| Shipping charges and delivery SLAs | Admin-managed manual methods/surcharges | Checkout availability |
| Production partner rules | Manual assignment to own production or partner | Production operations |
| Brand assets | Approved logo, colours, photography, copy | Final storefront polish |

## Confirmed stack

- Workspace: pnpm monorepo; the application is `apps/storefront`.
- Runtime: Node.js 24 LTS.
- Full stack: Next.js App Router and TypeScript, with Route Handlers for APIs and Server Components by default.
- UI: Tailwind CSS and shadcn/ui.
- Database: PostgreSQL and Prisma ORM 7.10 with Prisma Client and the documented PostgreSQL driver adapter.
- Authentication: Auth.js/NextAuth credentials flow with database-backed users and JWT sessions; password reset uses hashed, expiring, single-use tokens.
- Storage: S3-compatible service adapter; no paid provider is enabled without approval.
- Payments: Stripe test mode only.
- Hosting: Vercel development/staging. Production deployment requires explicit approval.
- Shared packages: `packages/shared-kernel` remains small and server-only. Domain policy stays in feature modules.

## Still undecided

- Default product option/price datasets and legally reviewed VAT assignments.
- S3-compatible provider, email provider, staging credentials, shipping surcharges, and production SLAs.
- Brand assets and final public marketing copy.

Use documented MVP assumptions to keep implementation moving. Keep unresolved commercial/provider items grouped in `.ai/assumptions.md`; never enable live payment or production deployment without explicit approval.
