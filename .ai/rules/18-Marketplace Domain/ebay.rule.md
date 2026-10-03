# eBay Integration Rules

## Core Principles

- **REST APIs:** Utilize the modern eBay REST APIs (Inventory, Fulfillment, Taxonomy) rather than the legacy XML/SOAP Trading APIs.
- **Business Policies:** Products cannot be listed without explicit links to eBay Business Policies (Payment, Return, and Fulfillment). The Hub must map internal settings to these policy IDs.

## Listings

- **Item Specifics:** eBay heavily relies on "Item Specifics" (Aspects) for search visibility. The integration must enforce the provision of mandatory aspects (e.g., Brand, MPN) based on the specific eBay category leaf ID.
- **Stock Control:** Use the "Out of Stock Control" feature. When inventory hits zero, the listing should be hidden rather than ended, preserving sales history and SEO ranking when restocked.
