# Landing Page Rules

## Core Principles

- **Marketing Focused:** Landing pages are designed for specific marketing campaigns or product launches. They often bypass the standard site layout (hiding global navigation/footers) to maximize conversion rates.
- **Page Builder / Blocks:** The CMS should provide a "Block Builder" or component-based approach, allowing marketing teams to construct landing pages by stacking pre-defined, React-backed UI components without developer intervention.

## Performance

- **Zero Layout Shift:** Landing pages must be highly optimized for Core Web Vitals, specifically Cumulative Layout Shift (CLS), as they are often the first touchpoint from paid ads.
- **A/B Testing:** Design the architecture to support A/B testing of different landing page variants (e.g., using Edge Middleware in Next.js to route traffic).
