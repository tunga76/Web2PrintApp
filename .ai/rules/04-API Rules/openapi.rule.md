# OpenAPI (Swagger) Rules

## Core Principles

- **Documentation as Code:** All RESTful API endpoints MUST be documented using the OpenAPI Specification (OAS 3.0+).
- **Auto-Generation:** Generate OpenAPI from the Node.js API framework and request/response schemas when the selected tooling supports it. Keep the contract in source control and validate it in CI; avoid a drifting hand-maintained copy.

## Documentation Quality

- **Descriptions:** Every endpoint, parameter, and response property MUST have a meaningful description (`summary` and `description` fields).
- **Response Types:** Explicitly define all possible response types and status codes for an endpoint (including error responses like 400, 401, 404).
- **Examples:** Provide realistic examples for request bodies and response models to help consumers understand the expected payload format.

## Client Generation

- Design the API models so they produce clean, usable client SDKs when run through tools like NSwag or OpenAPI Generator. Avoid using dynamic types (`object`, `any`) in API contracts.
