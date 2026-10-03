# Inventory Rules

## Core Principles

- **Single Source of Truth:** The Inventory Domain is the absolute source of truth for stock levels. The Catalog Domain must query or receive event updates from Inventory to display "Out of Stock" labels, rather than managing stock counts itself.
- **Variant Level Tracking:** Inventory is ALWAYS tracked at the `VariantId` (SKU) level, never at the base Product level.

## Data Structure

- **Physical vs Available:** 
  - `PhysicalStock`: The actual number of items sitting on a shelf in a warehouse.
  - `ReservedStock`: Items that have been purchased/added to checkout but not yet shipped.
  - `AvailableStock`: `PhysicalStock` - `ReservedStock`. This is the number exposed to the storefront.

## Concurrency

- Inventory updates (increment, decrement, reserve) are extremely prone to race conditions. Use pessimistic locking (`SELECT ... FOR UPDATE`), atomic database operations (`UPDATE Inventory SET Stock = Stock - 1 WHERE Stock > 0`), or highly concurrent Event Sourcing techniques to prevent overselling.
