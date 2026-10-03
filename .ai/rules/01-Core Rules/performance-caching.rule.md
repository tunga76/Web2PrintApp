# Performance and Caching Rules

## Core Principles

- **Performance is a Feature:** E-commerce platforms rely on speed for conversion. Every feature must be designed with performance and scalability in mind.
- **Caching Strategy:** Cache aggressively but invalidate intelligently.

## Backend and Database

- **Query Performance:** Avoid N+1 queries and select only required fields. Use capabilities of the selected Node.js query builder/ORM when measurement shows a benefit.
- **Caching:** Add local or distributed caching only when measured latency or load justifies it. Define cache ownership, tenant scoping where applicable, TTL, invalidation, and safe behavior when the cache is unavailable.
- **Pagination:** Any API endpoint that returns a collection MUST implement pagination (Limit/Offset or Cursor-based). Never return unbound lists.
- **Asynchronous Processing:** Offload work that exceeds the request/response budget or needs durable retries to a background worker/queue selected for the deployment.

## Frontend

- **Rendering and Caching:** Choose server rendering, static generation, or client rendering based on freshness, personalization, and the frontend framework in use. Do not cache tenant- or user-specific output in a shared cache without a safe key and invalidation strategy.
- **Image Optimization:** Use the image optimization path supported by the deployed framework or CDN, while preserving correct dimensions, accessibility text, and output quality.
- **Bundle Size:** Keep client-side JavaScript focused; defer large optional modules using the framework's supported lazy-loading mechanism.
- **Core Web Vitals:** Measure user-facing pages in a documented environment and improve regressions against the team's agreed targets.
