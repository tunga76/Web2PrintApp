# Architecture Rules

## Core Principles

- **Domain-Driven Design (DDD):** Organize the system around business domains (e.g., Catalog, Order, Campaign, Pricing) rather than technical concerns.
- **Clean Architecture:** Enforce strict dependency rules. Core domain logic must not depend on infrastructure, databases, or UI frameworks. Dependencies must point inwards towards the domain.
- **Vertical Slice Architecture:** For features that don't fit perfectly into a strict layered architecture, prefer vertical slices (Feature-based organization) where a single feature contains its UI, API, Domain, and Data access code close together.

## Backend Architecture (Node.js / TypeScript)

- Use the Node.js API framework selected for the project and organize request handling by business capability (for example, catalog, pricing, checkout, payment, and orders).
- Keep domain decisions independent of HTTP, database, and provider SDKs. Put external side effects behind explicit interfaces/adapters and keep application use cases responsible for orchestration.
- Select the database access library through an ADR. Keep persistence-specific models and query concerns at the infrastructure boundary; do not add repository abstractions where they only mirror the chosen library without protecting a meaningful boundary.
- Start as a modular monolith. Introduce separately deployed services only when independent scaling, ownership, or isolation requirements justify the operational cost.

## Frontend Architecture (Next.js)

- **App Router:** Use the Next.js App Router paradigm. Strictly separate Client Components (`'use client'`) from Server Components. Maximize the use of Server Components for performance and SEO.
- **State Management:** Keep state as local as possible. Use React Context or Zustand for global UI state. Use TanStack Query (React Query) for server state and data fetching.
