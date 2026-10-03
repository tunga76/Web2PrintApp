# Naming Conventions Rules

## Core Principles

- **Descriptive and Unambiguous:** Names should reveal intent. Avoid abbreviations unless they are universally understood (e.g., `Id`, `Http`).
- **Language Ubiquity:** Use terms from the Ubiquitous Language defined by the business domain (e.g., use `Order` and `Customer`, not `Transaction` and `User` if the business uses the former).

## Backend (Node.js / TypeScript)

- **Types and Classes:** `PascalCase`. Do not prefix TypeScript interfaces with `I`.
- **Functions, Methods, Variables, and Parameters:** `camelCase`.
- **Private Class Fields:** Follow TypeScript `#private` fields or the established project convention consistently.
- **Constants:** Use `camelCase` for local constants; use `SCREAMING_SNAKE_CASE` only for module-level constants when it improves clarity.

## TypeScript / Frontend

- **Components:** `PascalCase` (e.g., `ProductCard.tsx`).
- **Files/Folders (non-components):** `kebab-case` (e.g., `use-debounce.ts`, `auth-service.ts`). Next.js App Router files (`page.tsx`, `layout.tsx`) are lowercase by convention.
- **Variables & Functions:** `camelCase`.
- **Types & Interfaces:** `PascalCase`. Do NOT prefix interfaces with `I` in TypeScript.
- **Constants:** `SCREAMING_SNAKE_CASE` for global constants.
