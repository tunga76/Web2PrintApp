# Hepsiburada Integration Rules

## Core Principles

- **Merchant SKU:** Hepsiburada uses the Merchant SKU (Mağaza Stok Kodu) for matching. Ensure internal SKUs are strictly alphanumeric and comply with HB's length limits.
- **Buybox Dynamics:** Hepsiburada operates a Buybox model. Pricing integrations should ideally support dynamic repricing strategies to compete for the Buybox without violating minimum margin rules.

## Orders & Lifecycle

- **Package Generation:** Hepsiburada requires the explicit creation of "Packages" (Paket) for an order before it can be marked as shipped. The integration must group line items logically into these packages.
- **Status Sync:** Strictly map internal order statuses to Hepsiburada's specific workflow (e.g., `Unpacked`, `Packed`, `Shipped`, `Delivered`).
