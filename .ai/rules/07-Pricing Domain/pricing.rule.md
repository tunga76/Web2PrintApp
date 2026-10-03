# Pricing Domain Rules

## Core Principles

- **Money Handling:** Store monetary values using an exact representation supported by the chosen database (for example, integer minor units or PostgreSQL `numeric`) and always pair amounts with a currency. Never use JavaScript `number` floating-point arithmetic as the authoritative financial calculation without an explicit decimal-safe strategy.
- **Immutability:** Once an order is created, its prices (unit price, total, taxes) must be immutable, regardless of future price changes in the catalog.
- **Tax Handling:** Base prices must clearly indicate whether they are tax-inclusive (B2C standard in many regions) or tax-exclusive (B2B standard).

## Precision and Rounding

- Prices should typically be stored to 4 decimal places internally, but rounded to 2 decimal places (or according to currency standards) only at the final display or transaction stage.
- Always use Banker's Rounding (Round half to even) or the legally required rounding strategy for the target locale.

## Display Rules

- Ensure uniform formatting for prices across the application (e.g., always show currency symbol, respect local decimal/thousands separators).
- When a price is discounted, the original (strikethrough) price and the new price must be prominently displayed.

## Performance

- Product list and search responses must fetch pricing efficiently. Denormalize calculated prices to a search index or read model where necessary, rather than calculating on-the-fly for every product card.
