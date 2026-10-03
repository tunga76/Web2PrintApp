# Category Rules

## Core Principles

- **Hierarchical Structure:** Categories must support a hierarchical tree structure (Parent-Child relationships). The depth should ideally be limited (e.g., max 3 or 4 levels) to maintain manageable UI navigation.
- **Multiple Assignments:** A product can belong to multiple categories. Distinguish between a "Primary Category" (used for breadcrumbs and core reporting) and "Secondary Categories" (used for discoverability).

## URLs and SEO

- **Slugs:** Every category must have a unique, URL-friendly Slug. The slug should be immutable once published to prevent breaking external links, or require automatic 301 redirects if changed.
- **SEO Metadata:** Categories must support SEO metadata fields (Title Tag, Meta Description) distinct from their display name and description.

## Visibility

- **Active Status:** Categories must have an `IsActive` flag. Inactive categories should cascade to hide their assigned products from catalog browsing (though direct links to products might still work depending on business logic).
