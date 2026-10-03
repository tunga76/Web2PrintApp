# Oracle NetSuite Integration Rules

## Core Principles

- **Global Mid-Market Standard:** NetSuite is heavily adopted by high-growth B2B and e-commerce companies globally (especially in the US). A seamless NetSuite integration proves the Web-to-Print platform is enterprise-ready.
- **SuiteTalk API:** Use the SuiteTalk REST Web Services. Ensure authentication uses OAuth 2.0 (or Token Based Authentication - TBA), as basic authentication is heavily restricted and insecure.

## Data Mapping & Syncing

- **Custom Records for Print Data:** Standard e-commerce sends simple SKUs to the ERP. For Web-To-Print, you must map print-specific attributes (e.g., Paper Type, Finish, Dimensions) into NetSuite Custom Records or Custom Item Fields so the procurement teams can analyze material costs accurately.
- **Order Fulfillment:** Push the Web-to-Print order to NetSuite as a `Sales Order`. When the factory ships the product, update the NetSuite Sales Order to `Fulfilled` (Item Fulfillment), which triggers the financial billing workflow inside NetSuite.
- **Tax Compliance:** NetSuite handles complex global tax rules (SuiteTax). Pass the cart's exact tax calculations clearly to avoid rounding discrepancies (Penny-Off errors).
