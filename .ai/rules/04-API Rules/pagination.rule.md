# API Pagination Rules

## Core Principles

- **Mandatory Pagination:** Any endpoint that returns a list or collection of resources MUST be paginated. Never return unbounded collections.
- **Default Limits:** Define a bounded default and maximum page size based on payload size and expected service capacity. Example values (`20`, `100`, or `500`) must be tuned to the endpoint.

## Pagination Methods

- **Offset Pagination (Limit/Offset):** 
  - Standard method using `page` (or `offset`) and `pageSize` (or `limit`) query parameters.
  - Useful for traditional paginated grids where the user can jump to specific pages.
  - Drawbacks: Can be slow on very large tables (deep paging).
- **Cursor Pagination (Keyset):**
  - Consider for large or frequently changing datasets and infinite scrolling.
  - Use a cursor based on a stable, deterministic ordering; include a unique tie-breaker when the primary sort field is not unique.

## Response Format

- Paginated responses should include metadata appropriate to the method. Cursor responses need not calculate an expensive total count or page count.
  ```json
  {
    "data": [ ... ],
    "meta": {
      "totalRecords": 1500,
      "currentPage": 1,
      "pageSize": 20,
      "totalPages": 75,
      "hasNextPage": true
    }
  }
  ```
