# RESTful API Rules

## Core Principles

- **Resource-Oriented:** APIs must be designed around Resources (nouns) rather than Actions (verbs). Example: `POST /orders` instead of `POST /createOrder`.
- **Standard HTTP Methods:** Strictly adhere to standard HTTP methods: 
  - `GET` for reading (idempotent, safe).
  - `POST` for creating.
  - `PUT` for complete replacement (idempotent).
  - `PATCH` for partial updates.
  - `DELETE` for removal (idempotent).
- **HTTP Status Codes:** Use the correct HTTP status codes to indicate the result of a request (e.g., `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`).

## Versioning

- **Mandatory Versioning:** All APIs must be versioned from day one.
- **Header or URL:** Prefer versioning via the URL (e.g., `/api/v1/products`) for simplicity and explicit routing, or via HTTP headers (`Accept: application/vnd.company.v1+json`) if strict REST compliance is desired. Do not break existing API versions.

## Error Responses

- **Standardized Format:** Use a standardized error format (like Problem Details for HTTP APIs - RFC 7807) across all endpoints. Ensure error payloads include a `type`, `title`, `status`, and `detail`.
