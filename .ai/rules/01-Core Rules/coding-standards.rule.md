# Coding Standards Rules

## Core Principles

- **Readability First:** Code is read far more often than it is written. Optimize for readability and maintainability over cleverness or premature optimization.
- **DRY (Don't Repeat Yourself):** Extract duplicated logic into shared functions, services, or components. However, do not aggressively DRY code if it couples unrelated concepts (Rule of Three applies).
- **SOLID Principles:** Apply relevant design principles to TypeScript modules and React components without adding indirection that obscures a simple flow.

## TypeScript / Frontend

- **Strict Mode:** Always compile with TypeScript `strict: true`. Avoid using `any`; use `unknown` if the type is truly dynamic, and use Type Guards to narrow it down.
- **Linting & Formatting:** Enforce ESLint and Prettier across the codebase. Fix all warnings; do not ignore them without a documented inline reason.

## Node.js Backend (TypeScript)

- **Strict Types:** Use TypeScript strict mode in the backend too. Avoid `any`; validate untrusted data at runtime because TypeScript types are erased at runtime.
- **Async I/O:** Use promises and `async`/`await` for I/O. Handle rejected promises at the request/job boundary and avoid unhandled rejections.
- **Runtime Support:** Use APIs supported by the Node.js version recorded by the project; do not depend on browser-only globals in server code.
