# Cart Add Workflow

## Goal

Implement Add To Cart functionality using enterprise ecommerce standards.

Reference behaviours:

- Amazon
- Trendyol
- Hepsiburada
- N11
- Walmart

---

## Business Rules

Product can not be added if:

- Product is passive
- Product is deleted
- Product stock is zero
- Product variant does not exist
- Product sales is stopped
- Product tenant is different

---

## Required Validations

Validate in order:

1. Product Exists
2. Product Active
3. Variant Exists
4. Variant Active
5. Stock Available
6. Purchase Limits
7. Campaign Rules
8. Tenant Access

Return business errors.

Never return success if validation fails.

---

## Stock Rules

Do not trust frontend quantity.

Always check current stock.

Example:

Stock = 5
Cart = 3
Request = 4

Result:

Reject

Message:

Requested quantity exceeds stock.

---

## Quantity Rules

Minimum quantity support.

Example:

MinQuantity = 10

Request = 5

Result:

Reject

---

Maximum quantity support.

Example:

MaxQuantity = 100

Request = 120

Result:

Reject

---

## Variant Rules

Variant must be fully selected.

Examples:

- Color
- Size
- Material
- Paper Type
- Finishing

Do not allow partial variant selection.

---

## Pricing Rules

Never use frontend price.

Always recalculate.

Source:

ProductPrice
VariantPrice
CampaignDiscount
CouponDiscount
VolumeDiscount
TenantSpecificPrice

Final price calculated on server.

---

## Campaign Rules

Campaign engine runs on every cart change.

Events:

CartCreated
ItemAdded
ItemRemoved
QuantityChanged

Recalculate:

- Discount
- Free shipping
- Gift products
- Buy X Get Y

---

## Multi Tenant Rules

Every query must contain:

TenantId

Never expose data from another tenant.

---

## Audit Rules

Log events:

CartCreated
CartItemAdded
CartItemUpdated
CartItemRemoved

Required fields:

UserId
SessionId
TenantId
ProductId
VariantId
Quantity
Timestamp

---

## Analytics Events

Emit events:

AddToCart

Payload:

UserId
TenantId
ProductId
VariantId
CategoryId
BrandId
Price
Quantity

---

## Performance Rules

Do not execute N+1 queries.

Use single query for:

Product
Variant
Stock
Price
Campaign

Prefer caching.

---

## Security Rules

Client cannot:

- Send final price
- Send discount
- Send tax

Server calculates all values.

Server is source of truth.

---

## Tests

Required:

- Product not found
- Product passive
- Variant not found
- Stock insufficient
- Campaign applied
- Coupon applied
- Multi tenant validation
- Concurrent cart update
- Add same item twice
- Quantity update

Minimum coverage:

90%