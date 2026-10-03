# Store Credit Rules

## Core Principles

- **Alternative to Cash Refund:** Offering Store Credit (instead of refunding to the credit card) retains the revenue within the ecosystem.
- **Incentivization:** The system can support logic to incentivize Store Credit (e.g., "Get a full cash refund, or get 110% of the value in Store Credit").

## Wallet Integration

- Store Credit is deposited directly into the user's digital Wallet (handled by the Payment Domain).
- **Expiration:** Store credit issued from returns generally should not expire (depending on local laws), unlike promotional cashback. This distinction must be tracked in the Wallet ledger.

## Workflow

1. Return inspection is approved.
2. The user selected "Store Credit".
3. The Payment Domain issues a ledger update adding the amount to the user's Wallet.
4. No network call is made to the payment gateway (e.g., Stripe) to refund the original credit card.
