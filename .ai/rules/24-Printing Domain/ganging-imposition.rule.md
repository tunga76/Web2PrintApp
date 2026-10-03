# Ganging and Imposition Rules (Montaj Kuralları)

## Core Principles

- **Minimize Waste:** Commercial printing heavily relies on "Ganging" or "Imposition" (Montaj/Harmanlama)—the process of combining multiple distinct customer orders onto a single large press sheet to minimize paper waste, plate costs, and machine setup time.
- **Batch Processing:** Orders should not be sent to the physical offset or digital presses one-by-one. They must be batched by their physical print properties.

## The Ganging Pool (Montaj Havuzu)

- **Grouping Logic:** Once an order line item passes PreFlight and reaches the `InProduction` status, the system must automatically route its print-ready PDF into a "Ganging Pool" (Bekleyen İşler Havuzu). 
- **Criteria for Grouping:** Items in a specific pool MUST share absolutely identical base properties:
  - Raw Material (e.g., 350g Matte Coated Paper).
  - Coating/Lamination (e.g., Glossy Cellophane on both sides).
  - Print Color Type (e.g., CMYK Front & Back).

## Imposition Workflow

- **Sheet Layout:** The system (or an integrated third-party prepress software like Metrix/Fiery) automatically arranges these pooled PDFs onto a large master layout (e.g., 70x100 cm sheet), adding necessary crop marks (kesim krosları), bleed overlaps, and color calibration bars.
- **Job ID / Üretim Fişi:** The resulting large layout is assigned a unique `PrintJobId` (Üretim Fişi). All individual customer orders placed on this specific sheet are now strictly linked to this `PrintJobId` in the database.

## Status Synchronization (Bulk Updates)

- **Factory Floor Tracking:** On the factory floor, operators track and scan the barcode of the `PrintJobId` (the large sheet), not the individual customer orders.
- **Cascade Updates:** When the guillotine/cutting operator marks the `PrintJobId` as "Cut and Finished", the system MUST automatically cascade that status update (e.g., moving them from `InProduction` to `QualityControl` or `ReadyForShipping`) to all the underlying customer orders that were part of that specific gang run.
