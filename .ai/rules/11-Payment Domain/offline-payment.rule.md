# Offline Payment Rules (Wire Transfer / EFT)

## Core Principles

- **Asynchronous Fulfillment:** Unlike credit card payments, offline payments (Wire Transfer, EFT, Cash on Delivery) do not provide immediate proof of funds. The order lifecycle must pause until manual or automated verification occurs.

## Order State & Production

- **Pending Payment State:** When an order is placed via Wire Transfer, it must be created with a status of `PendingPayment`.
- **Production Block:** The system MUST NOT forward the attached design files to the production queue (Pre-flight or Printing) while the order is in the `PendingPayment` state.
- **Stock & Campaign Reservation:** Stock levels and single-use coupons applied to the order must be reserved immediately, just like a standard order, to prevent overselling while waiting for the transfer.

## Verification & Expiration

- **Bank Reconciliation:** The application should provide an endpoint or admin interface for accounting staff to manually mark the payment as `Paid` (or integrate with a banking API for auto-reconciliation via unique reference codes).
- **Auto-Cancellation:** Implement a background job to automatically cancel orders in the `PendingPayment` state after a configurable timeframe (e.g., 3 business days) and release the reserved stock and coupons.
- **Customer Notifications:** The system must automatically email the user with the exact bank account details and the unique Order Reference Code immediately after checkout, and send a warning 24 hours before auto-cancellation.
