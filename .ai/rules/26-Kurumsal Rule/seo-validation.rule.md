# SEO Validation Rules

## Core Principles

- **Automated Checks:** SEO is not just for marketers; developers must validate it. CI/CD pipelines should run automated checks (e.g., using Lighthouse CI) to ensure critical SEO tags are present.
- **Core Web Vitals:** The application must pass Google's Core Web Vitals assessment (LCP, FID/INP, CLS). A failure in Web Vitals is treated as a severe defect.

## Content Integrity

- **Duplicate Content:** Ensure canonical tags (`<link rel="canonical" href="..." />`) are perfectly generated, especially on product variation pages (e.g., different colors of the same item) to prevent index dilution.
- **Meta Tags:** Every page MUST have a unique `<title>` and `<meta name="description">`.
