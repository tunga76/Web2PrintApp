# Address Rules

## Core Principles

- **Separation of Concerns:** Clearly separate the `Shipping Address` (where the goods go) from the `Billing Address` (where the invoice goes and what is verified against the credit card). Provide a "Billing is same as Shipping" toggle for UX.
- **Snapshotting:** When an order is placed, a *snapshot* of the address must be saved directly to the Order record. Never link an Order merely to a `CustomerAddressId` via a foreign key, because if the user updates their address book later, it illegally alters historical orders.

## Validation

- **Format:** Enforce standard address formatting based on the selected Country/Region.
- **Verification (Optional/Recommended):** Integrate with a third-party address verification API (e.g., Google Places, SmartyStreets) to prevent failed deliveries due to typos.
- **Restrictions:** Validate the Shipping Address against merchant rules (e.g., "We do not ship to P.O. Boxes," or "We do not ship outside the US").
