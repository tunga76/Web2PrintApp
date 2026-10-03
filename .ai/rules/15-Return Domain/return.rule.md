# Return Rules

## Core Principles

- **Eligibility:** The system must strictly enforce Return Policies (e.g., "14 days from Delivery date"). Products marked as "Non-Returnable" (e.g., personalized items, hygiene products) must be blocked from the return workflow.
- **Independence:** A Return Request (RMA - Return Merchandise Authorization) is a distinct entity linked to an Order. An order can have multiple sequential RMAs if the customer returns items piecemeal.

## Inspection & Acceptance

- **Warehouse Approval:** A return is not finalized until the returned physical goods undergo "Inspection" at the warehouse. 
- **Condition Grading:** The system should support grading returned items (e.g., `Mint`, `Damaged_Packaging`, `Defective`). Defective items are NOT added back to `AvailableStock`; they are moved to a `Quarantine` or `Scrap` warehouse.

## Financials

- The Return process orchestration coordinates the physical receipt of goods (Inventory Domain) with the financial reimbursement (Payment Domain).
- Shipping fees (both original and return labels) must be explicitly managed (deducted from refund or absorbed by the merchant) based on the Return Reason (e.g., "Defective" vs "Changed my mind").
