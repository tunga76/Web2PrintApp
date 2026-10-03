# UI Review Rules

## Core Principles

- **Design System Consistency:** All UI components must adhere strictly to the established Design System (e.g., specific margins, paddings, border radii, and color tokens). Avoid "magic numbers" or ad-hoc CSS classes.
- **Component Reusability:** Before building a new UI element, reviewers must verify if an existing component can be reused or extended. This prevents UI fragmentation across the enterprise application.

## Review Process

- **State Variations:** UI Reviews must validate all states of a component, not just the "happy path". This includes Hover, Active, Disabled, Error, Loading, and Empty states.
- **Micro-Interactions:** Ensure that critical interactions (e.g., adding to cart, submitting a form) provide immediate visual feedback (micro-animations, toast notifications) to the user.
