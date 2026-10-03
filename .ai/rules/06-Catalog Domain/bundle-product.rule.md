# Bundle Product Rules

## Core Principles

- **Composition:** A Bundle is a distinct product type composed of multiple existing SKUs (components) sold together, often at a discounted price (e.g., a "Photography Kit" containing a Camera, Lens, and Bag).
- **SKU Generation:** The Bundle itself MUST have its own unique SKU.

## Pricing

- **Fixed vs Dynamic:** 
  - **Fixed Bundle:** The bundle has a specific fixed price, regardless of the individual component prices.
  - **Dynamic Bundle:** The bundle price is calculated dynamically as a percentage discount off the sum of its components.

## Inventory Management

- **Virtual Inventory:** A bundle's inventory is generally virtual. Its available quantity is determined by the minimum available quantity of its constituent components. 
- **Fulfillment:** During checkout, the Order Domain must expand the bundle into its individual components for the warehouse to fulfill, while maintaining the bundle context for pricing and returns.
