# Webhook Rules

## Core Principles

- **Event-Driven Integration:** Webhooks provide a mechanism for the platform to notify external systems (like ERP, CRM, or external payment gateways) of state changes in real-time.
- **Idempotency:** Webhook consumers must be designed to be idempotent, as webhooks may be delivered "at least once" (duplicate deliveries are possible).

## Security

- **Signature Verification:** All outgoing webhooks MUST be signed using a cryptographic HMAC signature (e.g., `X-Signature: sha256=...`) generated using a shared secret. Consumers must verify this signature to ensure the payload hasn't been tampered with and originated from your platform.
- **HTTPS Only:** Webhooks must only be delivered to secure `https://` endpoints.

## Reliability and Retries

- **Asynchronous Dispatch:** Dispatch outgoing webhooks through a background worker/queue when delivery needs retries or provider latency must not block the originating request or transaction.
- **Retry Policy:** Implement exponential backoff for failed webhook deliveries (e.g., 500 errors or timeouts). Stop retrying after a defined maximum threshold (e.g., 24 hours).
- **Timeouts:** Enforce a strict, short timeout (e.g., 5 seconds) for webhook HTTP requests to prevent slow consumers from exhausting worker threads.
