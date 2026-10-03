# Supplier Stock & Dropshipping Rules

## Core Principles

- **Virtual Stock:** Stock held by a supplier/vendor that is available to be sold on the platform (Dropshipping) must be tracked as a distinct logical Warehouse.
- **Reliability Factors:** Supplier stock feeds are notoriously unreliable. Apply a safety buffer (e.g., if Supplier reports 5, display 3) or consider historical supplier fulfillment rates before exposing their stock to customers.

## Integration

- **Async Updates:** Supplier stock feeds must be ingested asynchronously (e.g., via CSV drops, API integrations) and processed in the background to prevent blocking core application operations.
- **Backordering:** Define strict rules for backordering (allowing a customer to buy an item that is currently out of physical stock but confirmed to be en-route from a supplier). Ensure the customer is clearly notified of the extended lead time.
