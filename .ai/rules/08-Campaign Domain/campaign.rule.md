# Campaign Rules

## Core Principles

- Campaign engine must run autonomously and evaluate conditions on every cart modification.
- Campaigns must be applied in a deterministic order based on Priority.
- Campaign calculations must happen exclusively on the backend to ensure security.

## Campaign Types Supported

- Percentage Discount (e.g., 20% off)
- Fixed Amount Discount (e.g., $50 off)
- Buy X Get Y (e.g., Buy 2 Get 1 Free)
- Free Shipping
- Bundle / Kit pricing
- Category Specific Campaigns
- Brand Specific Campaigns
- Tiered Campaigns (Spend $100 get 10%, Spend $200 get 20%)

## Conditions and Constraints

- Date Range (Start Date / End Date)
- Minimum Cart Total
- Minimum Item Quantity
- Customer Segments (e.g., VIP, New User)
- Geolocation / Region limits
- Payment Method specific
- Platform specific (Web vs Mobile App)

## Concurrency & Conflicts

- By default, multiple campaigns should not combine unless explicitly flagged as `IsCombinable`.
- If multiple non-combinable campaigns match, the one offering the highest discount to the customer applies.

## Performance

- Campaign rules must be optimized for fast evaluation (Cart evaluation must be < 50ms).
- Avoid N+1 queries when fetching applicable campaigns for the catalog or cart.
