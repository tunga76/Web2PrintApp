# Design Portfolio and Reorder Rules (Web-To-Print)

## Core Principles

- **Designs over Wishlists:** In Web-To-Print, the true value of a user's account is their history of personalized designs. A robust "My Designs" or "My Projects" portfolio drives significantly higher retention than a standard product wishlist.
- **Seamless Reordering:** B2B customers frequently order the exact same printed materials (e.g., business cards, restaurant menus) months apart. The system must make reordering an effortless 1-click process.

## Design Portfolio Management

- **Save for Later:** Users must be able to save a working design (either from the Canvas Editor or an uploaded PDF) to their account profile without immediately adding it to the cart.
- **Brand Assets Library:** B2B accounts should have a persistent "File Library" (Dosya Yöneticisi) to upload and store frequently used assets (e.g., Company Logos, Brand Fonts, Vector Graphics) so they do not have to re-upload them for every new product they design.
- **Drafts vs. Finalized:** The portfolio must visually distinguish between "Drafts" (unfinished, un-ordered designs) and "Completed Designs" (designs that have been successfully printed and delivered in the past).

## Reordering (Tekrar Sipariş) Workflow

- **Price Recalculation:** When a user clicks "Reorder" on a design from 6 months ago, the system MUST recalculate the cart total based on today's current matrix pricing and material costs, rather than blindly applying the historical price.
- **Option Validation:** The system must verify that the print options used in the old design (e.g., a specific "Textured Paper") are still active and available in the catalog. If an option is discontinued, the user must be warned and prompted to update their selection before checking out.
- **Immutable History:** Reordering a past design must create a *copy* (new version) of the `DesignId` for the new cart line item. This ensures that if the user tweaks the reordered design slightly (e.g., changing a phone number on an old business card), it does not retrospectively alter the historical archive of their original order.
