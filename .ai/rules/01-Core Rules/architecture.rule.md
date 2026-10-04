# Architecture Rules

## Core Principles

- **Domain-Driven Design (DDD):** Organize the system around business domains (e.g., Catalog, Order, Campaign, Pricing) rather than technical concerns.
- **Clean Architecture:** Enforce strict dependency rules. Core domain logic must not depend on infrastructure, databases, or UI frameworks. Dependencies must point inwards towards the domain.
- **Vertical Slice Architecture:** For features that don't fit perfectly into a strict layered architecture, prefer vertical slices (Feature-based organization) where a single feature contains its UI, API, Domain, and Data access code close together.

## Full-Stack Architecture (Next.js / TypeScript)

- Use one Next.js App Router application as a modular monolith. Organize server and UI code by business capability (catalog, pricing, cart, checkout, payments, orders, artwork, and operations).
- Use Route Handlers for HTTP APIs and Server Actions for suitable same-origin form mutations. Keep transport validation/authorization at these boundaries.
- Keep domain decisions independent of React, HTTP, Prisma, and provider SDKs. Put persistence/provider effects behind feature-owned adapters and let application use cases orchestrate them.
- Use PostgreSQL and Prisma Client through a server-only database module. Never import database code into Client Components.
- Keep the module/folder structure small; do not create empty layers, microservices, or generic abstractions without a real consumer.

## Frontend Architecture (Next.js)

- **App Router:** Use the Next.js App Router paradigm. Strictly separate Client Components (`'use client'`) from Server Components. Maximize the use of Server Components for performance and SEO.
- **State Management:** Keep state as local as possible. Use React Context or Zustand for global UI state. Use TanStack Query (React Query) for server state and data fetching.
