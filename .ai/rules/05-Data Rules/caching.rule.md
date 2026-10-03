# Caching Rules

## Core Principles

- **Performance vs Freshness:** Use caching to reduce database load and improve response times for read-heavy, relatively static data (e.g., Catalog, Categories, global Settings).
- **Cache Invalidation:** The hardest problem in caching. Every cached item MUST have a clear invalidation strategy (Time-to-Live (TTL), Event-based eviction, or Key generation based on data versions).

## Cache Tiers

- **In-Memory (L1):** Use local memory cache for extremely frequently accessed, rarely changing data. Be aware of memory limits and cluster synchronization issues.
- **Distributed (L2):** Use a distributed cache (e.g., Redis) as the primary caching layer so that all instances of the application share the same cache state.

## Implementation Patterns

- **Cache-Aside:** The most common pattern. The application checks the cache; if a miss occurs, it fetches from the DB, puts it in the cache, and returns it.
- **Stampede Prevention:** Implement locking mechanisms (e.g., Redlock or Double-Checked Locking) to prevent "Cache Stampedes" where multiple threads try to rebuild an expired cache key simultaneously, overwhelming the database.
