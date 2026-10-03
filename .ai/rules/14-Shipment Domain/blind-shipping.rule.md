# Blind Shipping / White-Label Rules (Web-To-Print)

## Core Principles

- **B2B Reseller Protection:** Graphic designers, marketing agencies, and print brokers (Resellers) often drop-ship products directly to their end-clients. The platform must support "Blind Shipping" (Kör Nakliye) to prevent the end-client from discovering the actual printing facility's brand or the wholesale pricing.
- **Strict Brand Isolation:** When an order is marked for Blind Shipping, absolutely no branding of the printing platform (Ownpress) should appear on the packaging, shipping labels, or packing slips.

## Checkout and Configuration

- **User Opt-In:** Provide a checkbox at Checkout (or a global account-level setting for B2B users) labeled "Blind Shipping / White-label".
- **Sender Address Override:** If Blind Shipping is selected, the system must allow the user to input a custom "Sender (From) Address", or automatically default to the B2B user's company address instead of the factory's physical address.

## Carrier Integration Rules

- **API Payload:** When sending data to the Carrier API (e.g., UPS, FedEx, Yurtiçi Kargo), the `SenderName` and `SenderAddress` fields MUST be overridden with the Reseller's details.
- **Return Logistics:** The `ReturnAddress` on the shipping label should also point to the Reseller's address (or a generic PO Box) so that undeliverable packages are not returned directly to the printing facility, which would expose the source.

## Fulfillment & Packaging Floor

- **Packing Slips (İrsaliye):** The system-generated packing slip included inside the box must be completely unbranded (no logos, no URLs) and MUST NOT contain any pricing information (as the Reseller charges a markup to their own client).
- **Physical Checks:** The Warehouse Management System (WMS) UI must prominently flag the packing screen with a visual warning like **"⚠️ BLIND SHIP - DO NOT USE BRANDED TAPE/BOXES"** so floor workers ensure they use strictly generic packaging materials.
