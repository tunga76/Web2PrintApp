# API Application

Node.js backend application written in TypeScript. Organize the API as a modular monolith with business modules under `src/modules/`.

Before implementation, record the API framework, Node.js runtime version, database, and data-access library in an ADR. The API should depend on `packages/shared-kernel` through its public exports and keep provider/database implementations in infrastructure adapters.
