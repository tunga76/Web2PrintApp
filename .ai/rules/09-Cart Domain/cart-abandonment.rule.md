# Cart Abandonment Rules

## Core Principles

- **Recovery Strategy:** A cart is considered "abandoned" if it has items but no activity for a specific threshold (e.g., 2 hours). The system should automatically trigger recovery workflows.
- **Privacy Compliance:** Ensure that marketing emails related to abandoned carts respect user consent (e.g., GDPR opt-ins).

## Integration

- The Cart Domain should emit an `CartAbandonedEvent` when the threshold is reached. The Notification or CRM Domain listens to this event to send emails or push notifications.
- Include a deep link in the recovery email that automatically restores the user's session and takes them directly to the checkout step, applying any incentive coupons automatically.
