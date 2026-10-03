# Accounting Integration Rules

## Core Principles

- **Financial Integrity:** The e-commerce platform is a sub-ledger. All financial transactions (Payments, Refunds, Chargebacks, Gift Card usage) must be exported to the main Accounting system as journal entries or formalized invoices/receipts.
- **Timing of Revenue Recognition:** Work closely with the finance team to determine *when* an order is pushed to accounting. It is often pushed when the order is *Shipped* (revenue recognized) rather than when the order is *Placed* (deferred revenue).

## Reconciliation

- Provide daily or weekly reconciliation reports that aggregate total sales by payment provider (e.g., "Stripe Total: $5000"). The accounting system will use this to match against the actual cash deposits hitting the corporate bank account.
