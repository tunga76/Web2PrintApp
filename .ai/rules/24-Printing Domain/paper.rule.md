# Paper Rules

## Core Principles

- **Material Definitions:** Paper is the core raw material. The system must track `PaperType` (e.g., Coated/Kuşe, Uncoated/1. Hamur, Kraft) and `Weight` in Grams per Square Meter (GSM / gr/m2).
- **Print Compatibility:** Not all papers can run on all presses. The domain must link Paper Types to valid `PressTypes` (e.g., Digital vs Offset).

## Stock and Cost

- For true W2P ERP integration, paper isn't just an attribute; it's a raw material inventory item (Sheets or Rolls). However, for the e-commerce storefront, it is primarily a pricing and configurator driver.
