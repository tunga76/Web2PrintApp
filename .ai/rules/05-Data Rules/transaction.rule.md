# Transaction Rules

## Core Principles

- **ACID Compliance:** All operations that modify multiple entities or tables that must succeed or fail together MUST be wrapped in a database transaction.
- **Atomic Persistence:** Use the transaction capabilities of the selected database client/ORM to commit related changes atomically. Keep transaction boundaries explicit and do not hold database transactions open while waiting for external network calls.

## Isolation Levels

- **Default:** Rely on the database's default isolation level (usually Read Committed) for standard operations.
- **High Concurrency:** For critical operations susceptible to race conditions (e.g., decrementing inventory, wallet deductions, applying a single-use coupon), explicitly use a higher isolation level (e.g., `Serializable`), Pessimistic Locking (`SELECT ... FOR UPDATE`), or Optimistic Concurrency Control (Row Version/Concurrency Tokens).

## Distributed Transactions

- **Avoid Two-Phase Commit:** Avoid traditional distributed transactions (2PC) across microservices.
- **Sagas / Outbox:** Use the Outbox Pattern and Saga Pattern (Choreography or Orchestration) to manage eventual consistency across distributed service boundaries.
