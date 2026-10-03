# Payment Provider Rules

## Core Principles

- **Abstract the Provider:** The core application logic must not be tightly coupled to a specific payment gateway (e.g., Stripe, PayPal, Iyzico). Use the Provider/Strategy pattern (e.g., `IPaymentGateway` interface).
- **Multiple Providers:** Support routing payments to different providers dynamically based on the user's country, currency, or the total cart amount to optimize for lower transaction fees.

## Webhooks Integration

- Payment providers will communicate state changes (Success, Failure, Refunded, Chargeback) via Webhooks.
- Webhooks MUST be validated using the provider's signature to ensure authenticity.
- Webhook processors must be idempotent (process the same `evt_123` only once).
