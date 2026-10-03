# Workflow Engine Rules

## Core Principles

- **State Externalization:** Complex, multi-step business processes (e.g., Order Fulfillment, Returns) should not be hardcoded as deeply nested IF/ELSE statements. Use a Workflow Engine (e.g., Temporal, AWS Step Functions, or custom state machines) to manage state, retries, and compensations.
- **Sagas for Distributed Transactions:** E-commerce involves multiple microservices or bounded contexts. Use the Saga pattern to ensure data consistency. If Step B fails, the Workflow Engine MUST automatically trigger the compensating action for Step A (e.g., if Inventory Reserve succeeds but Payment Capture fails, the engine must release the inventory).

## Versioning

- Workflows are long-lived. If the business logic for "Order Fulfillment" changes today, orders that started the workflow yesterday must complete using the old logic, or be explicitly migrated.
