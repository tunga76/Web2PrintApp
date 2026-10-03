# Product Question Rules

## Core Principles

- **Q&A System:** Allow users to ask questions about a product, which can be answered by the Seller/Admin or other customers (community Q&A).
- **Moderation:** Similar to reviews, questions and answers MUST be moderated before going live to prevent spam and inappropriate content.

## Lifecycle

- **Notifications:** When a question is answered, the user who asked it should be notified via the Notification Domain.
- **Searchability:** Approved Q&A should be indexed by search engines (SEO) and ideally searchable within the product page itself.

## Data Structure

- Maintain separate entities for `ProductQuestion` and `ProductAnswer`. A single question can have multiple answers. Support voting ("Helpful" button) to rank answers.
