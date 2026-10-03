# Installment Rules

## Core Principles

- **Provider Capabilities:** Installment (EMI) options depend on the payment provider and the customer's credit card BIN (Bank Identification Number).
- **Transparency:** The total cost of the installment plan, including any interest/commission applied by the gateway or the merchant, must be clearly displayed to the user before they confirm the payment.

## Calculation

- Fetch available installment rates dynamically from the payment provider based on the cart total.
- If the merchant absorbs the installment commission, it should be tracked as a cost of sale. If the customer pays it, the final captured amount must include the commission.
