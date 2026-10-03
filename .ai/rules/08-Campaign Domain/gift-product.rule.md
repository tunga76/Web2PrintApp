# Gift Product Rules

## Core Principles

- Gift products are free items added to the cart based on specific criteria.
- Gift items must be tracked with a zero price ($0.00) but should retain their original value for analytics.

## Allocation Rules

- **Auto-add vs Manual selection:** Some gifts are automatically added to the cart, while others allow the user to choose from a selection of gifts.
- Gift stock must be validated. If the gift is out of stock, the campaign should gracefully degrade (e.g., show a message or substitute the gift).

## Conditions

- Spend over $X, get Y as a gift.
- Buy product A, get product B as a gift.
- First order gift.

## Cart and Order Integrity

- If the condition that granted the gift is removed (e.g., the customer lowers cart amount below threshold), the gift must be automatically removed from the cart.
- Return/Refund policies must account for gifts. If returning the qualifying item, the gift must either be returned or charged at full price.

## Display

- Gift products in the cart should have a distinctive "Free Gift" label.
- Show the regular price with a strikethrough, and the final price as "Free" or $0.00.
