# Testing Rules

## Core Principles

- **Test Pyramid:** Focus heavily on Unit Tests for domain logic, Integration Tests for data access and API boundaries, and End-to-End (E2E) tests for critical user journeys (e.g., Checkout).
- **Test-Driven Design (TDD) Mindset:** Write code that is inherently testable. Inject dependencies, avoid static state, and keep methods focused.
- **Coverage:** Aim for thorough coverage of core domain logic, especially boundary conditions and financial or state-transition rules. Treat percentage thresholds as enforceable only when the measurement scope and exclusions are defined in `ci-quality-gates.rule.md` and `governance.md`.

## Backend (Node.js / TypeScript)

- **Unit Testing:** Use the backend test runner selected for the project (for example, Node.js built-in test runner, Vitest, or Jest).
- **Mocking:** Use the project's established mocking tools where isolation is useful; prefer real domain values and focused fakes when they keep tests clearer.
- **Integration Testing:** Exercise the actual database and service boundaries when behavior depends on provider-specific semantics. Testcontainers is one option when Docker is available. Do not use a substitute database to claim coverage of provider-specific behavior.
- **Assertions:** Follow the assertion library and style already adopted by the project.

## Frontend (Next.js)

- **Unit & Component Testing:** Use the project's existing component test framework (for example, React Testing Library with Jest or Vitest).
- **End-to-End (E2E) Testing:** Cover critical user journeys with the browser automation tool adopted by the project (for example, Playwright).
- **Mocking:** Use the established request-mocking approach (for example, MSW) where network isolation is appropriate.
