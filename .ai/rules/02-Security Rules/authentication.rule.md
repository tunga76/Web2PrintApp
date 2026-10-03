# Authentication Rules

## Core Principles

- **Strong Passwords:** Enforce strong password policies (minimum length, complexity). Passwords must be hashed using strong, slow algorithms (e.g., Argon2id, bcrypt, PBKDF2) with a unique salt per user. NEVER store plain text passwords.
- **Multi-Factor Authentication (MFA):** Support and strongly encourage (or mandate for administrative roles) MFA using TOTP or hardware tokens.
- **Identity Implementation:** Use a maintained authentication library or identity provider compatible with the selected Node.js backend and Next.js frontend. Prefer standards-based OIDC/OAuth integrations where external identity is required; do not implement cryptographic protocols yourself.

## Authentication Flows

- **Account Lockout:** Implement account lockout mechanisms after a predefined number of failed login attempts to prevent brute-force attacks.
- **Password Reset:** Implement secure password reset flows using time-bound, single-use tokens sent via email. Do not indicate whether an email exists in the system during the reset process (prevent user enumeration).

## Third-Party Identity

- **OAuth2 / OIDC:** When integrating with third-party identity providers (e.g., Google, Microsoft), strictly follow OAuth 2.0 and OpenID Connect specifications. Validate state parameters to prevent CSRF.
