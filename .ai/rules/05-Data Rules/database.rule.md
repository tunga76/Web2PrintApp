# Database Rules

## Core Principles

- **Relational First:** Use relational databases (PostgreSQL, SQL Server) as the primary source of truth for transactional e-commerce data (Orders, Customers, Catalog).
- **Safe Data Access:** Use the project's selected database client/query layer consistently. Parameterize values and use safe query APIs; if raw SQL is necessary, parameterize it and review authorization/tenant scoping explicitly. Examples include Prisma, Drizzle, or a Node.js database driver.

## Schema Design

- **Normalization:** Normalize tables to at least the 3rd Normal Form (3NF) to prevent data anomalies. Denormalize only when strictly necessary for read performance, and document the rationale.
- **Constraints:** Enforce data integrity at the database level. Use Foreign Keys, Unique Constraints, and Check Constraints (e.g., `Price >= 0`).

## Connection Management

- **Connection Pooling:** Always use connection pooling to manage database connections efficiently. Do not open/close raw connections per request manually if the framework can handle it.
- **Timeouts:** Configure strict command timeouts to prevent long-running queries from blocking worker threads.
