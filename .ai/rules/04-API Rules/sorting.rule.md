# API Sorting Rules

## Core Principles

- **Explicit Sorting:** Endpoints returning collections should allow clients to specify the sort order to avoid relying on implicit database sorting.
- **Standardized Parameters:** Use a standardized query parameter format for sorting, typically `?sort=fieldname` or `?orderBy=fieldname`.

## Direction

- Indicate sort direction clearly. Common patterns:
  - Prefixing with a minus sign for descending: `?sort=-price` (descending), `?sort=price` (ascending).
  - Explicit direction parameter: `?sort=price:desc` or `?sortBy=price&sortDir=desc`.

## Security and Performance

- **Whitelist Fields:** Never map the user's `sort` parameter directly to an SQL `ORDER BY` clause without validation. Maintain a strict whitelist of fields that are allowed to be sorted.
- **Database Indexes:** Ensure that the fields allowed for sorting have corresponding indexes in the database to prevent performance degradation on large datasets.
