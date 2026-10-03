# Artwork and Print Approval Notification Rules (Web-To-Print)

## Core Principles

- **Action-Oriented Messaging:** Unlike standard "Your order has shipped" informational emails, Web-To-Print notifications often require immediate user action (e.g., uploading a new file, approving a digital proof). These must be treated as `HighPriority` alerts in the Notification Engine.
- **Production Blockers:** When an order is paused due to an artwork issue, the longer the customer takes to respond, the longer the production line is blocked. Notifications must proactively remind the user to unblock the process.

## Artwork Rejection (Pre-Flight Failure)

- **Immediate Alert:** When the Pre-Flight system (or a prepress operator) flags an uploaded design as unusable (e.g., low resolution, incorrect bleed, wrong color space), the order status becomes `ArtworkRejected`. The system MUST instantly trigger a multi-channel alert (e.g., Email + SMS or WhatsApp).
- **Clear Instructions:** The notification template must clearly state *why* the artwork was rejected (passing the exact error reason) and provide a direct, authenticated link to the specific upload page where the customer can replace the file.

## Proof Approval Requests (Digital Proofing)

- **Operator-Generated Proofs:** For bespoke B2B quotes or marketplace orders where an internal graphic designer manually created the print file, the customer MUST approve it before production begins.
- **Call to Action (CTA):** The system must send a "Proof Ready for Approval" notification. The CTA button must lead directly to a dedicated approval screen where the user must check the mandatory liability checkboxes (as defined in `10-Checkout Domain/proof-approval-terms.rule.md`).

## Automated Reminders (SLA Protection)

- **24-Hour Reminder:** If a customer does not upload a corrected file or approve a pending proof within 24 hours of the initial notification, the system must trigger an automated Reminder Notification.
- **SLA Reset Warning:** The reminder must explicitly warn the customer that the promised delivery date (SLA) is currently paused and will be recalculated/delayed based on when they finally complete the required action.
