# OWASP Top 10 Mitigation Rules

## Core Principles

- The application must actively defend against the OWASP Top 10 vulnerabilities. Security testing should be integrated into the CI/CD pipeline.

## Specific Mitigations

- **Broken Access Control:** Enforce strict authorization checks on every request. Prevent IDOR. Deny by default.
- **Cryptographic Failures:** Encrypt data at rest and in transit. Use strong hashing for passwords. Avoid deprecated algorithms (e.g., MD5, SHA-1).
- **Injection:** Use parameterized queries or safe APIs from the selected Node.js data-access library to prevent SQL injection. Validate untrusted input at the boundary and encode output for its context. Do not evaluate untrusted code (e.g., `eval()`).
- **Insecure Design:** Employ threat modeling during the design phase. Implement secure architecture patterns.
- **Security Misconfiguration:** Automate environment hardening. Remove unused features and default accounts. Ensure proper cloud permissions.
- **Vulnerable and Outdated Components:** Regularly scan dependencies for known vulnerabilities (e.g., using `npm audit`, `dotnet list package --vulnerable`, Snyk) and keep them updated.
- **Identification and Authentication Failures:** Implement robust session management, MFA, and secure password recovery.
- **Software and Data Integrity Failures:** Verify the integrity of CI/CD pipelines. Use signed commits and verify artifact signatures.
- **Security Logging and Monitoring Failures:** Implement comprehensive audit logging (see `audit.rule.md`). Setup alerts for suspicious activities (e.g., credential stuffing).
- **Server-Side Request Forgery (SSRF):** If the application fetches remote resources based on user input, strictly validate the URL against an allowlist and restrict access to internal network metadata services.
