# SAP Integration Rules

## Core Principles

- **BAPI / IDoc:** SAP integrations typically rely on BAPIs (Business Application Programming Interfaces) via RFC, or IDocs (Intermediate Documents) for asynchronous messaging. The integration layer must be capable of generating and parsing these structures.
- **Strict Validation:** SAP is highly rigid. If a customer address is missing a mandatory region code required by SAP, the entire order import will fail. The e-commerce frontend MUST replicate SAP's mandatory field validations to prevent integration queues from backing up with failed orders.

## Material and Customer Masters

- **Materials (Products):** SAP is the source of truth for the Material Master. The e-commerce platform should ingest Material updates (Pricing, EAN, Weight) asynchronously.
- **Customer (Debtor):** For B2B, customers must exist as Debtors in SAP. The e-commerce platform must map its internal `UserId` to the SAP `KUNNR` (Customer Number).
