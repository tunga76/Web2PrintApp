# Broken Link Rules

## Core Principles

- **Zero Tolerance:** Broken internal links (404s) severely damage both UX and SEO. The system must employ automated crawlers during the staging/deployment phase to detect dead links.
- **Soft Deletes & Redirects:** If a product or category is disabled/deleted, the system MUST NOT simply throw a 404. It must either return a "Product Discontinued" page (with related alternatives) or issue a 301 Permanent Redirect to the parent category.

## External Links

- Outbound links to external sites (e.g., social media, partner sites) should be audited periodically, but failing external links should not block a deployment.
