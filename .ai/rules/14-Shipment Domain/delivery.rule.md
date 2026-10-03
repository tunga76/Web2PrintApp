# Delivery Rules

## Core Principles

- **Proof of Delivery (POD):** A shipment is only considered fulfilled when Proof of Delivery is received from the carrier.
- **Financial Trigger:** For many accounting practices, revenue is formally recognized, and funds from escrow/auth are captured, precisely at the moment of `Delivery`, not at `Dispatch`.

## Delivery Exceptions

- The system must handle delivery failures (e.g., "Customer Not Home", "Incorrect Address", "Damaged in Transit").
- When a delivery fails permanently, the shipment transitions to `Returned to Sender` (RTS). This must automatically trigger workflows in the Order and Return domains to either reship or issue a refund.
