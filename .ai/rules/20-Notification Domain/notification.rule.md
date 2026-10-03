# Notification Rules

## Core Principles

- **Event-Driven:** The Notification Domain is purely reactive. It listens to Integration Events (e.g., `OrderPlaced`, `PasswordResetRequested`, `PaymentFailed`) published by other domains and orchestrates the delivery of messages.
- **Provider Agnostic:** Core notification logic must not be tightly coupled to specific providers (e.g., Twilio, SendGrid, Firebase). Use a Provider/Strategy pattern to allow easy swapping of underlying services.

## User Preferences & Compliance

- **Consent Management:** Before sending a non-transactional notification, check the consent or other lawful basis and opt-out requirements that apply to the recipient, channel, and jurisdiction. Store consent source and timestamp where required, and verify legal requirements with the responsible compliance owner.
- **Channel Preferences:** Allow users to define their preferred communication channels (e.g., "Send me order updates via SMS, but marketing via Email"). The Notification engine must respect these preferences routing the message appropriately.
