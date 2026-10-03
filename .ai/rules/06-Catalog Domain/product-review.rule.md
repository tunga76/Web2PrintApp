# Product Review Rules

## Core Principles

- **User Generated Content (UGC):** Reviews provide social proof. They consist of a Rating (e.g., 1-5 stars) and an optional Text Body.
- **Moderation:** Reviews must pass through a moderation state (`Pending`, `Approved`, `Rejected`). Unapproved reviews must not be visible to the public.

## Verification

- **Verified Purchase:** The system must clearly distinguish and badge "Verified Purchases" by validating that the user actually purchased the product variant they are reviewing.

## Aggregation

- **Performance:** Do not calculate the average rating and review count by querying all review rows dynamically on the product page. 
- **Cached Aggregates:** Maintain `AverageRating` and `ReviewCount` aggregate fields on the `Product` entity or in the read-model. Update these asynchronously when a new review is approved or deleted.
