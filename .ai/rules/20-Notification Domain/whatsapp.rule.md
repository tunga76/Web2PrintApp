# WhatsApp Rules

## Core Principles

- **WhatsApp Business API:** Integration must comply with the strict rules of the WhatsApp Business API.
- **Template Pre-approval:** Unlike SMS or Email, businesses cannot send arbitrary messages to initiate a conversation. Any outbound message initiated by the business (e.g., Order Confirmation, Shipping Update) MUST use a pre-approved Message Template.

## Conversational Windows

- **24-Hour Window:** When a customer sends a message to the business, a 24-hour "Customer Service Window" opens. During this window, the business can reply with free-form text. Once the window closes, the business can only send pre-approved templates again.
- **Opt-in:** WhatsApp requires explicit, proactive opt-in from the user specifically for WhatsApp communications before the first message is sent.

## Fallback

- WhatsApp delivery is not guaranteed (e.g., user uninstalled the app). Implement a fallback strategy: if the WhatsApp message fails or remains unread for X hours, fall back to SMS or Email.
