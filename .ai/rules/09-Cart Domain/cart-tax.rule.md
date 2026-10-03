# Cart Tax Rules

## Core Principles

- **Jurisdiction Dependency:** Tax calculation depends heavily on the destination (shipping address) or origin (store location) and the specific tax category of each product (e.g., standard rate vs. reduced rate for food).
- **Tax Inclusion:** The system must handle both Tax-Inclusive (B2C, European VAT model) and Tax-Exclusive (B2B, US Sales Tax model) pricing seamlessly based on configuration.

## Calculation

- If the customer's shipping address is not yet known in the Cart phase, estimate taxes based on their geo-IP location or default store configuration, but clearly label it as "Estimated Tax".
- Do not round taxes per line item prematurely; calculate tax at the line level with high precision, sum them up, and round at the cart total level to avoid off-by-one-cent errors.
