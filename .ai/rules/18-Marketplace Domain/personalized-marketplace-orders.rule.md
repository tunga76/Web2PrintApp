# Personalized Marketplace Orders Rules (Web-To-Print)

## Core Principles

- **No Native Editors on Marketplaces:** Third-party marketplaces (Trendyol, Amazon, Etsy, Hepsiburada) do not support interactive Web-To-Print canvas editors on their product pages. 
- **Decoupled Workflow:** The order ingestion process from marketplaces must be completely decoupled from the print production process. Orders for customizable products must NOT go directly to the factory floor without a validated design file.

## Ingestion and Status Halting

- **Pending Artwork Status:** When an API sync pulls an order from a marketplace, the system must check if the mapped product has `isCustomizable == true`. If yes, the order MUST be placed into an `AwaitingArtwork` (Tasarım/Dosya Bekliyor) status, completely bypassing the standard `InProduction` trigger.
- **Data Extraction:** The integration must map marketplace-specific notes (e.g., Etsy Personalization text, Trendyol Order Notes) into a dedicated `PersonalizationText` field on the `OrderLineItem` so graphic designers know exactly what the customer requested.

## Graphic Design / Manual Intervention

- **Operator Upload:** The Admin Panel must provide a UI for internal Graphic Designers or Customer Service Agents to read the customer's marketplace notes/messages, create the design manually (e.g., via Illustrator or Photoshop), and upload the final PDF to the `OrderLineItem`.
- **Status Advancement:** Only AFTER a valid print file (`DesignId` or `UploadedFileId`) is manually attached to the marketplace order can the order status be advanced to `PreFlight` or `InProduction`.

## Automation (Advanced)

- **Text-to-Print Automation:** For simple text-only customizations (e.g., "Print Name: Ali" on a mug), the system can optionally use an automated background worker to dynamically generate the PDF using a preset template and the extracted `PersonalizationText`. If successful, the system can automatically attach the PDF and push the order to `InProduction`, saving operator time.
