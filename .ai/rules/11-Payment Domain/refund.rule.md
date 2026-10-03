# Refund Rules

## Core Principles

- **Traceability:** A Refund is a specific type of Payment Transaction linked to the original Charge/Capture transaction.
- **Partial vs. Full:** Support both Full and Partial refunds. The total refunded amount must never exceed the originally captured amount.

## Calculation

- When performing a partial refund for a specific Line Item, the system must correctly prorate any cart-level discounts and taxes that were originally applied to that item to determine the exact refundable amount.
- Non-refundable items (e.g., shipping costs, specific digital goods) must be explicitly flagged and excluded from automatic refund calculations.

## Workflow

- Refunds generally require administrative approval unless triggered by an automated return workflow.
- Emit a `RefundIssuedEvent` so other domains (like Loyalty) can deduct points earned from the refunded amount.
