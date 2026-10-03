# Order Split Rules

## Core Principles

- **Logistics Driven:** A single customer Order might need to be fulfilled as multiple Shipments (Sub-orders or Packages) due to inventory located in different warehouses, dropshipping from vendors, or backordered items.
- **Parent-Child Hierarchy:** The system should maintain the original "Parent Order" (what the customer sees and paid for) and create "Fulfillment Orders" or "Shipments" (what the warehouse processes) underneath it.

## Financial Integrity

- When an order is split, the total sum of prices, taxes, and shipping costs across all Fulfillment Orders MUST exactly equal the Parent Order's totals.
- Discounts applied to the Parent Order must be proportionally distributed across the Fulfillment Orders to ensure accurate refunds if only one shipment is returned.
