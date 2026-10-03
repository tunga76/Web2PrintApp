# Product Rules

## Core Principles

- **Base Entity:** The `Product` entity represents the base definition of a sellable item. It contains shared information like `Name`, `Description`, `BrandId`, and `PrimaryCategoryId`.
- **SKU Management:** Every sellable unit MUST have a unique SKU (Stock Keeping Unit). If a product has variants, the SKU resides on the Variant. If it's a simple product, the SKU resides on the Product itself (or a default hidden variant).

## Status and Lifecycle

- **Publishing:** Products must have explicit lifecycle states (e.g., `Draft`, `Published`, `Archived`). Only `Published` products appear in the storefront.
- **Soft Deletion:** Never hard-delete products that have been included in orders to preserve historical order integrity. Use `Archived` or `IsDeleted` flags.

## Denormalization

- For read-heavy operations (like the storefront catalog view), product data (including its current price, primary image, and basic attributes) should be projected into a read-optimized NoSQL store, Search Index, or a denormalized cache layer to avoid massive JOIN operations.
