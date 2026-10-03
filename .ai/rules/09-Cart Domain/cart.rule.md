# Cart Rules

## Core Principles

- **Statefulness:** The Cart is inherently stateful but should be treated as ephemeral. It is a temporary workspace for the customer to build an order.
- **Persistence:** Carts should be persisted (e.g., in Redis or PostgreSQL JSON columns) to survive session restarts. Guest carts must be merged into authenticated carts when a user logs in.
- **Revalidation:** Because prices, inventory, and campaigns change, the cart MUST be revalidated against the current Catalog and Pricing engines before transitioning to Checkout.

## Data Structure

- A Cart contains Line Items. Each Line Item maps to a specific `VariantId` (never just a `ProductId`), `Quantity`, and current unit price.
- The Cart must track its active Currency and the associated Customer/Guest session ID.
