# Cashback Rules

## Core Principles

- Customers receive a percentage of their purchase amount back into a dedicated wallet or as store credit.
- Cashback is an incentive for retention, differing from immediate discounts.

## Earning Cashback

- Cashback amount is calculated post-discounts on the net product value.
- Cashback must remain in a "Pending" state until the return period for the order has elapsed.
- Support fixed amount cashback or percentage-based.

## Wallet & Balances

- Maintain a secure, transactional wallet for each customer.
- Prevent race conditions during wallet top-ups and deductions (use pessimistic locking or event sourcing).

## Usage

- Cashback balance can be applied during checkout to offset the order total.
- Clarify if cashback can cover shipping and taxes.

## Expiration & Restrictions

- Cashback can have expiration dates to encourage quick return purchases.
- Certain products or categories might be excluded from earning or being purchased with cashback.

## Refunds

- Refunding an item revokes the corresponding pending/earned cashback.
- Refunding an order paid with cashback returns the balance to the wallet.
