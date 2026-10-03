# Customizable / Web-To-Print Product Rules

## Core Principles

- **Separation of Product Types:** The catalog must clearly distinguish between standard ready-made products (e.g., a pre-printed t-shirt) and customizable products (e.g., custom business cards, personalized mugs).
- **Design Intent:** A customizable product serves as a "blank canvas" or "template base" that requires user interaction (designing via an editor or uploading a file) before it can be added to the cart.

## Product Configuration

- **Customizable Flag:** Every product must have an indicator (e.g., `isCustomizable = true`) to signal the frontend to route the user to the design studio or file upload screen instead of a direct "Add to Cart" button.
- **Input Method:** Define how the customization happens for the product:
  - `CanvasEditor`: User designs online using the built-in web-to-print editor.
  - `FileUpload`: User uploads a ready-made PDF/AI/TIFF file for printing.
  - `Both`: User can choose either method.

## Print Specifications (Specs)

Customizable products must be strictly linked to Print Specifications to avoid production errors:
- **Dimensions & Bleed:** Explicitly define the physical final dimensions (e.g., 90x50 mm) and the bleed area (taşma payı, e.g., 3mm on all sides).
- **Resolution (DPI):** Define the minimum required DPI (usually 300 DPI for paper, 150 DPI for large format banners) for uploads or rasterized canvas exports.
- **Color Space:** Specify whether the product requires CMYK for offset/digital printing or RGB for specific digital processes.
- **Safe Zone:** Define the safe margin (güvenli alan) to ensure important text or logos are not cut off during the guillotine/cutting process.

## Output and Order Integration

- **Preview Generation:** The system must generate a low-resolution, lightweight preview (mockup) of the user's design to be displayed in the Cart and Checkout summaries.
- **Production File:** When the order is successfully paid, the system must generate a high-resolution, print-ready file (PDF/X standard preferred) and securely attach its reference to the `OrderLineItem` so the production facility (matbaa) can access it.
