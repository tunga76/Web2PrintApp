# Print Product Rules

## Core Principles

- **Dynamic Configuration:** Unlike standard retail products (e.g., a T-shirt with Size/Color), Print Products (e.g., Business Cards, Flyers) have dozens of independent technical parameters (Dimensions, Paper Weight, Lamination, Corners, Quantities).
- **Dependency Matrix:** Product options are highly interdependent. For example, "Spot UV" finishing might only be selectable if "Matte Lamination" is chosen, and "Embossing" might only be available for paper weights > 300gsm. The system must enforce these constraints dynamically in the UI and validate them on the backend.

## Dimension Handling

- Store dimensions strictly in millimeters (mm).
- Distinguish clearly between "Finished Size" (Kesim Ölçüsü) and "Bleed Size" (Taşma Paylı Ölçü).
