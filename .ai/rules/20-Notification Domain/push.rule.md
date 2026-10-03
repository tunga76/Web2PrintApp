# Push Notification Rules

## Core Principles

- **Device Tokens:** Push notifications require valid device registration tokens (e.g., FCM for Android/Web, APNs for iOS). The system must securely store and manage the lifecycle of these tokens, linking them to the `CustomerId`.
- **Token Invalidation:** Mobile OS providers frequently cycle tokens. The system must listen to provider feedback and aggressively prune invalid or expired tokens from the database to prevent wasted network calls.

## Content and Routing

- **Rich Payloads:** Support sending data payloads alongside the visual notification to allow the mobile app to handle deep linking (e.g., clicking a "New Message" push takes the user directly to the specific Ticket thread).
- **Rate Limiting:** Implement strict rate limiting for push notifications to prevent spamming the user and causing them to revoke push permissions entirely at the OS level.
