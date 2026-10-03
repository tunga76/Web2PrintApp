# Mikro ERP Integration Rules

## Core Principles

- **Database Direct vs API:** While historical Mikro integrations relied on direct SQL Server DB injections (writing to `SIPARISLER` tables), modern implementations MUST use Mikro's standard APIs (Mikro Jump/Fly APIs) or import XML/JSON files to ensure business logic and triggers fire correctly.
- **Stock Codes:** Mikro relies heavily on exact `Stok Kodu` matching. Ensure the E-commerce `SKU` is a 1:1 match with the Mikro `Stok Kodu`.

## E-Document (e-Belge) Compliance

- Mikro is often used as the e-Fatura/e-Arşiv integrator in Turkey. The E-commerce platform should push the Order data to Mikro, allowing Mikro to generate the official e-Document and return the `ETTN` (Universal Unique Identifier) and Document Number back to the E-commerce platform for customer display.
