# Theming and White-labeling Rules

## Core Principles

- **Multi-Tenant Branding:** In a B2B or SaaS environment, the platform must seamlessly adapt its visual identity (colors, logos, typography) and domain name to match the specific tenant without requiring code changes.
- **Data-Driven UI:** Theme configuration should be stored in the database or a configuration store, retrieved at runtime (or cached at edge), and applied dynamically to the frontend.

## Frontend (Next.js & CSS)

- **CSS Variables (Custom Properties):** Do not hardcode brand colors in CSS or Tailwind directly. Map your utility classes to CSS variables (e.g., `bg-primary` maps to `var(--theme-primary)`), which are injected into the HTML root or `<body>` dynamically based on the current tenant.
- **Assets Management:** Tenant-specific assets (like logos, favicons, cover images) must be stored in Object Storage (e.g., S3) and their URLs provided via the tenant configuration API.
- **Typography:** If allowing custom fonts per tenant, ensure they are securely loaded and comply with licensing rules.

## Backend API

- **Theme Configuration Entity:** Maintain a distinct `TenantTheme` or `WhiteLabelConfig` entity in the database that stores primary colors, secondary colors, logo URLs, and custom domain details.
- **Caching:** Theme data is accessed on every request but rarely changes. It MUST be aggressively cached (e.g., using Redis) to avoid unnecessary database hits.

## Custom Domains

- **Routing & Host Headers:** The platform must support identifying the current tenant via the incoming HTTP Host header (e.g., `shop.customerdomain.com` mapping to Tenant A).
- **SSL / TLS:** Automate SSL certificate provisioning for custom tenant domains (e.g., via Let's Encrypt, Azure Front Door, or Cloudflare integration) to ensure secure connections across all white-labeled sites.
