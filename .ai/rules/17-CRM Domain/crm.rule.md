# CRM (Customer Relationship Management) Rules

## Core Principles

- **360-Degree View:** The CRM Domain acts as an aggregator. It pulls data from Orders, Customers, Tickets, and Campaigns to provide internal sales and support staff with a complete view of a customer's lifetime interaction with the brand.
- **B2B vs B2C:** Acknowledge the difference between B2C (high volume, low touch) and B2B (low volume, high touch, negotiation-heavy) workflows within the same platform.

## Architecture

- **Event Sourcing (Optional but recommended):** CRM heavily benefits from knowing *what happened when* (e.g., "Customer called", "Quote sent", "Order placed"). Listening to Domain Events across the platform and persisting them as a timeline is a common pattern.
- **Access Control:** Enforce strict RBAC (Role-Based Access Control) to ensure sales representatives only see leads or customers assigned to their territory or portfolio.
