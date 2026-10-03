# API Filtering Rules

## Core Principles

- **Flexible Retrieval:** Allow clients to filter collections to retrieve exactly the data they need, reducing over-fetching.
- **Standardized Query Strings:** Pass simple filters as query parameters: `?status=Active&category=Electronics`.

## Complex Filtering

- For more complex filtering (e.g., greater than, less than, multiple values, OR conditions):
  - **Bracket Notation:** `?price[gte]=100&price[lte]=500`
  - **Comma Separation (IN clause):** `?status=Pending,Shipped`
  - **Search Parameter:** Provide a generic `?q=` parameter for full-text search queries across multiple indexed fields.

## Security and Limits

- **Whitelist Allowed Filters:** Similar to sorting, strictly validate which fields can be filtered to prevent arbitrary database queries that could lead to DoS.
- **Maximum Complexity:** Limit the complexity of filters (e.g., maximum number of `IN` array elements) to prevent excessive database strain.
