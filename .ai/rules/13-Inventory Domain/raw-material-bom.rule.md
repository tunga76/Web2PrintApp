# Raw Material and BOM (Bill of Materials) Rules (Web-To-Print)

## Core Principles

- **Virtual Finished Goods:** In the web-to-print industry, finished products (e.g., "Custom Coffee Mug with Logo" or "500 Business Cards") do not physically exist in the warehouse until printed. Therefore, finished goods should have "Virtual" or "Calculated" stock, bounded only by their underlying raw materials.
- **Raw Material Tracking:** Inventory tracking must strictly be performed at the Raw Material level (e.g., "Blank White Mug", "350g SRA3 Coated Paper Sheet", "DTF Film Roll").

## Bill of Materials (BOM / Reçete)

- **BOM Mapping:** Every customizable product must have a defined Bill of Materials (BOM) linking it to one or more Raw Material SKUs.
  - *Example:* 1000 Business Cards = 50 Sheets of `RAW-PAPER-350G-SRA3` + 1 Unit of `MATTE-LAMINATION-FILM`.
- **Dynamic BOM:** The BOM must be dynamically calculable based on the Print Options selected by the customer in the Pricing/Catalog phase (e.g., if the user selects "Glossy" instead of "Matte", the BOM deducts glossy film instead).

## Stock Deduction Triggers

- **Production-Linked Deduction:** Raw materials MUST NOT be deducted when the order is simply "Paid" or "Placed", because the order might be canceled or the artwork might be rejected during the Pre-Flight check.
- **Trigger Event:** The actual inventory deduction (Stock Adjustment) of raw materials must occur exactly when the Order Line Item status changes to `InProduction` (or when explicitly scanned/allocated by the operator on the factory floor).

## Stock Availability & Display

- **Frontend Stock Status:** The frontend should display "In Stock" for a custom product ONLY IF all required raw materials in its BOM have an `AvailableQuantity` greater than zero (or greater than the required calculation).
- **Auto Out-of-Stock:** If a specific raw material (e.g., "Blank Red XL T-Shirt") runs out of stock in the warehouse, the system must automatically mark all dependent finished products/variants on the storefront as "Out of Stock" or "Pre-Order".
