# AI Engineering Rules

## Core Principles

- **Code Generation:** AI-generated code MUST adhere to the same quality, security, and architectural standards as human-written code. Do not accept tutorial-level or "quick fix" solutions from AI.
- **Context Awareness:** When using AI assistants to generate code, ensure the AI is provided with the relevant architectural constraints, existing domain patterns, and security rules (via `.ai/rules`).

## Implementation

- **Review Process:** Treat AI as a peer developer. All AI-generated code MUST undergo rigorous human code review, static analysis, and automated testing before being merged.
- **Prompt Engineering:** Store reusable, complex prompts used for generating scaffolding, tests, or boilerplate within the repository (e.g., in an `.ai/prompts` directory) for consistency across the team.

## Security & IP

- **Data Privacy:** Never paste real user data, PII, payment information, or proprietary business secrets into public AI models or unsupported AI tools.
- **License Checks:** AI may inadvertently suggest code with restrictive licenses. Always verify the source and license of complex algorithms suggested by AI to comply with the Open Source Policy (prefer MIT, Apache-2.0, etc.).
