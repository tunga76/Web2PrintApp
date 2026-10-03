# Currency Rules

## Core Principles

- **Currency is Inseparable from Amount:** A monetary value is meaningless without its currency. Always store and pass both the amount and the currency code (ISO 4217, e.g., "USD", "EUR").
- **Precision:** Use decimal/numeric data types. Never use floating-point types for currency.

## Base Currency vs Display Currency

- **Base Currency:** Define a single Base Currency for the platform's accounting and analytics reporting.
- **Display Currency:** When converting prices for display, use reliable, frequently updated exchange rates.

## Payment & Gateway Consistency

- The checkout process must strictly lock the currency being charged. Ensure that the exact currency and amount displayed to the user are what is sent to the payment gateway (e.g., Stripe, PayPal). 
- Avoid rounding errors during currency conversion, especially when calculating taxes and line item totals.
