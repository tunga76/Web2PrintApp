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

## Backend (Node.js / TypeScript)

```text
apps/
├── storefront/                  # Next.js customer storefront and admin UI
└── api/
    └── src/
        ├── modules/
        │   ├── catalog/
        │   ├── pricing/
        │   ├── cart/
        │   ├── checkout/
        │   ├── payment/
        │   ├── orders/
        │   └── artwork/
        ├── platform/             # Configuration, database, logging, HTTP setup
        └── main.ts               # Application entry point

packages/
└── contracts/                   # Shared API schemas/types only when safely shareable
```

Each backend module may contain `domain/`, `application/`, `infrastructure/`, and `http/` areas when its complexity warrants them. Keep the initial structure small; do not create empty layers or packages preemptively.
