# Configuration Rules

## Core Principles

- **Environment Separation:** Application configuration must vary safely across environments (Development, Staging, Production) without code changes.
- **No Secrets in Config:** Never store passwords, API keys, or sensitive credentials in standard configuration files. Use a Secret Manager instead (see `secrets.rule.md`).

## Implementation

- **Environment Variables:** Use environment variables as the primary mechanism for overriding configuration settings in deployed environments (Docker/Kubernetes).
- **Typed and Validated Configuration:** Parse environment/configuration values into a typed configuration object and validate required values at startup. Fail fast with a safe diagnostic that names the missing setting without printing its secret value.

## Dynamic Configuration

- Reload non-critical settings only when the selected configuration source supports it safely and the setting's consistency requirements allow it.
