# Tracking Rules

## Core Principles

- **Customer Visibility:** Providing accurate tracking information is critical to reducing customer support inquiries ("Where is my order?").
- **Webhooks over Polling:** Rely on Carrier Webhooks to push tracking status updates (e.g., `In Transit`, `Out for Delivery`, `Exception`) to the platform. Only use polling as a fallback mechanism for carriers that lack webhooks.

## Internal Mapping

- Map carrier-specific tracking statuses (which vary wildly between providers) to a standardized internal set of tracking statuses (e.g., `PreTransit`, `InTransit`, `OutForDelivery`, `Delivered`, `FailedAttempt`, `Exception`).
- When an internal status updates, emit an event (e.g., `ShipmentTrackingUpdatedEvent`) so the Notification domain can alert the customer via email or SMS if configured.
