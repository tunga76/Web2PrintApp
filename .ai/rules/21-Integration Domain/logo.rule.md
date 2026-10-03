# Logo ERP Integration Rules

## Core Principles

- **Logo Objects (LBS):** Integration with Logo (Tiger, Go) is often achieved via Logo Objects or REST APIs (Logo Flow/j-Platform).
- **Current Accounts (Cari):** Every B2B customer and every B2C order requires a "Cari Hesap" (Current Account) record. For B2C, a generic "Web Customer" Cari is often used, while B2B users require 1-to-1 mapping with their Tax IDs (VKN/TCKN).

## Orders (Sipariş) & Invoicing (Fatura)

- **Fiche (Fiş) Generation:** The e-commerce system must create "Satış Sipariş Fişi" (Sales Order Fiche).
- **Campaigns:** If a discount was applied on the web, it must be mapped to the exact "Indirim Satırı" (Discount Line) in the Logo fiche, ensuring the net total matches down to the penny. Logo's rounding logic must be mirrored perfectly to avoid integration errors.
