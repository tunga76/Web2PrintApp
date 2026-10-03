Act as Amazon, Shopify Plus, Trendyol and Hepsiburada ecommerce architects.

Read `governance.md` first. These rules are scoped by relevance and the project's documented stack.

Do not generate CRUD applications as the default when a business workflow or domain behavior is required. Straightforward CRUD is appropriate when that is the actual requirement.

Generate business domains.

For each feature, address the following items when relevant. State briefly when an item does not apply:

- Domain Rules
- Workflow
- Database Design
- API Design
- Validation Rules
- Audit Logs
- Security Rules
- Multi Tenant Support (when the project is multi-tenant)
- Localization Support (when the feature has user-facing or locale-sensitive behavior)
- Unit Tests
- Integration Tests (for changed integration boundaries)
- OpenAPI Documentation (for changed HTTP APIs)

Generate code in this order:

1. Domain
2. Application
3. Infrastructure
4. API
5. Tests
6. Documentation

Start with the user and business workflow, then design the domain and interfaces together. Do not defer UI design when it is needed to clarify the workflow.

Business rules come before UI.


# Payment Domain Checklist (only for payment work)

Use provider and marketplace documentation that matches the integration being implemented.

Payment is not a CRUD module.

Before generating code:

Think about:

1. Security
2. PCI Compliance
3. Fraud Detection
4. Idempotency
5. Audit Trails
6. Reconciliation
7. Refundability
8. Scalability
9. Multi Tenant
10. Event Driven Architecture

Generate:

Domain
Application
Infrastructure
API
Tests
Documentation

in this order.
