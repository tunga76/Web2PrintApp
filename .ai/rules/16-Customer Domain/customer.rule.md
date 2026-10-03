# Customer Rules

## Core Principles

- **Identity vs Profile:** Distinguish between the Identity concept (handled by the Security Domain/Authentication, focusing on credentials, passwords, MFA) and the Customer Profile (focusing on names, birthdates, preferences, and e-commerce data).
- **Guest vs Registered:** The system must seamlessly support both guest customers (identified by an email or session ID) and registered customers.

## Data Privacy & GDPR/CCPA

- **PII Protection:** Personally Identifiable Information (PII) must be strictly controlled, encrypted at rest where required, and never logged in plain text.
- **Right to be Forgotten:** Provide automated or documented workflows for deleting or completely anonymizing a customer record upon request. If a customer is anonymized, historical orders must remain intact but stripped of PII.
