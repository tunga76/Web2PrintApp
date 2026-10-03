# Scheduler Rules

## Core Principles

- **Cron-like Execution:** Use a scheduler compatible with the Node.js deployment for recurring work (for example, a managed scheduler or a Node.js job library). Ensure jobs are idempotent and safe across multiple worker instances.
- **Stateless Jobs:** Scheduled tasks must not rely on in-memory state, as they can be executed by any available worker node in a clustered environment.

## Concurrency

- **Distributed Locks:** Prevent the same scheduled job from running simultaneously on two different servers. The scheduler must support database-backed or Redis-backed distributed locks.
