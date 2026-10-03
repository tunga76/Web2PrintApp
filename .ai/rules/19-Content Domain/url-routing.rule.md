# URL Routing Rules

## Core Principles

- **Semantic & Clean:** URLs must be readable by humans and search engines. Avoid exposing internal IDs or meaningless query parameters in the primary path (e.g., prefer `/electronics/laptops/macbook-pro` over `/category/12/product/455`).
- **Immutability & Redirects:** Once a URL is indexed, it should not change. If a product or category slug is changed, the system MUST automatically create a `301 Permanent Redirect` from the old URL to the new URL to preserve SEO equity.

## Dynamic Routing Resolution

- In a Next.js frontend, use a Catch-All Route (e.g., `[[...slug]]/page.tsx`) or a dedicated router service to resolve whether a slug belongs to a Category, a Product, or a CMS Page, allowing for clean, flat URL structures (e.g., `example.com/my-product` instead of `example.com/p/my-product`).
