# Rate Limiting & Throttling Rules

## Core Principles

- **Availability Protection:** Apply rate limits to externally reachable endpoints according to exposure, cost, and abuse risk. Internal health checks, trusted callbacks, and batch interfaces may need separate controls rather than the same per-client limit.
- **Tiered Limits:** Apply different rate limits based on the endpoint's cost and sensitivity. For example, login endpoints or password reset endpoints must have much stricter rate limits than public product catalog searches.

## Implementation

- **Distributed Caching:** Use a distributed cache like Redis to track request counts across multiple server instances to ensure accurate rate limiting.
- **Identifier:** Rate limit based on IP address for anonymous traffic, and based on User ID (or Tenant ID) for authenticated traffic.

## Client Communication

- **HTTP Status Codes:** When a rate limit is exceeded, return a `429 Too Many Requests` status code.
- **Headers:** Include informative headers in the response (e.g., `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` or standard `Retry-After`) so well-behaved clients can throttle their own requests.
