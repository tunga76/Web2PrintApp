# Chargeback Rules

## Core Principles

- **Dispute Handling:** A Chargeback (or Dispute) occurs when a customer contests a charge directly with their bank.
- **Status Tracking:** The system must listen to Chargeback webhooks from the payment provider and update the Order and Payment transaction status to `Disputed`.

## Operations

- Automatically halt fulfillment (if not yet shipped) when a chargeback notification is received.
- Provide a UI for administrators to upload evidence (shipping receipts, logs) to the payment provider to contest the chargeback programmatically via API.
- If a chargeback is lost, the system must record the loss (including chargeback fees) in the financial ledger for accurate accounting.
