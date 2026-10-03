# Marketplace Integration Rules

## Core Principles

- **Scope and Verification:** Provider behavior depends on the active API version, seller account capabilities, and contract. Verify implementation against current official provider documentation and record its URL and verification date in the integration decision. Treat unverified examples as guidance, not a hard requirement.

- **Hub and Spoke:** The core e-commerce platform is the Hub (Master). Marketplaces (Amazon, Trendyol, etc.) are the Spokes. The Hub is the single source of truth for Catalog and Inventory.
- **Asynchronous Operations:** Use background processing for marketplace operations that need retries, rate-limit handling, or isolation from provider latency. Select the queue/worker technology for the Node.js deployment; do not require a broker for every lightweight interaction.

## Data Mapping

- **Unified Model:** Maintain a unified internal data model. Create specific "Mapping Layers" (Adapters) for each marketplace to translate internal entities (Products, Orders, Statuses) to the external marketplace formats.
- **Channel Specific Overrides:** Allow business users to override specific fields per marketplace (e.g., a different product Title or Price for Amazon vs. the main storefront).
