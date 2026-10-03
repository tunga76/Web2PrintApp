# Error Handling and Logging Rules

## Core Principles

- **Fail Fast, Log Richly:** Catch errors as early as possible. Always include context (Correlation ID, User ID) in logs.
- **Never Expose Internals:** Never leak stack traces or internal exception details to the client in production environments.

## Backend (Node.js)

- **Global Error Handling:** Handle unexpected errors in the framework's central error middleware/handler. Catch locally only when the operation can recover, add context, or translate a known failure.
- **Standardized API Responses:** Return a stable machine-readable error shape (prefer RFC 7807 Problem Details for HTTP APIs) without exposing stack traces or internal messages in production.
- **Structured Logging:** Use the project's selected structured logger and emit machine-readable production logs. Include correlation context while redacting credentials and sensitive customer/payment data.
- **Domain Errors:** Represent expected business rejections explicitly (for example, unavailable stock or invalid coupon) and map them to appropriate API responses at the application/HTTP boundary.

## Frontend (Next.js)

- **Error Boundaries:** Use Next.js `error.tsx` and React Error Boundaries to catch rendering errors and prevent white screens of death.
- **API Error Interception:** Use an Axios interceptor or a custom fetch wrapper to handle API error responses centrally (e.g., showing a toast notification for 500s, or redirecting to login on 401s).
- **Client-Side Logging:** Avoid logging sensitive PII (Personally Identifiable Information) in client-side analytics or error trackers.
