# Visual Regression Rules

## Core Principles

- **Pixel Perfection Assurance:** Visual Regression Testing (VRT) tools (e.g., Playwright Visual Comparisons, Percy, BackstopJS) must be used to ensure CSS/UI updates in one component do not accidentally break the layout of another page.
- **Baseline Management:** The CI/CD pipeline takes screenshots of critical pages (Homepage, Product Page, Checkout) and compares them against approved "Baseline" images. Any pixel deviation beyond a set threshold (e.g., 1%) requires manual developer approval.

## Dynamic Content Handling

- **Mocking Data:** To prevent false positives in VRT (e.g., a changing promotional banner or a timestamp), tests must mock dynamic API responses or mask specific DOM elements (like date fields) before taking the screenshot.
