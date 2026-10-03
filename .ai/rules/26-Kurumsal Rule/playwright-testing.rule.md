# Playwright Testing Rules

## Core Principles

- **End-to-End (E2E) Focus:** Playwright tests are the final defense. They must test actual customer journeys (e.g., "Guest user browses to product, configures print options, adds to cart, and checks out") using a real browser engine.
- **Locators:** Always use resilient locators. Prefer `getByRole`, `getByText`, or `getByTestId` over brittle CSS selectors (`.class > div:nth-child(2)`) which break easily during UI refactors.

## Environment & CI/CD

- **Isolation:** Tests must run in isolated environments (fixtures) without relying on hardcoded database state that might change.
- **Blocking CI:** Critical E2E paths (Login, Add to Cart, Checkout) MUST pass in the CI/CD pipeline before any code can be merged to the main branch.
