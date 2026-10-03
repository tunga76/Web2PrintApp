# Shared Kernel

This package contains small, stable concepts shared by backend domains and ecommerce deployments. It has no framework, database, queue, payment-provider, or UI dependencies.

## Planned first modules

- Branded identifiers for site, tenant, customer, correlation, and business records.
- Exact `Money` arithmetic in integer minor units with explicit currency.
- Typed domain errors and discriminated result values.
- Clock abstraction for deterministic time-dependent behavior.
- Actor, site, optional tenant, and correlation context (add when the first consumer defines the contract).
- Transaction, idempotency, and domain-event ports (add with their first consumers).

Keep framework, database, queue, payment-provider, and web-to-print policies out of this package. Export public APIs from a single package entry point; do not make consumers import internal file paths.

The first implementation exports identifiers, `Money`, `DomainError`, `Result`, and `Clock` from one public entry point. Keep business-specific validation and policies in their owning domains.
