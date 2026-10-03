# Customer Pricing Rules

## Core Principles

- Customer Pricing overrides all other catalog and standard price lists.
- Typically used in B2B scenarios where individual customers negotiate specific rates for specific SKUs or categories.

## Implementation

- Map a `CustomerId` or `CompanyId` directly to a specific Price List, or allow customer-specific override records.
- Avoid iterating through every rule on the fly. Cache customer-specific prices upon login or session start if feasible, or use highly optimized targeted queries.

## Interactions

- Specify whether Customer Pricing can be combined with global campaigns/coupons. Often in B2B, negotiated customer prices exclude them from retail campaigns.
- Highlight the customized pricing to the user (e.g., "Your Negotiated Price").
