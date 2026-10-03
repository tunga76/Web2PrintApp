# Exchange Rules

## Core Principles

- **Concept:** An Exchange is fundamentally a Return followed by a new Order. From an architectural perspective, do not try to mutate the historical order.
- **Workflow:** 
  1. Customer initiates an Exchange for a new Variant (e.g., different size).
  2. Create an RMA for the returned item.
  3. Create a `Zero-Dollar` or `Difference-Only` new Order for the requested item.

## Price Differences

- **Same Price (Even Exchange):** If the new variant costs the same, the financial transaction nets to zero.
- **More Expensive:** If the new item costs more, the user must go through a checkout flow to pay the difference before the new item is shipped.
- **Less Expensive:** If the new item costs less, the system must trigger a partial refund to the original payment method for the difference.

## Inventory Reservation

- The system should softly reserve the requested exchange variant immediately upon the exchange request to ensure it doesn't go out of stock while the customer is mailing back the original item.
