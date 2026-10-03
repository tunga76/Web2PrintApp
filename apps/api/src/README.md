# API Source Layout

When implementation starts, add domain modules under `modules/` (catalog, pricing, cart, checkout, payment, orders, artwork). Put HTTP bootstrap, validated configuration, logging, and database composition under `platform/`. Keep domain decisions independent of transport and persistence.
