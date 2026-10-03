# Order Status Rules

## Core Principles

- **State Machine:** Order status changes must follow a strict, predefined State Machine (e.g., `Pending Payment` -> `Processing` -> `Shipped` -> `Delivered`).
- **Domain Events:** Every status transition MUST emit a Domain/Integration Event (e.g., `OrderShippedEvent`) to notify other domains (like Notification to send an email, or Analytics to record a conversion).

## Status Definitions

- **Pending Payment:** Order is created but funds are not yet secured.
- **Processing (Paid):** Funds are secured, and the order is ready for warehouse fulfillment.
- **Shipped:** The package has left the facility and is with the carrier.
- **Delivered:** Confirmed received by the customer.
- **Cancelled:** Order was voided before fulfillment.
- **Refunded:** Order was returned and funds were returned to the customer.

## Authorization

- Certain status transitions can only be triggered by specific actors (e.g., only the Payment gateway can transition an order to `Processing`; only the Warehouse can transition to `Shipped`).
