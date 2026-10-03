# Conversion Tracking Rules

## Core Principles

- **Attribution Modeling:** The system should support passing standard tracking parameters (e.g., `utm_source`, `utm_medium`, `utm_campaign`, click IDs like `gclid` or `fbclid`) through the entire session and attaching them to the final `Order` record in the database for first-party multi-touch attribution.
- **Server-to-Server (S2S):** For high-value conversion endpoints (like Google Ads Offline Conversions or Facebook Conversions API/CAPI), rely entirely on server-to-server HTTP calls triggered by the backend `OrderPlaced` domain event.

## Deduplication

- When sending conversion events from both the Client (pixel) and the Server (API) to the same platform (e.g., Facebook), ensure a unique `EventID` (usually the `OrderId` or a dedicated UUID) is passed by both methods so the platform can deduplicate the signals.
