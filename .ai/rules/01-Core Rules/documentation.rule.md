# Documentation Rules

## Core Principles

- **Code as Documentation:** The primary source of truth is the code itself. Write clean, self-documenting code with clear variable and method names.
- **Why, Not What:** Comments should explain *why* a decision was made or *why* a specific approach was taken, not *what* the code is doing (which should be obvious from reading it).

## Technical Documentation

- **README Files:** Every distinct project/service must have a `README.md` explaining:
  - What the service does.
  - Prerequisites and local setup instructions.
  - How to run tests.
  - Key architectural decisions.
- **API Documentation:** REST APIs must be documented using OpenAPI (Swagger). Ensure DTOs are well-commented so Swagger UI can generate descriptions. Use Zod-to-OpenAPI for Next.js Route Handlers.

## Architecture Decision Records (ADRs)

- Use ADRs to document significant architectural decisions, framework selections, and structural changes.
- An ADR should include: Context, Decision, Consequences, and Alternatives considered.

## Maintenance

- Outdated documentation is worse than no documentation. Include documentation updates as part of the Definition of Done (DoD) for every feature or refactor ticket.
