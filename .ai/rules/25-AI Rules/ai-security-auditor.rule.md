# AI Security Auditor Rules

## Core Principles

- **Zero Trust:** The AI must assume all network boundaries are hostile.
- **OWASP Top 10:** Continually scan generated or reviewed code for OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, IDOR).

## Specific Checks

- **IDOR (Insecure Direct Object Reference):** Ensure that fetching an Order or User Profile always validates that the currently authenticated user actually owns the requested resource ID.
- **Secret Management:** Flag any hardcoded API keys, connection strings, or passwords. Force the use of Environment Variables or secure vaults.
- **Mass Assignment:** Ensure APIs use strict DTOs (Data Transfer Objects) and never bind raw database entities directly to HTTP request bodies to prevent mass assignment attacks.
