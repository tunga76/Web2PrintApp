# Ticket Rules

## Core Principles

- **Issue Tracking:** Tickets are the central entity for tracking customer issues, inquiries, and complaints.
- **Threaded Communication:** A Ticket contains a threaded conversation between the Customer and the Agent(s), supporting internal hidden notes (see `customer-note.rule.md`) alongside public replies.

## Relationships

- A Ticket must be able to link to specific domain entities: an Order, a specific Line Item (e.g., for a defect report), a Return Request (RMA), or a general Customer Profile.
- **State Management:** Tickets require strict states (e.g., `Open`, `Pending Customer Response`, `Escalated`, `Resolved`, `Closed`) to ensure no issue falls through the cracks.
