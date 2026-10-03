# Compare List Rules

## Core Principles

- **Session-Based UI Feature:** Unlike wishlists, compare lists are usually short-lived and heavily session-dependent. They are used to view technical specs side-by-side.
- **Category Restriction:** Comparing items generally only makes sense within the same primary category (e.g., comparing two laptops). The system may enforce rules preventing the comparison of completely unrelated items (e.g., a laptop and a t-shirt).

## Attribute Handling

- The frontend must dynamically pivot the data, grouping by `ProductAttribute` keys to build the comparison table grid. This requires the API to return fully expanded attribute sets for the requested products efficiently.
