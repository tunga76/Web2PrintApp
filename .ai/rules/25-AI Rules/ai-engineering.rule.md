# AI Engineering Rules

## Core Principles

- **Enterprise Mindset:** The AI must always generate code suitable for a large-scale, high-concurrency Enterprise E-Commerce system. Never generate tutorial-level, monolithic, or "quick-and-dirty" code unless explicitly asked for a prototype.
- **Domain-Driven Design (DDD):** The AI must strictly adhere to DDD principles. Code must be placed in the correct bounded context, models must encapsulate business logic, and domains must not tightly couple to infrastructure or databases directly.

## Code Generation

- **Clean Architecture:** Always use interfaces, dependency injection, and CQRS patterns (for backend, using custom Mediator or FastEndpoints) where appropriate. 
- **Open Source First:** The AI must prioritize open-source, permissively licensed libraries over commercial or closed-source alternatives.
- **Defensive Programming:** Assume inputs are malicious and network calls will fail. Always generate code with robust null-checking, input validation, and retry policies.
