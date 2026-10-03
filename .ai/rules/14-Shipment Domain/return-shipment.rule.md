# Return Shipment Rules

## Core Principles

- **Reverse Logistics:** Returning items requires a distinct `ReturnShipment` record. It is not simply the reverse of the outbound shipment.
- **Carrier Generation:** The system should automatically generate a Return Label (e.g., via Carrier API) when a customer initiates a valid return request through the UI.

## Tracking & Receiving

- Return shipments must be tracked just like outbound shipments.
- A return is not complete when it arrives at the warehouse. It must go through an "Inspection" phase (handled by the Return Domain) before the items are added back to Available Inventory and a refund is issued.
