# Accessibility (a11y) Rules

## Core Principles

- **WCAG Compliance:** The application must strive for WCAG 2.1 Level AA compliance. This is a legal requirement in many enterprise/B2B contexts.
- **Keyboard Navigability:** Every interactive element (modals, dropdowns, canvas editors) MUST be fully navigable and usable using only the keyboard (Tab, Enter, Space, Arrows).

## UI/UX Standards

- **Color Contrast:** Text and interactive elements must have a minimum contrast ratio of 4.5:1 against their background.
- **Screen Readers:** Provide semantic HTML tags (`<nav>`, `<main>`, `<article>`) and appropriate `aria-labels` for icon-only buttons or complex custom UI controls to support screen reader users.
