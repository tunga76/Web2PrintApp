# Shipping Selection Rules

## Core Principles

- **Dynamic Rates:** Shipping options (e.g., Standard, Express, Next-Day) and their costs must be calculated dynamically based on the verified Shipping Address, total cart weight/volume, and active campaign rules (e.g., "Free Shipping over $100").
- **Delivery Estimates:** Whenever possible, present an estimated delivery date (or range) rather than just a method name, as this significantly increases conversion rates.

## Integration

- **Carrier APIs:** If using live carrier rates (UPS, FedEx, DHL), implement strict caching and timeouts. If the carrier API fails or times out, fall back to a safe "Flat Rate" to avoid blocking the checkout.
- **Fulfillment Zones:** Validate that the selected shipping method is valid for the products in the cart (e.g., hazardous materials might not be eligible for Air Shipping).
