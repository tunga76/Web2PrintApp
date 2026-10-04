# Folder Structure Rules

## Core Principles

- **Feature-Based Organization:** Group files by feature or domain, not by technical role (e.g., avoid giant `Controllers`, `Models`, `Views` folders).

## Frontend (Next.js)

```text
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components
│   ├── ui/               # Base UI elements (Buttons, Inputs, Modals)
│   └── domain/           # Domain-specific components (ProductCard, CartSummary)
├── features/             # Feature slices (e.g., auth, checkout, catalog)
│   └── [feature-name]/
│       ├── api/          # API calls and TanStack Query hooks
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific custom hooks
│       └── store/        # Feature-specific state
├── lib/                  # Shared utilities and configurations
└── types/                # Global TypeScript definitions
```

## Full Stack (Next.js Route Handlers)

```text
apps/
└── storefront/                  # Next.js customer storefront, admin UI, and APIs
    └── src/
        ├── app/                  # Pages, layouts, and thin Route Handlers
        ├── features/
        │   ├── auth/
        │   ├── catalog/
        │   ├── pricing/
        │   ├── cart/
        │   ├── checkout/
        │   ├── payments/
        │   ├── orders/
        │   ├── artwork/
        │   ├── production/
        │   └── admin/
        ├── components/           # Shared UI primitives and composed components
        └── lib/                  # Database, auth, configuration, and shared server utilities

packages/
└── contracts/                   # Shared API schemas/types only when safely shareable
```

Each feature may contain `domain/`, `application/`, `infrastructure/`, and `ui/` areas when its complexity warrants them. Route Handlers should stay thin and delegate to the feature. Keep the initial structure small; do not create empty layers or packages preemptively.
