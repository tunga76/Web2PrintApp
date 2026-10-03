# Database Migration Rules

## Core Principles

- **Migration-Driven:** Manage schema changes through versioned migrations supported by the selected Node.js data-access tooling. Never make unrecorded manual schema changes in production.
- **Immutability of History:** Once a migration has been applied to a shared environment (Staging, Production), it MUST NOT be altered or deleted. If a fix is needed, create a new forward-rolling migration.

## Migration Practices

- **Zero-Downtime:** Design migrations to be backward and forward compatible to allow for zero-downtime deployments. 
  - E.g., Do not rename a column directly. Instead: Add new column -> Sync data -> Switch app to use new column -> Drop old column in a later release.
- **Review:** Migrations must be carefully code-reviewed. Pay special attention to operations that lock tables (like adding a non-nullable column without a default value to a large table).

## Execution

- **CI/CD Integration:** Migrations should be executed automatically via CI/CD pipelines during deployment, preferably using a dedicated idempotent script or tool, not implicitly on application startup.
