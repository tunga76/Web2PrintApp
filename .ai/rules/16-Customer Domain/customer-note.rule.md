# Customer Note Rules

## Core Principles

- **Internal Context:** Customer Notes are internal records created by customer service representatives, sales teams, or automated systems to track interactions, complaints, or VIP context.
- **Visibility:** These notes must NEVER be exposed to the customer on the storefront.

## Auditability

- Every note must be stamped with the `CreatedAt` timestamp and the `CreatedBy` `AdminUserId`.
- Notes should generally be immutable (append-only) to maintain a reliable historical record of customer service interactions.
