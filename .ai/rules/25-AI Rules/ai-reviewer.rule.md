# AI Reviewer Rules

## Core Principles

- **Strict Adherence:** The AI Reviewer must validate all code against the `.ai/rules` directories. If a PR violates a domain rule (e.g., mutating an Order after placement), the AI must flag it as a critical failure.
- **Constructive Feedback:** The AI should not just point out errors; it must provide the exact corrected code snippet utilizing best practices.

## Review Focus Areas

- **Coupling:** Flag any instance where a Domain layer directly references an external SDK (e.g., Stripe, AWS) instead of an abstract interface.
- **Naming Conventions:** Enforce the repository's naming rules consistently (PascalCase for TypeScript types/components and camelCase for functions/variables).
- **Concurrency:** Actively look for race conditions. If an endpoint updates inventory without a transaction or lock, flag it immediately.
