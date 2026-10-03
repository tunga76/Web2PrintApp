# Amazon Integration Rules

## Core Principles

- **SP-API Compliance:** Use the Amazon Selling Partner API (SP-API). Fully comply with Amazon's strict Data Protection Policy (DPP) regarding the handling and retention of Personally Identifiable Information (PII).
- **ASIN Matching:** Products must be matched to Amazon Standard Identification Numbers (ASINs) using EAN/UPC barcodes.

## Inventory & Orders

- **Inventory Throttling:** Amazon heavily throttles API requests. Implement robust rate limiting and batching (using Feeds API for bulk updates) for inventory and price syncs.
- **FBA vs FBM:** The integration must distinguish between Fulfillment by Amazon (FBA) orders (where Amazon handles inventory and shipping, Hub just imports for accounting) and Fulfillment by Merchant (FBM) orders (where the Hub must decrement local inventory and push tracking info back to Amazon).
