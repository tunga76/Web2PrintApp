# Data Privacy and Compliance Rules (KVKK / GDPR)

## Core Principles

- **Data Minimization:** Only collect and store personal data that is absolutely necessary for the order and fulfillment process.
- **Compliance:** Ensure all data handling complies with global privacy standards (GDPR) and local laws (KVKK).

## Encryption and Masking

- **Encryption at Rest:** Sensitive PII (Personally Identifiable Information) such as National IDs, precise financial data, or sensitive user profiles must be encrypted in the database.
- **Encryption in Transit:** All data must be transmitted over HTTPS/TLS 1.2+. No exceptions.
- **Data Masking in Logs:** Never log plain-text passwords, credit card numbers, authorization tokens, or sensitive user data. Always mask or redact this information before passing it to structured logging or external observability tools.

## Right to be Forgotten (Anonymization)

- **Soft Deletes & Anonymization:** When a user requests account deletion, use soft deletes (e.g., `IsDeleted = true`) to maintain relational integrity (for past orders/invoices), but permanently anonymize their PII (e.g., change Name to "Deleted User", scramble address).
- **Data Retention:** Implement automated background jobs to purge or anonymize data that exceeds the legal retention period.

## Frontend Display

- **Masking on UI:** Mask sensitive data when displaying it back to the user (e.g., showing only the last 4 digits of a saved credit card, masking parts of the phone number or email address) unless they pass a step-up authentication.
