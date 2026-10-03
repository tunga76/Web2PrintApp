# Product Variant Rules

## Core Principles

- **The Sellable Unit:** When a product comes in different options (e.g., Size, Color), the Variant is the actual item that is added to the cart, tracked in inventory, and priced.
- **Unique Identifiers:** Every Variant MUST have a unique `SKU` and a unique `GTIN` (Barcode/UPC/EAN) if applicable.

## Architecture

- **Parent-Child:** Variants belong to a parent `Product`. The parent holds the canonical description and brand; the variant holds specific overrides (e.g., variant-specific images, price differences, weight).
- **Option Permutations:** A variant is defined by a combination of Option Values (e.g., Size = M, Color = Red). The system must handle the matrix generation of these permutations gracefully.

## Pricing and Inventory

- **Distinct Tracking:** Inventory must be tracked at the Variant level, never at the base Product level.
- **Price Overrides:** Variants must be able to override the base product price (e.g., XXL size costs $5 more).
