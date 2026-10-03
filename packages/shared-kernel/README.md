# Shared Kernel

This package is reserved for small, stable concepts that are genuinely shared by multiple backend domains or storefront deployments.

## Planned first modules

- Branded identifiers for site, tenant, customer, and business records.
- Exact `Money` and currency representation.
- Typed domain errors and result values.
- Clock/time abstractions.
- Actor, site, optional tenant, and correlation context.
- Transaction, idempotency, and domain-event ports.

Keep framework, database, queue, payment-provider, and web-to-print policies out of this package. Export public APIs from a single package entry point; do not make consumers import internal file paths.

The package is an empty scaffold at this stage. Add implementations only after the first consuming domain confirms the required contract.
