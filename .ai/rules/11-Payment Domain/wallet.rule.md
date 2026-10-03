# Wallet Rules

## Core Principles

- **Closed-Loop System:** A digital wallet allows customers to store funds (Store Credit, Cashback, Pre-paid balances) for future purchases.
- **High Concurrency:** Wallet balances must be updated using pessimistic locking or an event-sourced ledger to prevent double-spending in high-concurrency scenarios.

## Transactions

- **Ledger:** Every addition (Top-up, Cashback Earned, Refund to Wallet) and deduction (Purchase, Expiration) must be recorded as an immutable ledger entry. The current balance is simply the sum of all ledger entries.
- **Split Payments:** The system must support split payments, where a Wallet balance covers part of the order, and a Credit Card covers the remaining amount.
