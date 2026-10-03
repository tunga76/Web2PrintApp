# Cart Discount Rules

## Core Principles

- **Dynamic Evaluation:** Discounts (from Campaigns, Coupons, or Volume Pricing) are dynamically evaluated based on the current state of the cart. They are NOT permanently attached to the Line Item until the order is placed.
- **Visibility:** The cart API must return the `BasePrice` and the `DiscountedPrice` (or the discount amount) separately so the UI can clearly display the savings to the customer.

## Application Order

- Discounts must be applied in a strict, deterministic order defined by the Campaign Priority (e.g., Line-item discounts first -> Cart-level discounts -> Shipping discounts).
- Prorating: Cart-level discounts (e.g., "$20 off your $100 order") must be mathematically prorated across all eligible Line Items. This is critical for accurate partial refunds later.
