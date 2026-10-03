# Authorization Rules

## Core Principles

- **Principle of Least Privilege:** Users and services should only have the minimum permissions necessary to perform their required tasks.
- **Explicit Authorization:** Every API endpoint and backend action MUST explicitly verify authorization. Never assume authorization based on UI restrictions.

## Authorization Models

- **Role-Based Access Control (RBAC):** Use RBAC for broad categorizations (e.g., "Admin", "Customer", "Vendor").
- **Attribute-Based Access Control (ABAC) / Policy-Based:** Use policy-based authorization for granular, context-aware decisions (e.g., "Can Edit Order ONLY IF Order Belongs to User AND Order Status is Pending").

## Multi-Tenancy & Data Isolation

- **Tenant Isolation:** In multi-tenant environments (e.g., B2B setups), all queries must enforce tenant isolation. A user from Tenant A must NEVER be able to read or modify data from Tenant B.
- **Insecure Direct Object Reference (IDOR) Prevention:** Never trust the client-provided ID (like an order ID in a URL) without verifying that the currently authenticated user owns or has rights to access that specific ID.
