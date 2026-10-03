# Carrier Rules

## Core Principles

- **Carrier Abstraction:** The system must integrate with multiple logistics carriers (e.g., UPS, FedEx, local postal services, Same-Day couriers). Use the Provider/Strategy pattern to abstract carrier-specific API logic away from the core domain.
- **Service Levels:** Define internal abstract service levels (e.g., `Standard`, `Express`, `Heavy Freight`) and map them to specific Carrier Services (e.g., `Standard` -> `FedEx Ground` or `UPS Standard`).

## Label Generation

- The system must communicate with the Carrier API to generate physical shipping labels and tracking numbers simultaneously when a shipment is marked as "Packed" by the warehouse.
- Store the generated Label URL or Base64 document directly on the Shipment record so it can be easily reprinted by warehouse staff without calling the external API again.
