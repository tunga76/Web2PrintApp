# MVP Assumptions and Open Decisions

## Assumptions used to continue implementation

- Customer authentication starts with email and password. Passwords are Argon2id hashes; Auth.js manages sessions, while password reset uses opaque, hashed, expiring, single-use tokens.
- Product prices are admin-maintained exact price rows for supported option combinations and quantity breaks. A combination without an active price is unavailable; the server never estimates a price.
- Prices are stored net in GBP pence with the configured VAT rate basis points attached. Consumer-facing totals include VAT; business users see net, VAT, and gross totals. VAT is rounded at each order line to the nearest penny, half up.
- VAT treatment is configurable per price row. HMRC guidance differentiates printed products and qualifying conditions, so the default seed data will use standard rate until the business confirms tax treatment; no live sales are enabled.
- Hybrid manufacturing is implemented as a manual fulfilment choice per order line: own production or print partner. The MVP has no supplier or warehouse automation.
- Delivery options and surcharges are admin-managed, manually fulfilled rows with configurable prices and lead-time labels; they are not carrier quotes or delivery guarantees.
- Artwork uploads use short-lived, object-specific presigned S3-compatible requests. File type, size, ownership, and completion are verified server-side before an asset can be attached to an order.
- Development runs PostgreSQL, SeaweedFS (S3-compatible private artwork storage), and ClamAV through Docker Compose. The artwork bucket is created on first upload. A local mail catcher is used for password-reset and notification development, but must be run separately or replaced with SMTP configuration. Staging provider/account credentials remain environment configuration.
- Shipping addresses are snapshotted on orders and saved to the customer account after successful payment; the checkout pre-fills the most recently used/default address. Address book editing is not part of this MVP.
- Seeded products, options, delivery methods, and prices are illustrative development data only. Admins can edit them; no prices or delivery promises are represented as approved commercial terms.

## Decisions still needed for staging or launch

- S3-compatible storage provider, bucket, lifecycle/retention period, and staging credentials.
- SMTP/email provider and staging credentials.
- Approved product price matrices, supported configurations, delivery charges, and production lead times.
- Accountant-approved VAT treatment for each product/configuration and invoice wording.
- Brand logo, colours, product photography, and final marketing copy.
- Vercel development/staging project and PostgreSQL connection secrets.
- Stripe test account credentials and webhook secret. Live credentials and production deployment require explicit approval.
