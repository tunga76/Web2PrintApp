# ERP Integration Rules

## Core Principles

- **Master Data Ownership:** Clearly define which system owns specific Master Data. Generally, the ERP owns Core Pricing, Base Inventory, and Wholesale Customers, while the E-Commerce platform owns B2C Customers, Marketing Campaigns, and Web Content.
- **Idempotency & Queuing:** ERP systems often have high latency or downtime for maintenance. All integration traffic (Orders to ERP, Inventory from ERP) must run through a persistent message queue (e.g., RabbitMQ, Kafka) and handle retries gracefully with Idempotency Keys to prevent duplicate orders.

## Data Mapping

- Create a robust `Integration Mapping` layer. Never hardcode ERP-specific IDs (e.g., a specific GL Account or Warehouse Code) directly into the core e-commerce business logic. Use mapping tables that can be updated via the admin panel.
