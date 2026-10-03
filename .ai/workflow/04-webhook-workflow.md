# Payment Webhook Workflow

Provider
↓
Webhook Received
↓
Signature Validation
↓
Idempotency Validation
↓
Provider Verification
↓
Payment Update
↓
Order Update
↓
Notification

---

Rules

Never trust webhook payload directly.

Always call provider verify endpoint.

Ignore duplicate webhooks.

Log all webhook requests.