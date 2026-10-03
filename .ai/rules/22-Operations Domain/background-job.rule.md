# Background Job Rules

## Core Principles

- **Fire and Forget:** Immediate UI response is paramount. Long tasks triggered by users (e.g., "Export 10,000 customers to CSV") must be executed as background jobs.
- **State Tracking:** The system must provide a mechanism (e.g., polling an endpoint or WebSockets) for the frontend to track the progress and completion status of the background job.

## Isolation

- Run background workers on dedicated computing resources (different servers or distinct containers) so that heavy CPU/Memory usage by a background job does not impact the web storefront's latency and availability.
