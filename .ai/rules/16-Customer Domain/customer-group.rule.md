# Customer Group Rules

## Core Principles

- **Segmentation:** Customers can be assigned to one or more Customer Groups (e.g., `B2B`, `VIP`, `Employee`, `Wholesale`).
- **Domain Impact:** Customer Groups act as key drivers for other domains:
  - **Pricing:** A group might have access to a specific Price List.
  - **Campaigns:** Campaigns and Coupons can be restricted to specific groups.
  - **Catalog:** Certain categories or products might only be visible/purchasable by specific groups.

## Assignment

- Group assignment can be manual (via admin panel) or automated based on rules (e.g., "Spend > $1000 in a year -> auto-assign to VIP group"). Automated assignments should run as background jobs or respond to domain events.
