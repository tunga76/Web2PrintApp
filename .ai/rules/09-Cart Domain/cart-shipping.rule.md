# Cart Shipping Rules

## Core Principles

- **Estimation:** Shipping costs should be estimated in the cart if a zip code or region is provided, but finalized during checkout.
- **Thresholds:** The cart should calculate and expose data to drive UI incentives, such as "Spend $15 more for Free Shipping!" based on active Campaign rules.

## Physical Constraints

- The cart must aggregate total weight, volume (dimensions), and check for restricted shipping zones for the specific items inside, passing this data to the Shipping integration to retrieve valid rates.
