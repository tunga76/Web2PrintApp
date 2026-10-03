# Price List Rules

## Core Principles

- A Price List is a collection of prices assigned to products, distinct from the default "Base Price".
- Price lists enable multi-channel, multi-region, or B2B/B2C separation (e.g., "Retail Price List", "Wholesale Price List", "EU Region Price List").

## Resolution Hierarchy

- The system must evaluate price lists in a defined priority order.
- E.g., Customer-specific Price List -> Tier Price List -> Default Region Price List -> Base Catalog Price.
- If a product does not have an entry in the targeted price list, the system should fall back to the Base Price.

## Activation and Scheduling

- Price lists can be scheduled with valid `StartDate` and `EndDate`.
- Ensure timezone accuracy (store dates in UTC) when activating scheduled price lists.

## Scale

- Price lists must support large scale (e.g., 100k+ SKUs). Updates to a price list should not lock the database; prefer background batch processing or event-driven updates.
