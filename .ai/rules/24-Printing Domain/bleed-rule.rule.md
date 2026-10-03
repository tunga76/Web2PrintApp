# Bleed Rule Rules

## Core Principles

- **Profile-Driven Dimensions:** Bleed dimensions and tolerances depend on product, press, and print provider. Treat numeric examples as illustrative unless a versioned product specification or production profile sets them.

- **Mathematical Precision:** If a finished product is 90x50mm and requires a 3mm bleed, the uploaded artwork MUST be exactly 96x56mm.
- **Rejection vs Warning:** If the user uploads exactly 90x50mm, the system should ideally reject it or offer to add a mirrored/stretched bleed automatically, warning the user of potential white edges.
