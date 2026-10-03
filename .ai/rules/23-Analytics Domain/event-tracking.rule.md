# Event Tracking Rules

## Core Principles

- **Standardized Schema:** Define a strict taxonomy/schema for tracking events (e.g., using Segment or a custom event dictionary). Standardize event names (`Product_Viewed`, `Added_To_Cart`, `Checkout_Started`, `Order_Completed`) and their payload properties across all platforms (Web, iOS, Android).
- **Client-Side vs Server-Side:**
  - *Client-Side:* Use for behavioral tracking (clicks, scrolls, time on page).
  - *Server-Side:* MUST be used for state-change tracking (Payment Successful, Order Refunded) to guarantee 100% accuracy, bypassing ad-blockers and network failures on the client side.

## Implementation

- **Tag Management:** Use a Tag Management System (e.g., Google Tag Manager) for client-side scripts to allow the marketing team to deploy tracking pixels without requiring developer code changes.
- **Data Layer:** The frontend application must expose a structured `dataLayer` object that the Tag Manager consumes, rather than having tracking scripts scrape the HTML DOM.
