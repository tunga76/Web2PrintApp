# Odoo ERP Integration Rules

## Core Principles

- **Open Source Flexibility:** Odoo is incredibly popular globally due to its open-source nature and modularity. It is widely used by agile printing companies and modern manufacturers.
- **XML-RPC / REST:** Odoo natively uses XML-RPC for external communication. Ensure a robust XML-RPC client is used to communicate with Odoo instances safely.

## Manufacturing & Inventory (MRP) Sync

- **BOM Syncing (Reçete):** Unlike traditional ERPs where you just sync invoices, Odoo has a powerful Manufacturing (MRP) module. If the Web-To-Print system calculates a Bill of Materials (e.g., 50 sheets of A3 paper), this data should be passed to Odoo to trigger a `Manufacturing Order` (MO).
- **Stock Decrement:** When the Odoo MO is completed by the factory, Odoo will automatically decrement the raw materials. The Web-To-Print system must listen to Odoo's stock updates via Webhooks/Cron to mark raw materials as out-of-stock on the frontend.
- **Invoicing:** Push completed online orders as `Draft Invoices` in Odoo's Accounting module for the financial team to validate and post.
