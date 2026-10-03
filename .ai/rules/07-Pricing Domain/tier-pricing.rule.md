# Tier Pricing Rules

## Core Principles

- Customer bases can be segmented into Tiers (e.g., Bronze, Silver, Gold, VIP).
- Tiers unlock a global discount percentage or grant access to a specialized Tier Price List.

## Assignment

- Tier assignment should be driven by business rules (e.g., lifetime spend, subscription status) and updated asynchronously via background jobs.
- Changing a user's tier must immediately invalidate any cached pricing they have.

## Display Rules

- To incentivize higher spending, UI should optionally display the price for the *next* tier (e.g., "Gold members pay $90. Spend $50 more to unlock Gold!").

## Resolution

- Tier Pricing sits below Customer-Specific Pricing but above the Default Base Price.
