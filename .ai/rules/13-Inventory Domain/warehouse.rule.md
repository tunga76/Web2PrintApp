# Warehouse Rules

## Core Principles

- **Multi-Warehouse Support:** The system must be designed from day one to support multiple physical or logical warehouses (e.g., "Main Distribution Center", "Retail Store A", "Dropship Vendor B").
- **Inventory Partitioning:** An inventory record is uniquely identified by the combination of `WarehouseId` and `VariantId`.

## Sourcing and Fulfillment

- **Routing Rules:** When an order is placed, the system must determine which warehouse(s) will fulfill it. This algorithm should consider stock availability, shipping distance to the customer, and shipping costs.
- **Split Shipments:** If a single warehouse cannot fulfill an entire order, the system must generate a split shipment (see Order Domain rules) across multiple warehouses.
