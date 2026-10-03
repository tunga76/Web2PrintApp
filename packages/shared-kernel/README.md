# Shared Kernel

This package contains small, stable concepts shared by backend domains and ecommerce deployments. It has no framework, database, queue, payment-provider, or UI dependencies.

## Planned first modules

- Branded identifiers for site, tenant, customer, actor, event, correlation, and business records.
- Exact `Money` arithmetic in integer minor units with explicit currency.
- Typed domain errors and discriminated result values.
- Clock abstraction for deterministic time-dependent behavior.
- Actor, site, optional tenant, and correlation execution context.
- Generic transaction runner and in-process domain event contract.
- Idempotency port is deferred until an order/payment use case defines claim, replay, conflict, and expiry semantics.

Keep framework, database, queue, payment-provider, and web-to-print policies out of this package. Export public APIs from a single package entry point; do not make consumers import internal file paths.

The package exports its public API from one entry point. Keep business-specific validation and policies in their owning domains. Do not hold a transaction open during an external network call, and do not publish integration events directly as part of a database transaction; use the owning application's outbox adapter when reliable cross-process delivery is required.
