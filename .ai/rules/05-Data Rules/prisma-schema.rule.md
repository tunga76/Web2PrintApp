# Prisma Schema Rules

## Core Principles

- **Schema as Single Source of Truth:** Your `schema.prisma` file is the definitive representation of your database structure in the Node.js/Next.js environment. Keep it clean, well-commented, and logically organized.
- **Strict Data Types:** Always use the most restrictive data types possible to ensure data integrity at the database level.

## Naming Conventions

- **Models:** Use `PascalCase` and singular names for models (e.g., `model User`, `model Product`, not `Users` or `Products`).
- **Fields:** Use `camelCase` for all fields (e.g., `firstName`, `createdAt`).
- **Enums:** Use `PascalCase` for enum names and `UPPER_SNAKE_CASE` for enum values (e.g., `enum OrderStatus { PENDING, SHIPPED }`).
- **Database Mapping:** If the underlying database has a different naming standard (e.g., snake_case), use `@map` and `@@map` to keep Prisma client code clean (e.g., `@@map("users")`, `@map("first_name")`).

## Schema Architecture

- **Primary Keys:** Every model MUST have a unique primary key, typically named `id`. Prefer string-based IDs (UUID/CUID) or GUIDs for distributed/SaaS systems: `id String @id @default(uuid())`.
- **Audit Fields:** Every model representing a core business entity MUST include standard audit fields:
  - `createdAt DateTime @default(now())`
  - `updatedAt DateTime @updatedAt`
  - `isDeleted Boolean  @default(false)` (as per the Soft Delete rule).
- **Relations:** 
  - Always explicitly define relation fields and scalar foreign keys.
  - Apply `onDelete: Cascade` or `onDelete: Restrict` explicitly based on business logic (e.g., deleting a User should Cascade delete their Settings, but Restrict deleting an Order).
- **Indexes:** Use `@@index` and `@@unique` for fields that will be frequently queried, filtered, or joined (e.g., `@@index([tenantId])`, `@@index([email])`).

## Validation & Migrations

- **Database Constraints:** Push validation down to the database level. Enforce `String` lengths (e.g., `@db.VarChar(255)`) and `Decimal` precision/scale.
- **Migration Caution:** Never manually edit files in the `prisma/migrations` folder. Always use `npx prisma migrate dev` to generate migrations locally and review the generated SQL before committing.
