# Production Workflow Rules

## Core Principles

- **State Machine:** Print jobs follow a strict, physical state machine: `Awaiting Artwork` -> `Preflight` -> `Prepress Approval` -> `In Queue` -> `Printing` -> `Post-Press/Finishing` -> `Packaging` -> `Ready for Shipment`.
- **Barcode Tracking:** Use barcodes on job tickets (İş Emri) so factory workers can scan a job to instantly move its state in the workflow engine, triggering updates back to the e-commerce Order domain.
