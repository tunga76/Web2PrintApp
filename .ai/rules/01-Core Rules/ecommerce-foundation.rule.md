# E-commerce Foundation Rules

These are baseline requirements for customer-facing commerce and order-processing features. Apply the linked domain rules for details. This file is technology-neutral; platform and vendor examples elsewhere are conditional unless the project architecture explicitly adopts them.

## Product and price integrity

- A purchasable product must have an explicit publish/availability state and a stable identifier. Unpublished or unavailable products must not be purchasable through direct API requests.
- The server is authoritative for price, discount, tax, shipping, and payable total. Never accept a client-calculated total as the amount to charge.
- Represent money with an exact decimal or integer-minor-unit representation and an explicit currency. Do not use binary floating-point for financial calculations.
- Define rounding and tax behavior for the supported currency and jurisdiction. Show material price changes to the customer and obtain renewed confirmation before payment.
- A completed order must preserve a purchase-time snapshot of product description/SKU, quantity, unit price, discounts, tax, currency, shipping charge, and delivery/billing details needed to explain the transaction later.

## Cart and checkout

- Revalidate product availability, configured options, current price, discounts, shipping eligibility, and totals on the server when checkout is submitted.
- Enforce checkout and order state transitions on the server. The UI may guide the flow but must not authorize a transition.
- Prevent duplicate order creation and duplicate payment attempts when the client retries after a timeout or the customer double-submits.
- Tell the customer what changed when checkout revalidation fails; do not silently charge a different total or substitute an item.
- Preserve a recoverable cart after transient payment failure when safe to do so. Do not create a paid order until payment confirmation is authoritative for the selected payment method.

## Payment and refunds

- Use a payment provider's hosted/tokenized flow where available. Do not store raw card security codes or full card numbers.
- Verify payment notifications using the provider's documented signature/authentication method. Make webhook and retry processing idempotent, and reconcile asynchronous provider results with local payment/order state.
- Record each charge, capture, refund, reversal, and dispute as a traceable financial movement linked to the original order/payment. Never edit a completed movement to disguise a correction; use a compensating movement.
- Ensure cumulative refunds cannot exceed the amount captured, accounting for prior partial refunds and currency precision.
- Separate payment state from fulfillment state. A payment event must not skip required fulfillment, fraud, file, or operational checks.

## Inventory and fulfillment

- If stock is tracked, reserve and release it atomically according to a documented reservation policy. Prevent overselling under concurrent checkout attempts.
- Do not treat a cart as a permanent stock reservation unless an explicit policy defines its expiry and release behavior.
- Track fulfillment and shipment separately from payment. A shipped order must have a valid fulfillment record and, when available, carrier/tracking details.
- Preserve an audit trail for manual adjustments to stock, order status, price overrides, refunds, and fulfillment decisions.

## Identity, privacy, and access

- Authorize every protected operation on the server and enforce ownership checks for customer-specific carts, orders, files, addresses, and saved designs.
- Collect only personal data needed for the transaction or a documented service purpose. Restrict access, avoid sensitive values in logs, and define retention/deletion behavior for each data class.
- Treat guest access tokens and order lookup links as credentials: make them unguessable, narrowly scoped, time-limited where appropriate, and safe to revoke.
- Keep administrative and support actions attributable to an authenticated operator with the permissions required for that action.

## Customer communication and experience

- Confirm order receipt and communicate material order/payment/fulfillment state changes through the configured channels. Notifications must reflect authoritative state and must not claim a payment or shipment succeeded before confirmation.
- Provide clear validation, loading, empty, failure, and retry states for customer actions that depend on server work.
- Keep keyboard access, readable validation errors, and responsive behavior in all purchase-critical flows.
- Publish applicable shipping, cancellation, return, privacy, and payment terms before the customer commits. The exact terms must be reviewed for the markets where the store operates.

## Reliability and change safety

- Keep payment, order, stock, and fulfillment changes consistent using transactions within a data boundary and explicit retry/compensation behavior across external boundaries.
- Log and monitor failures in checkout, payment callbacks, order creation, stock reservation, and fulfillment without logging secrets or payment credentials.
- Test the important success and failure paths, including stale prices, unavailable stock, duplicate submissions, delayed/duplicate webhooks, partial refunds, and unauthorized cross-customer access.
- Before adding a commerce behavior, identify its owning domain, state transitions, data invariants, external side effects, and recovery path. Do not implement financial or stock behavior as an unvalidated direct database edit.

## Related rules

- [security.rule.md](../02-Security%20Rules/security.rule.md), [authorization.rule.md](../02-Security%20Rules/authorization.rule.md), [data-privacy.rule.md](../02-Security%20Rules/data-privacy.rule.md)
- [pricing.rule.md](../07-Pricing%20Domain/pricing.rule.md), [cart.rule.md](../09-Cart%20Domain/cart.rule.md), [checkout.rule.md](../10-Checkout%20Domain/checkout.rule.md)
- [payment.rule.md](../11-Payment%20Domain/payment.rule.md), [order.rule.md](../12-Order%20Domain/order.rule.md), [inventory.rule.md](../13-Inventory%20Domain/inventory.rule.md), [shipment.rule.md](../14-Shipment%20Domain/shipment.rule.md)
