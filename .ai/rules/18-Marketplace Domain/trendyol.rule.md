# Trendyol Integration Rules

## Core Principles

- **Provider Documentation:** Confirm barcode, cargo, invoice-submission, and status-mapping requirements against current official documentation and the connected merchant account. Record the documentation URL and verification date; examples in this file depend on the enabled workflow.

- **Barcode as Key:** Trendyol heavily relies on Barcodes (Barkod) as the primary identifier. Ensure all variants pushed to Trendyol have unique and valid barcodes.
- **Category & Attribute Mapping:** Trendyol has highly specific and mandatory category attributes. The integration must support mapping internal attributes (e.g., "Size", "Color") directly to Trendyol's required attribute IDs.

## Orders & Shipping

- **Cargo Providers:** Trendyol manages cargo integrations strictly. The Hub must import the Trendyol-assigned "Cargo Tracking Number" (Kargo Takip No) and "Campaign Number" (Kampanya No) and print these directly on the labels.
- **Invoice Upload:** The system must automatically generate the e-Archive/e-Invoice (e-Arşiv/e-Fatura) and push the PDF/XML back to Trendyol's API as soon as the order is billed.
