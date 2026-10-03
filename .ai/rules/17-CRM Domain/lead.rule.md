# Lead Rules

## Core Principles

- **Definition:** A Lead is a potential customer who has shown interest (e.g., filled out a contact form, signed up for a newsletter) but has not yet been qualified or made a purchase.
- **Lifecycle:** Leads have a distinct state machine (e.g., `New`, `Contacted`, `Qualified`, `Unqualified`).

## Conversion

- When a Lead is `Qualified` and a deal is in progress, the Lead is typically converted into a formal `Customer` (Account) and an `Opportunity` (Deal).
- Do not clutter the core `Customer` table with unqualified leads. Keep them in a separate `Leads` table until conversion to maintain data hygiene.
