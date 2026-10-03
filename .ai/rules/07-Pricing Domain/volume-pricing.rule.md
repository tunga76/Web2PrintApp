# Volume Pricing Rules

## Core Principles

- Volume (or Bulk) pricing provides reduced unit costs based on the quantity of a specific SKU added to the cart.
- Crucial for B2B and wholesale commerce.

## Structure

- Defined in breaks/steps: 
  - Qty 1 - 9: $10.00 each
  - Qty 10 - 49: $9.00 each
  - Qty 50+: $8.00 each
- Can be defined as fixed price per unit or percentage discount per unit.

## Calculation

- Evaluation must happen on cart update. If the user decreases quantity, the unit price must revert to the appropriate tier.
- Ensure volume pricing considers identical SKUs that might be split across multiple cart lines (e.g., different configurations but same base SKU), if business requirements mandate combined volume counting.

## Display

- Product detail pages (PDP) must clearly display the volume pricing table so users are aware of the bulk discounts available.
- Highlight savings in the cart (e.g., "You saved $10 by buying 10+ items").
