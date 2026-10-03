# Stock Adjustment Rules

## Core Principles

- **No Manual Overrides:** Never allow users/admins to simply type a new arbitrary number for stock levels (e.g., changing 50 to 40 directly).
- **Delta/Journal Entries:** All stock changes must be made via adjustment entries (deltas). To change stock from 50 to 40, create an adjustment entry of `-10` with a specific `ReasonCode`.

## Reason Codes

- Every adjustment must have a mandatory `ReasonCode` (e.g., "Damage", "Theft", "Count Discrepancy", "Return to Supplier").
- This ensures full financial traceability, as inventory equates directly to company assets.

## Counting (Stocktake)

- Support periodic cycle counts or full physical inventory counts. Discrepancies discovered during a count must generate automated Adjustment records to reconcile the physical reality with the digital ledger.
