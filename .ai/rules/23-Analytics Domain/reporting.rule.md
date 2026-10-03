# Reporting Rules

## Core Principles

- **Separation of Read and Write:** Do not run heavy analytical reports directly against the primary transactional database (OLTP). This can lock tables and crash the live e-commerce site.
- **Read Replicas:** At a minimum, point administrative reporting queries to a Read Replica of the database. For enterprise systems, stream data via ETL processes to an OLAP (Online Analytical Processing) database designed for reporting.

## Key Metrics

- The reporting domain must be able to calculate and expose core e-commerce KPIs reliably:
  - **CAC:** Customer Acquisition Cost.
  - **LTV (or CLV):** Customer Lifetime Value.
  - **AOV:** Average Order Value.
  - **Conversion Rate:** Orders / Unique Visitors.
  - **Churn Rate:** Percentage of customers who stop buying over a given period.
