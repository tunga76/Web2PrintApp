# General Security Rules

## Core Principles

- **Secure by Default:** All systems must be designed to be secure out-of-the-box. Access should be denied by default.
- **Defense in Depth:** Do not rely on a single layer of security. Implement security controls at the network, application, and data layers.
- **Zero Trust Architecture:** Never trust any input or request, regardless of whether it originates from inside or outside the network perimeter. Always verify identity and access rights.

## Data Protection

- **Encryption at Rest:** Protect sensitive data at rest using the approved storage and key-management controls for the deployment. Do not store passwords reversibly; hash them with an approved password-hashing scheme. Payment data handling must follow the provider and applicable compliance requirements. Example algorithms are guidance, not a substitute for key-management requirements.
- **Encryption in Transit:** All communication between services and clients must be encrypted using TLS 1.2 or higher. No plaintext HTTP traffic is allowed.

## Error Handling & Information Disclosure

- **Generic Error Messages:** Never expose stack traces, database queries, or internal system states to the user. Always return generic error messages (e.g., "An unexpected error occurred").
- **Secure Headers:** Ensure all HTTP responses include secure headers (e.g., `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`).
