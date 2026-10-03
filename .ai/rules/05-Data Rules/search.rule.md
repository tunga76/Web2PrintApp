# Search Rules

## Core Principles

- **Offload Full-Text Search:** Relational databases are not optimized for complex full-text search, faceting, or typo-tolerance. Use a dedicated search engine (e.g., Elasticsearch, Meilisearch, Algolia) for catalog and site search.
- **Eventual Consistency:** The search index is a read-model. It should be updated asynchronously via domain events when the primary database (write-model) changes.

## Sync Mechanisms

- **Outbox Pattern:** Use the Outbox pattern to guarantee that updates to the database are eventually synced to the search index, even if the search service is temporarily down.
- **Bulk Indexing:** Provide background jobs to fully re-index the catalog from scratch to recover from severe desynchronization or when mapping schemas change.

## Search Features

- The search implementation must support Faceted Navigation (filtering by categories, brands, price ranges), Typo Tolerance (Fuzzy matching), and Synonyms.
