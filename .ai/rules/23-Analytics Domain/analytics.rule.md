# Analytics Rules

## Core Principles

- **Data Ownership:** While third-party tools (Google Analytics, Mixpanel) are essential for marketing, the core e-commerce platform MUST maintain its own source of truth for critical financial and operational metrics (e.g., Gross Merchandise Value - GMV, Total Orders). Never rely exclusively on client-side tracking for financial reporting due to ad-blockers and privacy features (like Apple ITP).
- **Privacy by Design:** Ensure all analytics implementations comply with GDPR/CCPA. Do not send PII (Personally Identifiable Information like email addresses, plain text names) to third-party analytics tools unless strictly hashed (e.g., SHA-256 for Facebook Conversions API).

## Architecture

- **Data Warehousing:** For enterprise scale, raw domain events should be piped into a Data Warehouse (e.g., Google BigQuery, Snowflake, Amazon Redshift) rather than running heavy analytical queries directly against the transactional SQL database.
