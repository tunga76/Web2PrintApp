# Event Rules (Domain & Integration Events)

## Core Principles

- **Decoupling:** Use events to decouple different business domains. For example, when an `OrderPlacedEvent` occurs, the Inventory domain listens to it to decrement stock, rather than the Order domain calling the Inventory domain directly.

## Event Types

- **Domain Events:** In-process events published and consumed within the same service/monolith boundary (e.g., using a custom in-memory event bus or System.Threading.Channels). Used to trigger side-effects in the same transaction context.
- **Integration Events:** Cross-process events published to a Message Broker (e.g., RabbitMQ, Kafka, Azure Service Bus) to notify other distinct microservices or external systems.

## Reliability (Outbox Pattern)

- **Guaranteed Delivery:** When publishing Integration Events, NEVER publish directly to the message broker during a database transaction. If the DB commits but the broker fails, data is inconsistent.
- **Transactional Outbox:** When reliable integration-event delivery is needed, save the event in an outbox within the same database transaction as the business change. A Node.js worker relays the event and records delivery/retry state using the deployment's selected queue or broker.
