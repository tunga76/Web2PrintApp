# Reprint and Defective Product Rules (Web-To-Print)

## Core Principles

- **No Traditional Returns:** Personalized and custom-printed goods possess zero resale value. Therefore, traditional "Return to Warehouse" flows are inefficient and costly. The standard resolution for a valid customer complaint is a **Reprint**, not a physical return.
- **Root Cause Analysis:** Before authorizing a reprint or refund, the system must capture enough evidence to determine if the fault lies with the Factory (e.g., color shift, guillotine miscut) or the Customer (e.g., spelling error, low-res upload).

## Complaint & Evidence Flow

- **Photo Proof Mandatory:** To initiate a complaint (Return Request), the customer UI MUST enforce the upload of at least one clear photograph showing the defect (e.g., a photo of the miscut business cards next to a ruler).
- **Physical Disposal:** Customers are generally instructed to recycle or dispose of the defective items. The system should NOT automatically generate a "Return Shipping Label" unless physical inspection by Quality Assurance is strictly required for high-value disputes.

## Factory Error: The Reprint Workflow

- **Zero-Cost Cloning:** If customer service approves a factory-fault complaint, the system must automatically clone the original `OrderLineItem` into a new **Reprint Order**.
- **Pricing & SLA:** The Reprint Order must have a total cost of `$0.00` to the customer. It must bypass standard payment gateways and be pushed directly to the `InProduction` status with an escalated priority/SLA to minimize customer dissatisfaction.
- **Design Immutability:** The Reprint Order MUST use the exact same `DesignId` as the original order. If the design itself needs changing, it is a new order, not a reprint.

## Customer Error Policy

- **No Free Refunds:** If the evidence shows the error was present in the customer's approved digital proof (e.g., a typo they missed during the Checkout Approval step), the platform is not legally obligated to refund or reprint for free.
- **Goodwill Discount:** The Campaign/Return engine should support generating a one-time "Goodwill Store Credit" or a specific promo code (e.g., 50% off) to help the customer fix their mistake and place a new order without bearing the full financial penalty.
