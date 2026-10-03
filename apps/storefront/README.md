# Storefront Applications

Next.js App Router storefronts will live under this workspace. A site-specific application may compose shared storefront components and API contracts while keeping brand, locale, domain, and catalog configuration explicit.

The selected package manager is pnpm, with versions declared by each application as it is scaffolded. Storefront code must not import backend-only modules from `packages/shared-kernel`; use `packages/contracts` for client-safe API contracts.
