# API Versioning Rules

## Core Principles

- **Never Break Existing Clients:** Once an API endpoint is published and consumed by frontend applications, mobile apps, or external third-party integrations, its contract (request/response schema) MUST NOT change in a backward-incompatible way.
- **Explicit Versioning:** All public-facing REST APIs must be explicitly versioned from day one.

## Versioning Strategy

- **URL-Based Versioning (Preferred):** Use the URL path to define the API version. This is the most explicit and developer-friendly approach for REST APIs.
  - Example: `GET /api/v1/orders`
  - Example: `POST /api/v2/catalog/products`
- **Avoid Header Versioning:** While HTTP Header or Query Parameter versioning is possible, URL versioning is preferred for this project to maintain high visibility and ease of testing in browsers and API clients (like Postman or cURL).

## Dealing with Breaking Changes

- **Additive Changes are NOT Breaking:** Adding a new property to a response JSON or adding an optional query parameter does not require a new API version.
- **When to bump the version:**
  - Removing or renaming an existing field in the response payload.
  - Changing the data type of an existing field (e.g., from `int` to `string`).
  - Making a previously optional request parameter mandatory.
  - Changing the URL structure or HTTP Verb.

## Sunsetting and Deprecation

- **Deprecation Headers:** When a version (e.g., `v1`) is planned for removal, endpoints MUST start returning standard HTTP `Deprecation` and `Sunset` headers to warn consumers.
- **Grace Period:** Provide a sufficient grace period (e.g., 6 months) for external clients to migrate to the new version before physically removing the old controllers/endpoints from the codebase.
