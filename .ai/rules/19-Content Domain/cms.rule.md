# Headless CMS Rules

## Core Principles

- **Headless Architecture:** The Content Management System (CMS) must be strictly headless. It serves content (JSON/GraphQL) via APIs, completely decoupled from the frontend presentation layer (Next.js).
- **Omnichannel Delivery:** Content created once must be structured so it can be consumed by the web application, mobile app, and external marketplaces without requiring channel-specific formatting.

## Content Modeling

- **Structured Content:** Avoid large, monolithic rich-text (WYSIWYG) blobs where possible. Break content down into structured fields (e.g., `HeroTitle`, `CallToAction`, `FeatureList`) to allow the frontend to render them securely and responsively.
- **Localization:** The CMS must natively support localization. Content entries should be linked across languages to allow the frontend to fetch the correct language variant seamlessly.
