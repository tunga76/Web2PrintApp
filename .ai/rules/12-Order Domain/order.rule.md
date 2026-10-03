# Order Rules

## Core Principles

- **Immutability of History:** An Order record represents a financial contract at a specific point in time. Once placed, its core attributes (historical prices, applied discounts, shipping address snapshot) MUST NEVER change, even if the underlying product price or customer address changes in the database later.
- **Single Source of Truth:** The Order Domain is the central hub for fulfillment, customer service, and financial reporting.

## Data Structure

- **Line Items:** An order is composed of `OrderLineItem` records. Each line item must store the exact `VariantId`, `SKU`, `Quantity`, `UnitPrice`, `TaxAmount`, and `DiscountAmount` at the moment of purchase.
- **Snapshots:** The `ShippingAddress`, `BillingAddress`, and `CustomerEmail` must be saved as JSON or flattened columns directly on the Order record.
