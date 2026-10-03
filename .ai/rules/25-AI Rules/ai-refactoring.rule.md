# AI Refactoring Rules

## Core Principles

- **Boy Scout Rule:** "Leave the code cleaner than you found it." When the AI is asked to modify a file, it should suggest minor, safe refactorings to improve readability if the surrounding code is messy.
- **Semantic Preservation:** Refactoring MUST NOT change the external behavior or business logic of the code.

## Techniques

- **Extract Method/Class:** Break down massive 500-line controllers or services into smaller, cohesive classes following the Single Responsibility Principle (SRP).
- **Magic Strings/Numbers:** Replace hardcoded strings and numbers with well-named constants or Enums.
- **Modern Syntax:** Prefer clear, supported modern TypeScript/JavaScript syntax that matches the Node.js runtime and frontend tooling versions recorded by the project.
