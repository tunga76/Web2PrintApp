# AI Performance Review Rules

## Core Principles

- **N+1 Queries:** Identify N+1 query patterns in the selected Node.js database client/ORM and suggest a measured fix such as batching, joins, or explicit projections.
- **Caching:** Suggest aggressive caching strategies (Redis, In-Memory) for frequently read, rarely modified data (e.g., Categories, Navigation menus, static Product attributes).

## Frontend Optimization

- **Bundle Size:** Warn if a heavy dependency (e.g., Moment.js) is imported when a lighter alternative exists, or if a component isn't lazy-loaded where it should be.
- **Re-renders:** For React/Next.js code, identify unnecessary re-renders and suggest `useMemo`, `useCallback`, or better state placement to ensure smooth 60fps performance on mobile.
