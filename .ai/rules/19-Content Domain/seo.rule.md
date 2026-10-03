# SEO (Search Engine Optimization) Rules

## Core Principles

- **Metadata Primacy:** Every visible page (Product, Category, Blog, Static Page) MUST have customizable SEO metadata: `Title`, `Meta Description`, `Canonical URL`, and `Robots` directives.
- **Server-Side Rendering:** For Next.js, SEO metadata must be rendered on the server (using the App Router `metadata` API) so it is instantly available to search engine crawlers without executing JavaScript.

## Structured Data

- **JSON-LD:** Automatically generate and inject JSON-LD structured data on relevant pages.
  - Product Pages: `Product` schema (including price, availability, aggregate rating).
  - Breadcrumbs: `BreadcrumbList` schema.
  - Blog: `Article` or `BlogPosting` schema.

## Sitemaps & Feeds

- **Dynamic XML Sitemaps:** Generate `sitemap.xml` dynamically (or via frequent background jobs) to ensure newly added products and categories are immediately indexed. Support sitemap indexes if URLs exceed 50,000.
