# Address Book Rules

## Core Principles

- **Normalization:** Customer addresses must be stored in a dedicated `CustomerAddress` table, linked to the `CustomerId`.
- **Defaults:** A customer can have multiple addresses but should be able to designate one "Default Billing Address" and one "Default Shipping Address" to streamline the checkout process.

## Validation & Structure

- Enforce standard address fields (e.g., Country, State/Province, City, Postal Code, Address Line 1).
- **No Impact on Orders:** Modifying or deleting an address in the Address Book MUST NOT alter the shipping/billing addresses of historically placed orders (see Order Domain rules regarding Address Snapshotting).
