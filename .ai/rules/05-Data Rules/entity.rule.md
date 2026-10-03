# Entity Rules

## Core Principles

- **Rich Domain Models:** Entities should not just be "bags of setters" (Anemic Domain Model). They should encapsulate their own state and business logic.
- **Private Setters:** Use `private` or `init` setters for entity properties to prevent arbitrary modification from outside the domain. State changes should occur through explicit methods (e.g., `order.MarkAsShipped()`).

## Identifiers

- **Type:** Use `Guid` (UUIDv4 or UUIDv7) or strongly-typed IDs for primary keys to prevent IDOR vulnerabilities and allow client-side ID generation. Avoid predictable auto-incrementing integers for public-facing entities.
- **Audit Fields:** Every entity should implement standard audit fields: `CreatedAt` (UTC), `CreatedBy`, `UpdatedAt` (UTC), `UpdatedBy`.

## Persistence Ignorance

- Entities should be ignorant of how they are persisted. Do not pollute domain entities with ORM-specific attributes (like `[Table]` or `[Column]`) if possible; prefer Fluent API configuration in the infrastructure layer.
