# Matrix and Dynamic Pricing Rules (Web-To-Print)

## Core Principles

- **Avoid SKU Explosion:** In the printing industry, a single product (e.g., Business Card) can have thousands of variations (Size x Paper x Finish x Quantity). Do not create a unique SKU/Product Variant in the database for every possible combination.
- **Dynamic Calculation:** The final price of a customizable product must be calculated dynamically based on a Base Price plus the cost of selected Modifiers (Print Options).

## Pricing Modifiers

- **Absolute Surcharges:** An option that adds a fixed monetary value to the total (e.g., "+ $5.00 for Graphic Design Check").
- **Percentage Surcharges:** An option that increases the base price by a percentage (e.g., "+ 20% for 24-Hour Express Delivery").
- **Unit/Area Surcharges:** An option that increases cost based on the physical size or quantity (e.g., "+ $0.50 per square meter for Glossy Lamination").

## Pricing Matrices (Lookup Tables)

- **Grid Pricing:** For highly complex printing products (like catalogs or banners), use a Matrix (Lookup Table) where the X and Y axes represent the two most critical attributes (e.g., Quantity vs. Page Count). The intersection provides the base price.
- **Interpolation vs Brackets:** If a user requests a quantity (e.g., 250) that falls between two defined matrix points (e.g., 100 and 500), the system must explicitly define whether to push them to the higher bracket or calculate a linear per-unit price.

## Validation and Integrity

- **Incompatible Options:** The pricing engine must validate that selected modifiers are compatible (e.g., "Gofre/Embossing" might not be available on "90gr Thin Paper"). 
- **Backend Verification:** While the Frontend UI must recalculate the total price instantly for a good user experience, the Backend API MUST always re-calculate and verify the final price from scratch when the item is added to the Cart to prevent tampering by malicious clients.
