# Logging Rules

## Core Principles

- **Structured Logging:** Never log raw text strings (e.g., `Log.Info("Order 123 created by user 456")`). Use Structured Logging (JSON format) so logs can be easily queried in systems like Elasticsearch/Kibana or Loki (e.g., `Log.Info("Order created", new { OrderId = 123, UserId = 456 })`).
- **Contextual Enrichment:** Every log entry MUST automatically include the `CorrelationId` (to trace the entire HTTP request lifecycle), `UserId` (if authenticated), and `TenantId` (if multi-tenant).

## Security

- **PII Scrubbing:** NEVER log Personally Identifiable Information (Passwords, Credit Card Numbers, full SSNs). Use automated scrubbers to mask this data before it reaches the logging sink.
- **Levels:** Use appropriate log levels (`Trace`, `Debug`, `Information`, `Warning`, `Error`, `Fatal`). Production environments should generally only log `Information` and above to save storage costs.
