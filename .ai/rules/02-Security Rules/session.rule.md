# Session Management Rules

## Core Principles

- **Secure Cookies:** If using cookie-based sessions, mark session cookies `HttpOnly` and `Secure` in production. Choose `SameSite` (`Strict`, `Lax`, or narrowly scoped `None` with `Secure`) based on the authentication and cross-site navigation flow; document any cross-site requirement.
- **Session Identifiers:** Session IDs must be generated securely with sufficient entropy. Do not use predictable identifiers.

## Session Lifecycle

- **Session Invalidation:** Ensure sessions are completely invalidated on the server upon user logout.
- **Timeout & Expiration:** Implement absolute timeouts (e.g., session expires after 24 hours regardless of activity) and idle timeouts (e.g., session expires after 30 minutes of inactivity).
- **Re-authentication:** Require re-authentication (prompting for password again) before sensitive actions, such as changing account details, updating passwords, or high-value purchases.

## Concurrent Sessions

- **Session Tracking:** Track active sessions per user. Provide a UI for users to view and revoke active sessions on other devices.
- **Limit Concurrent Logins:** Depending on business requirements, limit the number of active sessions a single user account can have simultaneously.
