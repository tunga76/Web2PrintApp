# Multi-Tenant Architecture Rules

## Core Principles

- **Tenant Isolation:** A tenant's data must be logically or physically separated from other tenants. A user from Tenant A must never be able to access or modify data belonging to Tenant B.
- **Tenant Context:** Every API request must carry a Tenant Identifier (e.g., in headers, subdomains, or claims) that the backend explicitly validates on every operation.

## Database Strategy

- **Logical Separation:** In a shared database model, every table containing tenant-specific data MUST have a `TenantId` column. 
- **Query Scoping:** Enforce tenant scope in the data-access layer for every tenant-owned query and mutation. ORM-level global filters may provide defense in depth, but must not be the only isolation control; verify tenant ownership on sensitive operations and background jobs too.

## Resource Sharing

- Define clearly which platform configuration is global (shared across all tenants) and which is tenant-specific.
- When creating caching strategies (e.g., Redis), always prefix cache keys with the `TenantId` to prevent cache bleeding between tenants.
