# JWT (JSON Web Token) Rules

## Core Principles

- **Stateless Authentication:** Use JWTs primarily for stateless API authentication.
- **Short Lifetimes:** Access tokens (JWTs) must have short lifetimes (e.g., 5 to 15 minutes) to minimize the window of opportunity if a token is compromised.
- **Refresh Tokens:** Use opaque, long-lived Refresh Tokens to obtain new Access Tokens. Refresh tokens MUST be stored securely (e.g., HTTP-only, secure cookies) and must be revocable.

## Token Security

- **Signature Verification:** Always verify the JWT signature using the correct public key or shared secret. Ensure the `alg` header is restricted to expected algorithms (e.g., `RS256` or `HS256`) and explicitly reject the `none` algorithm.
- **Payload Contents:** Never store sensitive information (like passwords, SSNs, or detailed PII) in the JWT payload, as it is merely Base64Url encoded, not encrypted.
- **Audience & Issuer Validation:** Always validate the `iss` (Issuer) and `aud` (Audience) claims to ensure the token is intended for your specific API.

## Storage (Frontend)

- **Avoid LocalStorage:** Do not store JWTs in `localStorage` or `sessionStorage` where they are vulnerable to XSS attacks. Prefer `HttpOnly`, `Secure`, `SameSite` cookies for web applications.
