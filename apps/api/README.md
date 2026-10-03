# API Application

Node.js 24 LTS API using Fastify and TypeScript. Organize it as a modular monolith with business modules under `src/modules/`; use PostgreSQL through Prisma ORM for persistence.

The API should depend on `packages/shared-kernel` through its public exports and keep HTTP, persistence, and provider implementations at the infrastructure boundary. Keep business invariants in domain/application code.
