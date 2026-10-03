# Currency Pricing Rules

## Core Principles

- The system must support multi-currency architecture.
- All monetary values must be stored alongside their Currency Code (ISO 4217, e.g., "USD", "EUR", "TRY"). A price is meaningless without its currency.

## Exchange Rates

- A central Exchange Rate service/table must be maintained and regularly updated (e.g., daily via a background worker).
- Clearly define the "Base Currency" of the platform (e.g., USD).

## Conversion vs Fixed Pricing

- **Dynamic Conversion:** Prices are stored in a Base Currency and converted on-the-fly to the user's selected currency using the active exchange rate.
- **Fixed Currency Price Lists:** Instead of relying on fluctuating exchange rates, explicit price lists are created for specific currencies (e.g., a specific EUR price list). This is preferred for enterprise stability.

## Cart and Checkout

- If dynamic conversion is used, the exchange rate applied to the cart must be locked in when checkout begins to prevent the total changing during payment due to minor fluctuations.
- The payment gateway must explicitly be sent the correct currency code.
