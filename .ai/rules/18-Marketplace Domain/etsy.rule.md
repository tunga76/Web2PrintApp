# Etsy Integration Rules

## Core Principles

- **Handmade & Vintage Focus:** Etsy's taxonomy is unique. The integration must support complex variations (e.g., custom text inputs from buyers) which are common in personalized products.
- **OAuth 2.0:** Etsy v3 API requires strict OAuth 2.0 flows with refresh tokens. The system must manage token lifecycles securely without user intervention.

## Inventory & Shipping

- **Quantity Limits:** Etsy sometimes caps the maximum quantity that can be listed for a single item (e.g., 999). Ensure inventory sync logic respects these boundaries.
- **Shipping Profiles:** Map internal shipping logic to Etsy's "Shipping Profiles" (required for every listing) to accurately reflect international delivery times and costs.
