# Print Order Lifecycle and Cancellation Rules (Web-To-Print)

## Core Principles

- **Custom Manufacturing:** Unlike standard retail orders, web-to-print orders involve creating a physical product that has zero resale value to other customers. The order lifecycle must reflect the stages of manufacturing.
- **Strict Cancellation Window:** A customer's ability to cancel an order must be completely revoked the moment physical production begins.

## Print-Specific Order Statuses

In addition to standard e-commerce statuses (Paid, Shipped), the system must track production sub-statuses (usually at the `OrderLineItem` level, since different items in a cart might be printed at different facilities or times):

1. **`PreFlight` (Dosya Kontrolü):** The print file is being verified (automatically or manually) for resolution, bleed, and color space correctness.
2. **`ArtworkRejected` (Dosya Reddedildi):** The file failed verification. Production is paused. The system must notify the customer to upload a corrected file.
3. **`InProduction` (Baskıda/Üretimde):** The file has been sent to the plates (CTP) or the digital press. **POINT OF NO RETURN.**
4. **`QualityControl` (Kalite Kontrol):** Printing is done, the item is being cut, folded, packed, and checked for defects.

## The Cancellation Lock

- **Pre-Production Phase:** Customers can cancel their order (or specific line items) for a full refund ONLY while the status is `PendingPayment`, `Paid`, or `PreFlight`.
- **Lock Activation:** The exact second the status changes to `InProduction`, the UI must remove the "Cancel Order" button for the customer. Customer service agents must also be warned by the system that canceling requires contacting the production floor directly to see if physical waste can be stopped.
- **Partial Cancellations:** If an order has 3 items, and only 1 is `InProduction`, the customer can still cancel the other 2 items. Cancellations must be evaluated at the Line Item level.

## Artwork Updates & SLA Delays

- If an order is in the `PreFlight` or `ArtworkRejected` state, the customer is allowed to upload a replacement design.
- Uploading a new design resets the state back to `PreFlight` and MUST recalculate the promised Delivery Date (SLA), as the delay was caused by the customer.
