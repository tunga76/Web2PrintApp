# Wishlist Rules

## Core Principles

- **Intent to Purchase:** A wishlist indicates strong purchase intent. It must be tracked per customer.
- **Variant Specificity:** Items added to a wishlist must be specific `VariantId`s, not just the generic `ProductId` (e.g., they want the "Red, Size M" shirt, not just the shirt).

## Guest vs Authenticated

- Support guest wishlists (stored in local storage/cookies or server-side tied to a session ID).
- When a guest logs in, their guest wishlist must merge with their persisted account wishlist without creating duplicates.

## Integration

- **Availability:** If an item on a wishlist goes out of stock, it should remain on the wishlist but be visually marked as unavailable.
- **Price Drops:** Emit events when prices drop. The CRM/Notification domain can use these events to email customers ("An item on your wishlist is on sale!").
