# Product Attribute Rules

## Core Principles

- **Flexibility (EAV vs JSONB):** E-commerce products have widely varying attributes (e.g., Screen Size for a TV vs. Fabric for a Shirt). 
  - Prefer using document-like structures (e.g., `JSONB` in PostgreSQL) for storing arbitrary product attributes for high performance.
  - Avoid strict Entity-Attribute-Value (EAV) relational models if possible, as they lead to severe performance degradation at scale due to complex JOINs.

## Attribute Types

- **Filterable vs Display-Only:** Distinguish between attributes that are used for faceted search (Filterable) and attributes that are purely informational (Display-Only). Filterable attributes must be pushed to the Search Index.
- **Variant-Defining Options:** Distinguish generic attributes from "Options" (like Size, Color) which are used to generate specific Product Variants.

## Management

- **Attribute Groups / Families:** Group attributes logically (e.g., "Technical Specs", "Dimensions") to make UI data entry and storefront display manageable.
