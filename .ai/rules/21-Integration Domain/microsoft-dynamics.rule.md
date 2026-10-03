# Microsoft Dynamics 365 (Business Central) Integration Rules

## Core Principles

- **Enterprise Targeting:** Microsoft Dynamics 365 (formerly Navision) is a staple for mid-to-large enterprises in Europe and North America. This integration is critical for selling the Web-To-Print platform to established corporate printers.
- **API First:** Always use the modern Microsoft Graph API or the Business Central OData V4/REST APIs for integration, avoiding deprecated SOAP endpoints.

## Order and Financial Sync

- **Customer Sync (Accounts):** B2B customers in the Web-To-Print platform must be mapped to `Customers` in Dynamics. Bi-directional sync is recommended so that if the accounting team updates a customer's B2B credit limit directly in Dynamics, it reflects on the storefront instantly.
- **Sales Order Creation:** Once a Web-To-Print order is paid (or approved via B2B credit), push it to Dynamics as a `Sales Order`. 
- **Invoicing:** When the order is shipped, Dynamics typically generates the final `Sales Invoice`. The integration should pull the PDF invoice back from Dynamics (if possible) and display it in the customer's web portal.
