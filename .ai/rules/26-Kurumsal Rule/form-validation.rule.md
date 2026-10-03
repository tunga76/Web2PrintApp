# Form Validation Rules

## Core Principles

- **Client & Server Synergy:** Validation must occur in two places. 
  1. **Client-side:** For instant feedback and UX (using libraries like Zod or Yup).
  2. **Server-side:** For absolute security and data integrity (never trust the client). The rules MUST be identical on both sides.
- **Progressive Disclosure:** For long forms (like Checkout or complex B2B registration), validate fields as the user interacts with them (`onBlur` or `onChange`), rather than shouting all 15 errors only when they click Submit.

## Error Messaging

- **Actionable Errors:** Error messages must be polite, clear, and actionable. Avoid generic "Invalid Input". Use "Password must contain at least one number and be 8 characters long."
