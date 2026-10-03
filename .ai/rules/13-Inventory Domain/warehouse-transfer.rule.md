# Warehouse Transfer Rules

## Core Principles

- **In-Transit Tracking:** When stock is moved between two internal warehouses (A to B), it must not simply disappear from A and instantly appear in B. It must enter an `InTransit` state.
- **Auditability:** Every transfer must be documented with a `TransferOrder` containing the source, destination, items, and tracking details.

## Workflow

1. **Dispatch:** Warehouse A marks the items as dispatched. `PhysicalStock` at A decreases. Items are added to `InTransitStock` linked to the destination B.
2. **Receive:** Warehouse B physically receives the items, inspects them, and logs them into the system. `InTransitStock` for B decreases, and `PhysicalStock` at B increases.
3. **Discrepancy:** If Warehouse B receives fewer items than dispatched, a discrepancy workflow must be triggered for investigation, preventing the lost stock from remaining permanently "In Transit".
