# Email Rules

## Core Principles

- **Transactional vs Marketing:** Strictly separate Transactional emails (e.g., Receipts, Password Resets) from Marketing emails. They should ideally use different sending IPs/domains to protect the deliverability reputation of transactional emails.
- **Asynchronous Sending:** Email sending involves slow network calls. Offload it to a durable background worker/queue when delivery must survive request failures or provider latency; do not hold up customer checkout for non-critical email delivery.

## Deliverability

- **Authentication:** Ensure the sending domain has valid SPF, DKIM, and DMARC records configured.
- **Bounce Handling:** Implement Webhook listeners from the email provider (e.g., SendGrid, Mailgun) to track hard bounces, soft bounces, and spam complaints. Automatically suppress sending to hard-bounced addresses to maintain a healthy sender reputation.
