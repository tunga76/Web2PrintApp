# Responsive Design Rules

## Core Principles

- **Mobile-First Approach:** Always design and write CSS for the smallest screen sizes first, then use `min-width` media queries to progressively enhance the layout for tablets and desktops.
- **Fluidity:** Avoid hardcoded fixed pixel widths for layout containers. Use percentages, `vw/vh`, or Flexbox/Grid to ensure the UI stretches and squishes smoothly between breakpoints.

## Breakpoints

- Standardize enterprise breakpoints (e.g., `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
- Ensure touch targets on mobile (buttons, links) have ample spacing to prevent accidental taps (fat-finger errors).
