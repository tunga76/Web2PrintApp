# Blog Rules

## Core Principles

- **SEO Driver:** The blog is a primary driver for organic traffic (SEO). Blog architecture must prioritize fast loading speeds, clean semantic HTML, and proper schema markup (Article schema).
- **Static Generation:** In Next.js, blog posts should almost always be statically generated (SSG or ISR) rather than server-side rendered (SSR) on every request, as content changes infrequently.

## Authoring and Relationships

- **Authors and Tags:** Support linking blog posts to specific Authors (for E-E-A-T signals in SEO) and Taxonomies (Categories/Tags) for internal linking.
- **Product Linking:** Enable seamless embedding of Catalog Products directly into blog content (e.g., "Top 10 Laptops" post) to drive direct conversions.
