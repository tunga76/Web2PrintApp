# Project Foundation

This document records the product architecture and confirmed foundation decisions. The repository uses a pnpm monorepo with a Next.js storefront and a Node.js/TypeScript API. The API starts as a Fastify modular monolith backed by PostgreSQL and Prisma ORM. Keep provider and infrastructure choices behind clear application boundaries.

## Product boundary

Build a customer-facing web-to-print commerce system. The first release should support a small, operationally validated catalog and the complete path from product selection through payment, artwork handling, production, and shipment. Expand catalog breadth only after that path is reliable.

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

## Build sequence

1. **Confirm decisions:** target market and jurisdiction, B2C/B2B scope, production model, initial products, payment method, shipping approach, language/currency, and deployment constraints.
2. **Confirm and record the stack:** use Next.js App Router, Node.js 24 LTS, TypeScript, pnpm workspaces, Fastify, PostgreSQL, and Prisma ORM. Decide file/object storage, hosting, authentication, payment/shipping providers, and operational tooling before implementing their integrations.
3. **Create the application skeleton:** local development instructions, configuration/secrets handling, health checks, logging/error handling, database migrations, and CI quality checks.
4. **Implement the commerce core:** catalog/configuration and pricing, then cart/checkout, payment integration, immutable order snapshot, and customer notifications.
5. **Implement web-to-print operations:** upload isolation, artwork validation/proof, production queue, shipment tracking, and operator administration.
6. **Pilot a small catalog:** run representative real orders through payment, artwork, production, packaging, shipment, cancellation, and refund scenarios before broad launch.

## Decisions still required

| Decision | Options to evaluate | Needed before |
|---|---|---|
| Market and legal jurisdiction | Initial country/region and customer type | Tax, checkout terms, privacy, invoicing |
| Production model | Own facility, print partners, or hybrid | Product catalog, SLA, operations |
| Initial catalog | Products and supported configuration options | Pricing and artwork profiles |
| File storage | Object storage provider and retention | Artwork upload implementation |
| Authentication | Identity/session approach and account lifecycle | Customer and admin authentication |
| Payments and shipping | Providers and manual/automated operations | Checkout and fulfillment integration |
| Brand and language | Initial locale, currency, naming and visual direction | Storefront content and localization |

## Confirmed stack

- Workspace: pnpm monorepo with `apps/*` and `packages/*` workspaces.
- Runtime: Node.js 24 LTS for the storefront, API, and shared packages. Next.js currently requires Node.js 20.9 or newer.
- Frontend: Next.js App Router and TypeScript. Prefer Server Components; add Client Components only for interactive UI.
- Backend: Fastify and TypeScript, organized as a modular monolith by business domain. Keep HTTP, persistence, and provider integrations outside domain decisions.
- Database: PostgreSQL with Prisma ORM. Keep pricing, order, payment, and production invariants in application/domain logic rather than generated persistence models.
- Shared packages: `packages/shared-kernel` contains small backend-neutral primitives only; `packages/contracts` contains client-safe API contracts. Domain policies remain in their owning application modules.

## Still undecided

- Object storage provider and artwork retention policy.
- Authentication and session strategy.
- Payment and shipping providers.
- Hosting, CI, observability, and deployment topology.

Do not encode provider-specific API behavior, legal terms, prices, production tolerances, or delivery promises until the corresponding decision is confirmed against current authoritative sources.
