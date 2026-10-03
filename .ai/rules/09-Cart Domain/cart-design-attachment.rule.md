# Cart Design Attachment Rules (Web-To-Print)

## Core Principles

- **Design-Cart Linkage:** In a Web-to-Print platform, a cart line item is not just a Product ID and Quantity. For customizable products, it MUST be uniquely linked to a user-generated design or an uploaded print file.
- **Immutability of Finished Designs:** Once a design is attached to a cart line item and the order is placed, that specific version of the design must become immutable to ensure the production facility prints exactly what the user approved.

## Cart Addition & Validation

- **Missing Attachment Prevention:** If a product is marked as `isCustomizable = true`, the Backend API must reject any "Add to Cart" request that does not include a valid `DesignId` or `UploadedFileId`.
- **Upload Completion Check:** The Frontend must disable the "Proceed to Checkout" button if any background file uploads (e.g., high-res PDF uploads to S3) linked to the cart items are still pending or have failed. Do not allow a checkout with a broken or missing print file.

## Editing Designs from the Cart

- **Versioning (Save as New):** When a user clicks "Edit Design" on an item already in their cart, the system must NOT overwrite the original design file directly. Instead, it should create a new branch/version of the design. 
  - *Reason:* The user might abandon the edit and want to keep the original cart item, or they might be editing a design that was previously ordered. Overwriting could corrupt past orders or the current stable cart state.
- **Cart Line Update:** Once the user saves the edited design, the specific `CartLineItem` must be updated to point to the new `DesignId`/version, and the price must be recalculated in case the edit changed any print options (e.g., adding Gold Foil during the edit).

## Preview Display

- **Visual Confirmation:** Every customizable item in the cart MUST display a generated mockup/thumbnail of the user's specific design, not the generic product image. This serves as a final visual confirmation and drastically reduces customer errors before checkout.
