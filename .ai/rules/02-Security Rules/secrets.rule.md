# Secrets Management Rules

## Core Principles

- **No Hardcoded Secrets:** NEVER hardcode secrets (API keys, connection strings, private keys, passwords) in source code or configuration files committed to source control.
- **Separation of Environments:** Use different secrets for Development, Staging, and Production environments.

## Storage & Injection

- **Secret Vaults:** Use dedicated secret management systems (e.g., HashiCorp Vault, Azure Key Vault, AWS Secrets Manager, or Kubernetes Secrets) to store and retrieve sensitive configuration.
- **Environment Variables:** Inject secrets into the application at runtime via environment variables or secure configuration providers.

## Lifecycle

- **Rotation:** Regularly rotate secrets, especially database passwords and third-party API keys. Design the application to handle secret rotation gracefully (e.g., supporting multiple active keys during a transition period).
- **Least Privilege Access:** Only the specific services that require a secret should have permission to read it from the vault.
