# Order Cancellation Rules

## Core Principles

- **Time Window:** Customers typically have a short grace period (e.g., 30 minutes) to cancel an order themselves via the UI, provided the status is still `Processing` and fulfillment hasn't started.
- **Warehouse Sync:** If an order has already been sent to the Warehouse Management System (WMS) for picking/packing, cancellation requires an explicit acknowledgment from the WMS that the process was successfully halted.

## Financial & Inventory Impact

- **Release Inventory:** Cancelling an order MUST immediately release any softly reserved inventory back to the available pool.
- **Void vs Refund:** 
  - If the payment was only *Authorized*, a cancellation should trigger a `Void` request to the payment provider.
  - If the payment was already *Captured*, a cancellation must trigger a full `Refund` workflow.
