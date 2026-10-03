# Nebim V3 Integration Rules

## Core Principles

- **Retail Focus:** Nebim V3 is heavily optimized for retail and apparel. It utilizes a "Color-Size" (Renk-Beden) matrix. The E-commerce platform must map its Variant architecture (e.g., `ProductId` + `Option1` + `Option2`) directly to Nebim's `ItemCode` + `ColorCode` + `ItemDim1Code` (Size).
- **Nebim Integrator:** Integrations should run exclusively through the "Nebim V3 Integrator" API service (REST/JSON) to ensure all retail rules (campaigns, loyalty points) are respected.

## Omni-Channel Features

- **Click & Collect:** Nebim manages store-level inventory flawlessly. The integration must be able to query specific Store Inventories (Mağaza Envanteri) via the Integrator API to offer "Pick up in store" functionality on the storefront.
- **Returns:** Web returns must be mapped to specific Nebim "Return Order" types so that retail store staff can process a web-purchased return seamlessly at a physical cash register (POS).
