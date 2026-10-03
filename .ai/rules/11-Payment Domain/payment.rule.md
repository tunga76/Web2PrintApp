# Payment Rules

## Core Principles

- **Security & Compliance:** The application must never store raw Primary Account Numbers (PAN) or CVVs in the database. Rely entirely on PCI-DSS compliant tokenization provided by the payment gateways (e.g., Stripe, Iyzico).
- **Immutability:** Payment records (Transactions, Invoices) are strictly immutable. If an error occurs or a correction is needed, a compensating transaction (like a Refund or Adjustment) must be created.
- **Idempotency:** All payment requests to external providers must use Idempotency Keys (usually the Order ID or a unique UUID generated before the request) to prevent double-charging users during network retries.

## Data Structure

- A single Order can have multiple Payment Transactions (e.g., split payment, partial refund, chargeback).
- Track the exact Currency, Amount, Provider, and Provider-Specific Transaction ID for every movement of funds.
