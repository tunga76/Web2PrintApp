# Monitoring Rules

## Core Principles

- **Proactive vs Reactive:** The system must alert engineers *before* customers notice an issue. Set up alerting for spikes in 5xx HTTP errors, sudden drops in checkout conversions, or growing queue depths.
- **Three Pillars of Observability:**
  1. **Metrics:** Aggregated data (e.g., CPU usage, active connections, requests per second). Use Prometheus/Grafana or Datadog.
  2. **Logs:** Detailed event records (see logging rules).
  3. **Traces:** Distributed tracing (OpenTelemetry) to track a single request as it jumps across multiple microservices (Frontend -> API Gateway -> Order Service -> Payment Service).

## Health Checks

- Implement `/healthz` and `/readyz` endpoints for Kubernetes/Load Balancers to verify application health, including checking connections to the Database and Redis.
