# SMS Rules

## Core Principles

- **Cost and Length:** SMS is expensive and length-constrained (typically 160 characters per segment). SMS should be reserved for high-priority, time-sensitive alerts (e.g., OTPs, Delivery out for dispatch).
- **Encoding:** Be mindful of character encoding (GSM-7 vs Unicode). A single Unicode character (like an emoji or specific localized letters) can drastically reduce the character limit per segment and double the cost.

## Compliance and Formatting

- **Opt-out Mechanism:** Marketing SMS MUST include a clear opt-out mechanism (e.g., "Reply STOP to unsubscribe") as mandated by telecommunication authorities.
- **Phone Number Validation:** Always validate and normalize phone numbers to E.164 format (e.g., `+14155552671`) before attempting to send, preferably at the time of user data entry.
