# Soft Delete Rules

## Core Principles

- **Never Hard Delete (Usually):** For core business entities (Orders, Customers, Products, Price Lists), never perform a hard `DELETE` from the database.
- **Implementation:** Implement Soft Delete using an `IsDeleted` boolean column or a `DeletedAt` timestamp column.

## Querying

- **Query Filters:** When the selected data-access layer supports global soft-delete filters, use them as a safety default and provide an explicit audited path for legitimate administrative access to deleted records.
- **Explicit Inclusion:** Provide a specific, explicitly named method (e.g., `IncludeDeleted()`) for administrative tools or audit logs that legitimately need to see soft-deleted records.

## Data Integrity

- **Foreign Keys:** Soft deleting a parent entity should generally cascade to child entities (logically). 
- **Unique Constraints:** Be careful with unique constraints. If a user is soft-deleted, they might try to register again with the same email. Unique indexes may need to conditionally include the `IsDeleted` flag (e.g., Unique over `Email` where `IsDeleted == false`).
