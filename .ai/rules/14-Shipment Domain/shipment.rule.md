# Shipment Rules

## Core Principles

- **Shipment vs Order:** A single Order can result in multiple Shipments (Sub-orders or Fulfillment Orders). The Shipment Domain tracks the physical movement of a specific set of items from a facility to the customer.
- **Independence:** The Shipment entity must have its own lifecycle and status, distinct from the Order entity, although changes in the Shipment status often drive changes in the Order status.

## Data Structure

- A Shipment record must contain a snapshot of the exact `ShippingAddress` it is heading to.
- It must link to the specific `OrderLineItem` (and quantity) it is fulfilling, not just the abstract Product/Variant, to handle partial fulfillments correctly.
- Must store physical constraints: Total Weight, Volume (Dimensions), and Number of Packages/Parcels.
