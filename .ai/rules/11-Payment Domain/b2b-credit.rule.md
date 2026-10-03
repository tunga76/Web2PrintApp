# B2B Credit Limit Rules (Net Terms / Open Account)

## Core Principles

- **Frictionless B2B:** Corporate clients and wholesale resellers (B2B) often operate on Net-30 or Net-60 terms. They require a seamless checkout experience that bypasses credit card gateways by utilizing a pre-approved credit line (Cari Hesap Limiti).

## Credit Allocation & Validation

- **Credit Limit Entity:** A B2B customer (or Tenant) must have a defined `CreditLimit` (total allowed credit) and an `AvailableBalance` stored securely in the database.
- **Checkout Authorization:** During checkout, if the user selects "Pay via Invoice / B2B Credit", the system must verify that the cart total is less than or equal to their `AvailableBalance`.
- **Instant Production:** Unlike Wire Transfers, orders placed with sufficient B2B credit are immediately marked as `Paid` (or `Invoiced`) and pushed directly to the production queue without delay.

## Balance Management

- **Deduction:** The `AvailableBalance` must be decremented atomically (using database transactions/locks) the moment the order is successfully placed to prevent race conditions (e.g., placing two orders rapidly before the balance updates).
- **Replenishment:** When the B2B customer pays their monthly invoice via bank transfer or a corporate credit card, the accounting team (or automated system) logs a `PaymentReceipt`, which instantly replenishes their `AvailableBalance`.

## Edge Cases

- **Insufficient Funds:** If the cart total exceeds the available credit, the checkout UI must clearly state the remaining balance and prompt the user to either pay the difference via Credit Card (Split Payment) or request a limit increase from their account manager.
