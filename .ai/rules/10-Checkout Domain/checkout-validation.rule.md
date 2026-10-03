# Checkout Validation Rules

## Core Principles

- **The Final Gatekeeper:** The final request to "Place Order" (or generate the Payment Intent) is the most critical validation point in the system. You must re-validate everything that was validated during the Cart phase.
- **Race Conditions:** Assume the user has left the checkout tab open for hours. 

## Mandatory Validations (Pre-Payment)

1. **Inventory Lock:** Attempt to softly reserve inventory for the items. If an item went out of stock while they were in checkout, fail gracefully and redirect back to the cart with a clear error.
2. **Price Integrity:** Recalculate all totals, taxes, and campaign discounts. If the total differs from what the user agreed to (e.g., a campaign just expired), the checkout must halt and ask the user to re-confirm the new total.
3. **Coupon Validity:** Re-verify that any applied coupons are still valid and haven't reached their usage limits.
4. **Customer Status:** Ensure the user account hasn't been banned or suspended during the session.

## Error Handling

- Return highly specific, localized errors to the frontend. Avoid generic "Checkout Failed" messages. Explain exactly what failed (e.g., "The item 'Red T-Shirt' is no longer in stock.").
