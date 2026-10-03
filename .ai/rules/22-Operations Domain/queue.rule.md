# Queue Rules

## Core Principles

- **Asynchronous Decoupling:** Any operation that involves external APIs (Payment, ERP, Email) or takes longer than a few hundred milliseconds must be offloaded to a Message Queue (e.g., RabbitMQ, Azure Service Bus).
- **At-Least-Once Delivery:** Assume the queue will deliver the same message more than once due to network issues or consumer crashes. All Queue Consumers MUST be Idempotent (processing the same message twice safely without duplicating data).

## Failure Handling

- **Dead Letter Queues (DLQ):** Messages that fail processing repeatedly (e.g., after 3 retries) must be moved to a DLQ for manual inspection. Never let a poison message infinitely block the queue.
