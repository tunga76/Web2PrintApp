# CI/CD and Quality Gates Rules

## Core Principles

- **Automated Validation:** No code should be merged into the `main` or `production` branches without passing a strict, automated Continuous Integration (CI) pipeline.
- **Fail Fast:** The CI pipeline must execute the fastest checks first (Linting, Formatting) before moving to slower operations (E2E Tests, Container Builds).

## Pull Request (PR) Quality Gates

Before any PR can be merged, the following automated checks MUST pass:
1. **Linting & Formatting:** Code must comply with ESLint/Prettier (Frontend) and `dotnet format` / Roslyn analyzers (Backend).
2. **Type Checking:** Strict TypeScript compilation must pass without errors (`tsc --noEmit`).
3. **Unit & Integration Tests:** The configured backend and frontend test suites must pass (for example, Node.js built-in test runner, Vitest, or Jest).
4. **End-to-End (E2E) Tests:** Critical paths (like Cart and Checkout) must be validated via Playwright headless browser tests.
5. **Visual Regression:** UI components must pass visual snapshot comparisons to prevent unintended CSS breaks.

## Code Coverage

- **Coverage Threshold:** Enforce a coverage threshold only when the repository configures the tool, included files, exclusions, and baseline. Prefer preventing regressions against the current baseline before raising the threshold.
- **Domain Logic:** Prioritize tests for core business outcomes, boundary values, failure paths, and state transitions. A 100% target may be adopted for a narrowly defined module when the team documents its scope and measurement method; it is not a universal requirement.

## Security Gates

- **Dependency Scanning:** The pipeline must run tools like `npm audit` or GitHub Dependabot. PRs containing Critical or High severity vulnerabilities in dependencies must be blocked.
- **Secret Scanning:** Commits must be scanned to ensure no API keys, database connection strings, or JWT secrets are accidentally pushed to the repository.
