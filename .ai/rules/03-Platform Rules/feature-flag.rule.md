# Feature Flag Rules

## Core Principles

- **Decouple Deployment from Release:** Use feature flags to safely merge code into main branches and deploy to production without immediately exposing the feature to all users.
- **Default State:** If the feature flag service is unreachable, the system must degrade gracefully and fall back to a safe default state (usually `false` / disabled).

## Flag Lifecycle

- **Short-Lived vs Long-Lived:** Distinguish between temporary flags (used for progressive rollouts, A/B testing) and permanent flags (used for tenant-specific features or kill switches).
- **Cleanup:** Temporary feature flags represent technical debt. Once a feature is fully rolled out (100%), create a ticket to remove the flag and the dead code paths from the codebase.

## Granularity

- Support evaluating flags based on context: Global, per-Tenant, per-User Segment, or even specific User IDs for beta testing.
- Both the Frontend UI and Backend APIs must respect feature flags (e.g., hiding a button in UI AND returning `403 Forbidden` / `404 Not Found` if the API endpoint is hit directly while the flag is off).
