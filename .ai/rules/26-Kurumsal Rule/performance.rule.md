# Performance Rules

## Core Principles

- **Time to Interactive (TTI):** The application must prioritize loading above-the-fold content first. JavaScript bundles must be split (Code Splitting) so the user only downloads the code necessary for the current page.
- **Asset Optimization:** All images must be served in modern formats (WebP/AVIF), appropriately sized for the user's device (using `srcset`), and lazy-loaded if below the fold.

## Backend / API

- **Response Times:** Define latency targets per endpoint class using a stated percentile (such as p95), production-like environment, and representative load. Use observed regressions to trigger review; 200ms and 500ms are examples, not universal merge gates.
- **Pagination & Throttling:** Never return unbounded lists from the API. Always use pagination or cursor-based fetching for lists (e.g., Order History, Products).
