# Cart Add Workflow

## Core Principles

- **Validation First:** Before adding an item to the cart, the system MUST validate:
  1. The `VariantId` exists and is `Published`.
  2. The requested `Quantity` is available in inventory (or backorder rules apply).
  3. The item respects minimum/maximum order quantities if configured.
- **Merge Duplicates:** If the same `VariantId` (with identical custom options, if any) is added again, the system must increment the `Quantity` of the existing Line Item rather than creating a duplicate row.

## Performance

- "Add to Cart" must be a very fast operation. Avoid heavy synchronous campaign recalculations immediately on the Add request if it blocks the UI. Defer full recalculation to a background thread or perform it asynchronously before returning the cart summary.
