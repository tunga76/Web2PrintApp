# Order Merge Rules

## Core Principles

- **Efficiency Strategy:** If a customer places two separate orders within a short time frame, heading to the exact same shipping address, and neither has been picked yet, the warehouse might merge them to save on shipping costs.
- **Complexity Warning:** Merging orders post-payment is highly complex due to financial reporting, differing tax calculations, and payment gateway references. 

## Best Practices

- **Avoid Logical Merge:** Generally, avoid merging the logical Order records in the database. 
- **Fulfillment Merge:** Instead, allow the WMS to pack items from Order A and Order B into a single physical box, sharing a single tracking number, while keeping the digital Order records separate and distinct in the database.
