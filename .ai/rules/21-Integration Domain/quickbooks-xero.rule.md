# QuickBooks & Xero Integration Rules

## Core Principles

- **Small/Medium Business (SMB) Focus:** QuickBooks Online (dominant in the US) and Xero (dominant in Europe/ANZ) are essential for selling the Web-To-Print software to small local print shops, freelance graphic designers, and boutique printing agencies.
- **Simplified Accounting:** These systems do not require complex Manufacturing (MRP) or BOM syncs. The primary goal is pure financial reconciliation—ensuring every dollar collected on the website matches the bank deposits.

## Integration Workflows

- **OAuth 2.0 Flow:** Both platforms strictly require OAuth 2.0. The Web-To-Print Admin Panel must provide a settings UI for the print shop owner to securely connect and authorize their QuickBooks/Xero account.
- **Daily Invoicing:** Push every completed Web-To-Print order as an `Invoice` (or `Sales Receipt` if paid immediately). 
- **Payment Reconciliation:** Push the successful payment gateway transaction (e.g., Stripe, PayPal) as a `Payment` applied against the generated Invoice. This automatically marks the invoice as Paid in QuickBooks/Xero, saving the accountant hours of manual data entry.
- **Tax Codes:** Ensure accurate mapping of the storefront's tax rates (e.g., standard vs zero-rated) to the respective Tax Codes inside QuickBooks/Xero.
