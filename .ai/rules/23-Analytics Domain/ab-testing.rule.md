# A/B Testing Rules

## Core Principles

- **Statistical Significance:** A/B tests (or multivariate tests) must be designed to run until statistical significance is reached. Avoid prematurely declaring a winning variant based on short-term noise.
- **Performance Impact:** A/B testing tools must not negatively impact Core Web Vitals (specifically LCP and CLS).

## Implementation Strategy

- **Edge Computing (Preferred):** Use Edge Middleware (e.g., Next.js Middleware on Vercel/Cloudflare) to route users to Variant A or Variant B before the page renders. This eliminates the "flicker" effect common with client-side A/B testing scripts (like Google Optimize or VWO).
- **Consistent Bucketing:** A user assigned to Variant B must consistently see Variant B across their entire session and subsequent visits. Use persistent cookies or server-side user profiles to store the bucketing assignment.
