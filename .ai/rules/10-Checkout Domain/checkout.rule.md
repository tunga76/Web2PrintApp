# Checkout Rules

## Core Principles

- **State Machine:** Checkout is a linear or non-linear state machine (e.g., Cart -> Address -> Shipping -> Payment -> Placed). The backend must enforce the state transitions. A user cannot jump to Payment without a valid Address.
- **Immutability Lock:** Once the user transitions to the Payment step and a payment intent is created, the underlying Cart must be temporarily locked or converted to a pending Order to prevent concurrent modifications (like changing quantities in another tab) that would invalidate the payment amount.

## Architecture

- **Saga / Orchestration:** The final "Place Order" action is the orchestrator of multiple domains (Payment, Inventory, Order, Cart). Use the Saga pattern to handle failures (e.g., Payment succeeds, but Inventory reservation fails -> trigger Refund and mark Order as failed).
- **Guest vs Authenticated:** Support both guest and authenticated checkout flows natively. Guest checkout should prompt for account creation on the success page, seamlessly linking the newly created account to the just-placed order.
