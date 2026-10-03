# Payment Workflow Rules

## Core Principles

- **Two-Step Verification (Auth & Capture):** Prefer the Authorization & Capture workflow.
  1. **Authorize:** During checkout, authorize the amount to ensure funds are available.
  2. **Capture:** Capture the funds only when the order is fulfilled/shipped (or based on business rules). This avoids refunding fees if an order is cancelled before fulfillment.
- **Asynchronous Confirmation:** Payment completion is often asynchronous (e.g., 3D Secure redirects, Webhooks). The system must handle pending payment states and rely on Webhooks to finalize the order status.

## Failure Handling

- If a payment fails (Insufficient funds, 3D Secure failure), the Order state remains `Pending Payment` (or `Failed`), and the user should be prompted to retry with a different method without losing their cart.
