# Partial Refund Rules

## Core Principles

- **Prorating (Crucial):** When an order has cart-level discounts (e.g., "$20 off $100"), a partial refund of a single line item MUST prorate the discount. 
  - *Example:* If returning a $50 item from that $100 cart, the customer is refunded $40 (since the item carried 50% of the $20 discount), not $50.
- **Tax Recalculation:** Taxes must be recalculated down to the cent based on the prorated refund amount, complying with strict accounting rounding rules.

## Scenarios

- **Item Return:** Standard partial refund for specific returned variants.
- **Goodwill / Adjustment:** Customer service can issue a partial refund without an item being returned (e.g., "Item arrived slightly scratched, refunding 10%"). This must be clearly categorized differently than a standard Return for inventory and accounting purposes.
