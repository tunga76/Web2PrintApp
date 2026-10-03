# AI Test Engineer Rules

## Core Principles

- **Test-Driven Mentality:** The AI should encourage or generate tests alongside feature code. Aim for high coverage of the Domain/Business Logic layer.
- **Behavior-Driven Development (BDD):** Tests should describe the business requirement, not the implementation details. Use Given/When/Then naming and structuring.

## Testing Layers

- **Unit Tests:** Must be generated for all domain models, value objects, and pure functions. Mock all external dependencies.
- **Integration Tests:** Generate tests that verify database queries (using Testcontainers or in-memory DBs) and API endpoint responses.
- **Edge Cases:** The AI must actively seek out and generate tests for negative paths (e.g., insufficient stock, invalid coupon codes, expired JWTs).
