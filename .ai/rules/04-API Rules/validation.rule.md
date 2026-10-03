# API Validation Rules

## Core Principles

- **Never Trust Client Input:** All incoming data (Headers, Route Parameters, Query Strings, Request Bodies) MUST be strictly validated before being processed by the application layer.
- **Fail Fast:** Validation should happen at the outermost edge of the API (e.g., inside the Controller or via Middleware/Filters). Return a `400 Bad Request` immediately upon the first validation failure, preferably with a list of all errors.

## Implementation

- **Backend (Node.js):** Validate route, query, header, and body input at the HTTP boundary using the project's selected runtime schema/validation library (for example, Zod, Joi, or a framework-integrated validator). Do not rely on TypeScript types alone for runtime validation.
- **Frontend / Fullstack (Next.js/TypeScript):** Use Zod or Yup for schema validation. In Server Actions or Route Handlers, always parse the input against a Zod schema before proceeding.

## Error Messages

- Validation error messages should be clear, localized, and specific about which field failed and why (e.g., "Email is required and must be a valid format"). Do not expose internal database column names.
