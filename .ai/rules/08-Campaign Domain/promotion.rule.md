# Promotion Rules

## Core Principles

- Promotions generally refer to catalog-level price reductions (Strikethrough pricing) vs cart-level discounts.
- Base Price and Promotional Price must be clearly distinguishable.
- Promotions should integrate seamlessly with search and filtering (e.g., filter by "On Sale").

## Data Structure

- Every product can have a `BasePrice` and an optional `PromotionalPrice`.
- Promotions must have a defined `StartDate` and `EndDate`.
- Ensure timezone awareness for promotion start and end times (always use UTC in the backend).

## Display Rules

- Provide standard badging (e.g., "-20%", "Sale") on product cards.
- Show the strikethrough base price next to the promotional price.
- In the cart, summarize total savings from promotions explicitly.

## Interactions with Campaigns

- Define rules for whether a product on a catalog promotion is eligible for further cart-level campaigns or coupons.
- By default, allow overlapping unless the promotion is marked `ExcludeFromCampaigns`.

## Audit & History

- Track price changes over time for legal compliance (e.g., Omnibus Directive in the EU, showing the lowest price in the last 30 days).
