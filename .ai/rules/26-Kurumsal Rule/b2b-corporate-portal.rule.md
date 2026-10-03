# B2B Corporate Portal & White-Label Rules (Web-To-Print)

## Core Principles

- **Enterprise Readiness:** Large corporate clients (e.g., Banks, Franchise networks, Real Estate agencies) require dedicated, branded purchasing portals, not just a generic storefront. Providing this is a massive competitive advantage in the Web-to-Print industry.
- **Tenant Isolation:** The system must act as a Multi-Tenant application where a Corporate Client (Tenant) has completely isolated branding, catalogs, and users.

## White-Labeling (Tenant Theming)

- **Branding Elements:** When a corporate user logs in (or visits a specific subdomain like `print.bankname.com`), the UI must dynamically load the Tenant's specific Logo, Primary/Secondary Brand Colors, and Custom Banners.
- **Removing Platform Identity:** The core Web-to-Print platform's branding (e.g., "Ownpress") must be entirely hidden from the UI, transactional emails, invoices, and physical packing slips for these specific corporate tenants.

## Private Catalogs (Kapalı Katalog)

- **Restricted Access:** Corporate portals must feature a "Private Catalog". A branch manager logging in should only see the specific products (e.g., Corporate Business Card, Official Letterhead) that have been pre-approved by their Headquarters.
- **Locked Templates:** The Design Editor for these private products must be heavily locked down. Users can only edit specific text fields (e.g., Name, Title, Phone) but CANNOT alter the corporate logo, brand colors, or legal disclaimers to ensure 100% brand consistency.

## Approval Workflows (Satınalma Onayı)

- **Multi-Level Approvals:** When a branch employee places an order, the system must NOT immediately charge them or send the print file to production. The order must enter a `PendingApproval` (Onay Bekliyor) state.
- **Procurement Routing:** An automated email must be sent to the Corporate Procurement Manager (Merkez Satınalma) to review the artwork proof and the cost. Only upon their digital approval will the order move to `InProduction` (usually charging their B2B Credit account).
