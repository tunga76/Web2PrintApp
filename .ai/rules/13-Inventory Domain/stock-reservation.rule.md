# Stock Reservation Rules

## Core Principles

- **Soft Allocation:** To prevent overselling, stock must be "reserved" (softly allocated) before a payment is captured.
- **Timing:** Decide based on business rules whether to reserve stock when an item is added to the Cart (high cart abandonment risk) or when the user enters Checkout/clicks "Pay" (higher overselling risk). The latter is standard for modern e-commerce.

## Lifecycle

- **Reservation Creation:** Moving `X` units from `AvailableStock` to `ReservedStock`. Must include a `ReservationId` and an `ExpirationTime` (e.g., 15 minutes).
- **Reservation Confirmation:** When payment succeeds, the reservation is confirmed. The `ReservedStock` decreases by `X`, and `PhysicalStock` decreases by `X`.
- **Reservation Expiration/Cancellation:** If payment fails or the cart times out, a background worker must release the reservation, moving `X` units back from `ReservedStock` to `AvailableStock`.
