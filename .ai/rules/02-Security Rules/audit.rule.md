# Audit & Logging Rules

## Core Principles

- **Accountability:** Maintain a comprehensive and immutable audit log for all security-relevant events and state changes within the system.
- **No Sensitive Data:** NEVER log sensitive information such as plain text passwords, credit card numbers (PANs), CVVs, or full PII. Mask or hash sensitive fields before logging.

## Required Audit Events

- **Authentication:** Log all successful and failed login attempts, password changes, password resets, and MFA enrollments/validations.
- **Authorization:** Log all access denied (403) errors.
- **Data Mutation:** Log all creation, modification, or deletion of critical entities (e.g., Orders, Users, Products, Price Lists, Configuration changes).
- **Admin Actions:** All actions performed by administrative users must be strictly audited.

## Log Anatomy

Every audit log entry must include:
- `Timestamp` (UTC)
- `Actor` (User ID, System Service name, or IP if anonymous)
- `Action` (e.g., "UPDATE_ORDER", "LOGIN_FAILED")
- `Resource` (e.g., Order ID, User ID)
- `Changes` (Before and After state, if applicable and non-sensitive)

## Storage and Retention

- Send logs to a centralized, secure log management system (e.g., ELK stack, Loki, Serilog sinks).
- Audit logs should be immutable and protected from tampering.
