# Product Image Rules

## Core Principles

- **CDN Delivery:** Images MUST NOT be served directly from the application server. They must be uploaded to object storage (e.g., AWS S3, Azure Blob) and served via a Content Delivery Network (CDN).
- **Responsive Formats:** Automatically generate and serve responsive image sizes (thumbnails, medium, large) and modern formats (WebP, AVIF) to optimize frontend Core Web Vitals.

## Organization

- **Sort Order:** Images must have a `DisplayOrder` property. The image with the lowest order (usually `0` or `1`) acts as the Primary Image.
- **Alt Text:** Every image MUST require an `AltText` field for accessibility (a11y) and SEO purposes.

## Variant Images

- Images can be assigned to the base `Product` or specific `Variants` (e.g., selecting the "Red" variant should show the red product images).
