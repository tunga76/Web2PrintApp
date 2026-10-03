# Invoice Rules

## Core Principles

- **Legal Document:** An invoice is a strict legal and tax document. Its format and generation must comply with local tax authority regulations (e.g., e-Fatura in Turkey, VAT invoices in the EU).
- **Immutability:** Once an invoice is generated and assigned an Invoice Number, it MUST NEVER be altered or deleted. If a mistake was made, a formal "Credit Note" or "Return Invoice" must be issued to offset it.

## Generation Timing

- Invoices should typically be generated and finalized at the moment of `Capture` or when the order is marked as `Shipped` (depending on local jurisdiction), not immediately when the cart is submitted.

## Content Requirements

- Include merchant/customer tax identifiers, tax breakdown, numbering, and transaction timestamps required by the applicable jurisdiction and invoicing provider. Preserve issued invoice records and follow the configured legal numbering and correction process; confirm whether gapless numbering applies before making it a requirement.
