# Brand Rules

## Core Principles

- **Global Entity:** Brands are distinct global entities, separate from categories. A product typically belongs to exactly one Brand.
- **Normalization:** Brand information (Name, Logo, Description) must be stored in a dedicated `Brands` table. Products should store a `BrandId`, not a plain string, to ensure consistency.

## Pages and SEO

- **Brand Landing Pages:** The system must support dedicated landing pages for brands (e.g., `/brand/nike`), aggregating all active products for that brand.
- **Slugs:** Brands must have unique, URL-friendly Slugs.

## Integration

- **Search Facets:** Brand is a primary filtering facet in e-commerce search. Ensure `BrandId` and `BrandName` are indexed efficiently in the search engine (e.g., Elasticsearch).
