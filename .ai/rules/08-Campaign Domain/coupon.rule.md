# Coupon Rules

## Core Principles

- Coupons are customer-provided codes that unlock specific discounts or benefits.
- A coupon must always be validated against the current cart state securely on the backend.
- Coupons have higher priority than automatic campaigns unless configured otherwise.

## Types of Coupons

- Single-use Unique Codes (e.g., Welcome discount)
- Multi-use Generic Codes (e.g., SUMMER2026)
- Influencer / Affiliate Codes

## Constraints and Limits

- Usage Limit per Code (e.g., first 100 users)
- Usage Limit per Customer (e.g., 1 per user)
- Expiration Time
- Minimum Order Value required
- Restricted to specific categories, products, or brands.
- Exclusions (e.g., does not apply to already discounted items)

## Lifecycle

- **Apply:** User enters code. System validates and calculates discount.
- **Reserve:** When checkout begins, coupon usage is temporarily locked.
- **Redeem:** When order is paid successfully, coupon usage is permanently decremented/recorded.
- **Release:** If order fails or is cancelled, coupon usage lock is released.

## Error Handling

- Return clear, localized error messages when a coupon fails validation (e.g., "Minimum amount not reached", "Coupon expired", "Invalid coupon").
