# Project Foundation

This document records the initial product architecture before implementation. The selected direction is a Next.js frontend and Node.js backend written in TypeScript. The workspace currently contains rule/workflow documents but no application scaffold. Select the Node.js API framework, database, and data-access approach through an ADR before scaffolding.

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
2. **Confirm and record the stack:** use Next.js App Router and a Node.js/TypeScript backend; select supported runtime versions, API framework, primary database, data-access approach, file/object storage, hosting, and operational tooling before creating the scaffold.
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
| Application stack | Frontend/backend framework and runtime | Scaffold and CI setup |
| Data and file storage | Database, artwork/object storage, retention | Data model and upload implementation |
| Payments and shipping | Providers and manual/automated operations | Checkout and fulfillment integration |
| Brand and language | Initial locale, currency, naming and visual direction | Storefront content and localization |

## Existing stack direction

- Frontend: Next.js App Router with TypeScript, following the architecture and folder-structure rules.
- Backend: Node.js API written in TypeScript, organized around business domains and inward dependencies.
- API framework, runtime version, database engine, data-access library, authentication approach, payment provider, object storage, hosting, and CI service remain undecided because no application scaffold or deployment configuration is present in the workspace.

Do not encode provider-specific API behavior, legal terms, prices, production tolerances, or delivery promises until the corresponding decision is confirmed against current authoritative sources.
