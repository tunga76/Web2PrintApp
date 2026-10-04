-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "CustomerAccountType" AS ENUM ('PERSONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "AccountMemberRole" AS ENUM ('OWNER', 'MANAGER', 'BUYER', 'BILLING');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PriceModifierType" AS ENUM ('NONE', 'FIXED', 'PER_UNIT', 'PERCENTAGE_BPS');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'IN_PRODUCTION', 'PARTIALLY_SHIPPED', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE');

-- CreateEnum
CREATE TYPE "ArtworkStatus" AS ENUM ('UPLOADING', 'UPLOADED', 'VALIDATING', 'REVIEW_REQUIRED', 'APPROVED', 'REJECTED', 'QUARANTINED');

-- CreateEnum
CREATE TYPE "ProofStatus" AS ENUM ('PREPARING', 'AWAITING_CUSTOMER', 'APPROVED', 'CHANGES_REQUESTED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ManufacturingMethod" AS ENUM ('OWN_PRODUCTION', 'PRINT_PARTNER', 'UNASSIGNED');

-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('AWAITING_ARTWORK', 'ARTWORK_REVIEW', 'AWAITING_PROOF_APPROVAL', 'READY_FOR_PRODUCTION', 'IN_PRODUCTION', 'FINISHING', 'PACKAGING', 'READY_TO_SHIP', 'COMPLETE', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PREPARING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'EXCEPTION', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliverySpeed" AS ENUM ('STANDARD', 'EXPRESS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160),
    "email" VARCHAR(254),
    "emailVerified" TIMESTAMP(3),
    "image" VARCHAR(2048),
    "passwordHash" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "sessionVersion" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" VARCHAR(128) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "encryptedSecret" BYTEA NOT NULL,
    "encryptionKeyVersion" VARCHAR(64) NOT NULL,
    "enabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mfa_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_accounts" (
    "id" TEXT NOT NULL,
    "type" "CustomerAccountType" NOT NULL,
    "displayName" VARCHAR(160) NOT NULL,
    "legalName" VARCHAR(200),
    "vatNumber" VARCHAR(32),
    "companyNumber" VARCHAR(32),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_account_members" (
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AccountMemberRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_account_members_pkey" PRIMARY KEY ("accountId","userId")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "label" VARCHAR(80) NOT NULL,
    "recipient" VARCHAR(160) NOT NULL,
    "company" VARCHAR(200),
    "line1" VARCHAR(200) NOT NULL,
    "line2" VARCHAR(200),
    "city" VARCHAR(120) NOT NULL,
    "region" VARCHAR(120),
    "postcode" VARCHAR(16) NOT NULL,
    "countryCode" CHAR(2) NOT NULL DEFAULT 'GB',
    "phone" VARCHAR(32),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "sku" VARCHAR(64) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "shortDescription" VARCHAR(500),
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "vatRateBps" INTEGER NOT NULL DEFAULT 2000,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "objectKey" VARCHAR(1024) NOT NULL,
    "altText" VARCHAR(240) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_groups" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(300),
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "allowMultiple" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_option_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_values" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "description" VARCHAR(300),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "modifierType" "PriceModifierType" NOT NULL DEFAULT 'NONE',
    "modifierValue" BIGINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_incompatibilities" (
    "id" TEXT NOT NULL,
    "leftValueId" TEXT NOT NULL,
    "rightValueId" TEXT NOT NULL,
    "reason" VARCHAR(240),

    CONSTRAINT "product_option_incompatibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_price_tiers" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "basePriceMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'GBP',
    "vatRateBps" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_price_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_methods" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(48) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(300),
    "speed" "DeliverySpeed" NOT NULL,
    "priceNetMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'GBP',
    "vatRateBps" INTEGER NOT NULL DEFAULT 2000,
    "estimatedDaysMin" INTEGER NOT NULL,
    "estimatedDaysMax" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "customerAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'GBP',
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_lines" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceTierId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "configurationHash" VARCHAR(64) NOT NULL,
    "configurationSnapshot" JSONB NOT NULL,
    "lineNetMinor" BIGINT NOT NULL,
    "vatRateBps" INTEGER NOT NULL,
    "vatMinor" BIGINT NOT NULL,
    "lineGrossMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'GBP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_line_options" (
    "cartLineId" TEXT NOT NULL,
    "optionValueId" TEXT NOT NULL,

    CONSTRAINT "cart_line_options_pkey" PRIMARY KEY ("cartLineId","optionValueId")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" VARCHAR(32) NOT NULL,
    "customerAccountId" TEXT NOT NULL,
    "placedByUserId" TEXT NOT NULL,
    "cartId" TEXT,
    "deliveryMethodId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "customerEmailSnapshot" VARCHAR(254) NOT NULL,
    "billingAddressSnapshot" JSONB NOT NULL,
    "shippingAddressSnapshot" JSONB NOT NULL,
    "subtotalNetMinor" BIGINT NOT NULL,
    "taxMinor" BIGINT NOT NULL,
    "deliveryNetMinor" BIGINT NOT NULL,
    "deliveryVatMinor" BIGINT NOT NULL,
    "totalGrossMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'GBP',
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_lines" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceTierId" TEXT,
    "productNameSnapshot" VARCHAR(180) NOT NULL,
    "productSkuSnapshot" VARCHAR(64) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "configurationSnapshot" JSONB NOT NULL,
    "lineNetMinor" BIGINT NOT NULL,
    "vatRateBps" INTEGER NOT NULL,
    "vatMinor" BIGINT NOT NULL,
    "lineGrossMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'GBP',
    "manufacturingMethod" "ManufacturingMethod" NOT NULL DEFAULT 'UNASSIGNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_line_artwork" (
    "cartLineId" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,

    CONSTRAINT "cart_line_artwork_pkey" PRIMARY KEY ("cartLineId","artworkId")
);

-- CreateTable
CREATE TABLE "order_line_artwork" (
    "orderLineId" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,

    CONSTRAINT "order_line_artwork_pkey" PRIMARY KEY ("orderLineId","artworkId")
);

-- CreateTable
CREATE TABLE "artwork_assets" (
    "id" TEXT NOT NULL,
    "customerAccountId" TEXT NOT NULL,
    "uploadedByUserId" TEXT NOT NULL,
    "storageProvider" VARCHAR(48) NOT NULL,
    "bucket" VARCHAR(255) NOT NULL,
    "objectKey" VARCHAR(1024) NOT NULL,
    "originalFilename" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(127) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "sha256" CHAR(64),
    "status" "ArtworkStatus" NOT NULL DEFAULT 'UPLOADING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "artwork_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artwork_proofs" (
    "id" TEXT NOT NULL,
    "orderLineId" TEXT NOT NULL,
    "sourceArtworkId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ProofStatus" NOT NULL DEFAULT 'PREPARING',
    "proofObjectKey" VARCHAR(1024),
    "reviewNotes" TEXT,
    "customerResponse" TEXT,
    "reviewedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artwork_proofs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_jobs" (
    "id" TEXT NOT NULL,
    "orderLineId" TEXT NOT NULL,
    "status" "ProductionStatus" NOT NULL DEFAULT 'AWAITING_ARTWORK',
    "manufacturingMethod" "ManufacturingMethod" NOT NULL DEFAULT 'UNASSIGNED',
    "partnerName" VARCHAR(160),
    "assignedToUserId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_status_events" (
    "id" TEXT NOT NULL,
    "productionJobId" TEXT NOT NULL,
    "fromStatus" "ProductionStatus",
    "toStatus" "ProductionStatus" NOT NULL,
    "actorUserId" TEXT,
    "note" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_status_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "amountMinor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'GBP',
    "idempotencyKey" VARCHAR(255) NOT NULL,
    "stripeCheckoutSessionId" VARCHAR(255),
    "stripePaymentIntentId" VARCHAR(255),
    "failureCode" VARCHAR(100),
    "failureMessage" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "succeededAt" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "stripeEventId" VARCHAR(255),
    "eventType" VARCHAR(160) NOT NULL,
    "previousStatus" "PaymentStatus",
    "nextStatus" "PaymentStatus",
    "message" VARCHAR(500),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_webhook_receipts" (
    "id" TEXT NOT NULL,
    "stripeEventId" VARCHAR(255) NOT NULL,
    "eventType" VARCHAR(160) NOT NULL,
    "objectId" VARCHAR(255),
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" VARCHAR(500),

    CONSTRAINT "stripe_webhook_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PREPARING',
    "carrierName" VARCHAR(120),
    "trackingNumber" VARCHAR(160),
    "trackingUrl" VARCHAR(2048),
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "note" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" VARCHAR(120) NOT NULL,
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" VARCHAR(191) NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "requestId" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_deletedAt_idx" ON "users"("role", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_expiresAt_idx" ON "password_reset_tokens"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_credentials_userId_key" ON "mfa_credentials"("userId");

-- CreateIndex
CREATE INDEX "customer_accounts_type_deletedAt_idx" ON "customer_accounts"("type", "deletedAt");

-- CreateIndex
CREATE INDEX "customer_account_members_userId_role_idx" ON "customer_account_members"("userId", "role");

-- CreateIndex
CREATE INDEX "customer_addresses_accountId_deletedAt_idx" ON "customer_addresses"("accountId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_isActive_sortOrder_idx" ON "categories"("parentId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_status_deletedAt_sortOrder_idx" ON "products"("status", "deletedAt", "sortOrder");

-- CreateIndex
CREATE INDEX "products_categoryId_status_idx" ON "products"("categoryId", "status");

-- CreateIndex
CREATE INDEX "product_images_productId_sortOrder_idx" ON "product_images"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "product_option_groups_productId_isActive_sortOrder_idx" ON "product_option_groups"("productId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_option_groups_productId_code_key" ON "product_option_groups"("productId", "code");

-- CreateIndex
CREATE INDEX "product_option_values_groupId_isActive_sortOrder_idx" ON "product_option_values"("groupId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "product_option_values_groupId_code_key" ON "product_option_values"("groupId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "product_option_incompatibilities_leftValueId_rightValueId_key" ON "product_option_incompatibilities"("leftValueId", "rightValueId");

-- CreateIndex
CREATE INDEX "product_price_tiers_productId_isActive_startsAt_endsAt_idx" ON "product_price_tiers"("productId", "isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "product_price_tiers_productId_quantity_key" ON "product_price_tiers"("productId", "quantity");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_methods_code_key" ON "delivery_methods"("code");

-- CreateIndex
CREATE INDEX "delivery_methods_isActive_speed_sortOrder_idx" ON "delivery_methods"("isActive", "speed", "sortOrder");

-- CreateIndex
CREATE INDEX "carts_customerAccountId_status_updatedAt_idx" ON "carts"("customerAccountId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "carts_userId_status_idx" ON "carts"("userId", "status");

-- CreateIndex
CREATE INDEX "cart_lines_cartId_createdAt_idx" ON "cart_lines"("cartId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cart_lines_cartId_configurationHash_key" ON "cart_lines"("cartId", "configurationHash");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "orders_cartId_key" ON "orders"("cartId");

-- CreateIndex
CREATE INDEX "orders_customerAccountId_placedAt_idx" ON "orders"("customerAccountId", "placedAt");

-- CreateIndex
CREATE INDEX "orders_placedByUserId_placedAt_idx" ON "orders"("placedByUserId", "placedAt");

-- CreateIndex
CREATE INDEX "orders_status_placedAt_idx" ON "orders"("status", "placedAt");

-- CreateIndex
CREATE INDEX "order_lines_orderId_idx" ON "order_lines"("orderId");

-- CreateIndex
CREATE INDEX "order_lines_productId_idx" ON "order_lines"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "artwork_assets_objectKey_key" ON "artwork_assets"("objectKey");

-- CreateIndex
CREATE INDEX "artwork_assets_customerAccountId_status_createdAt_idx" ON "artwork_assets"("customerAccountId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "artwork_proofs_status_createdAt_idx" ON "artwork_proofs"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "artwork_proofs_orderLineId_version_key" ON "artwork_proofs"("orderLineId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "production_jobs_orderLineId_key" ON "production_jobs"("orderLineId");

-- CreateIndex
CREATE INDEX "production_jobs_status_priority_dueAt_idx" ON "production_jobs"("status", "priority", "dueAt");

-- CreateIndex
CREATE INDEX "production_status_events_productionJobId_createdAt_idx" ON "production_status_events"("productionJobId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotencyKey_key" ON "payments"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeCheckoutSessionId_key" ON "payments"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "payments_orderId_attempt_idx" ON "payments"("orderId", "attempt");

-- CreateIndex
CREATE INDEX "payments_status_createdAt_idx" ON "payments"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payment_events_stripeEventId_key" ON "payment_events"("stripeEventId");

-- CreateIndex
CREATE INDEX "payment_events_paymentId_createdAt_idx" ON "payment_events"("paymentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_webhook_receipts_stripeEventId_key" ON "stripe_webhook_receipts"("stripeEventId");

-- CreateIndex
CREATE INDEX "stripe_webhook_receipts_processedAt_receivedAt_idx" ON "stripe_webhook_receipts"("processedAt", "receivedAt");

-- CreateIndex
CREATE INDEX "shipments_orderId_status_idx" ON "shipments"("orderId", "status");

-- CreateIndex
CREATE INDEX "shipments_trackingNumber_idx" ON "shipments"("trackingNumber");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entityType_entityId_createdAt_idx" ON "admin_audit_logs"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_actorUserId_createdAt_idx" ON "admin_audit_logs"("actorUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_credentials" ADD CONSTRAINT "mfa_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_account_members" ADD CONSTRAINT "customer_account_members_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "customer_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_account_members" ADD CONSTRAINT "customer_account_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "customer_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_groups" ADD CONSTRAINT "product_option_groups_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_values" ADD CONSTRAINT "product_option_values_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "product_option_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_incompatibilities" ADD CONSTRAINT "product_option_incompatibilities_leftValueId_fkey" FOREIGN KEY ("leftValueId") REFERENCES "product_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_incompatibilities" ADD CONSTRAINT "product_option_incompatibilities_rightValueId_fkey" FOREIGN KEY ("rightValueId") REFERENCES "product_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_price_tiers" ADD CONSTRAINT "product_price_tiers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_lines" ADD CONSTRAINT "cart_lines_priceTierId_fkey" FOREIGN KEY ("priceTierId") REFERENCES "product_price_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_line_options" ADD CONSTRAINT "cart_line_options_cartLineId_fkey" FOREIGN KEY ("cartLineId") REFERENCES "cart_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_line_options" ADD CONSTRAINT "cart_line_options_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "product_option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_placedByUserId_fkey" FOREIGN KEY ("placedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_deliveryMethodId_fkey" FOREIGN KEY ("deliveryMethodId") REFERENCES "delivery_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_priceTierId_fkey" FOREIGN KEY ("priceTierId") REFERENCES "product_price_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_line_artwork" ADD CONSTRAINT "cart_line_artwork_cartLineId_fkey" FOREIGN KEY ("cartLineId") REFERENCES "cart_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_line_artwork" ADD CONSTRAINT "cart_line_artwork_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artwork_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_artwork" ADD CONSTRAINT "order_line_artwork_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_line_artwork" ADD CONSTRAINT "order_line_artwork_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artwork_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artwork_assets" ADD CONSTRAINT "artwork_assets_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "customer_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artwork_assets" ADD CONSTRAINT "artwork_assets_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artwork_proofs" ADD CONSTRAINT "artwork_proofs_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artwork_proofs" ADD CONSTRAINT "artwork_proofs_sourceArtworkId_fkey" FOREIGN KEY ("sourceArtworkId") REFERENCES "artwork_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artwork_proofs" ADD CONSTRAINT "artwork_proofs_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artwork_proofs" ADD CONSTRAINT "artwork_proofs_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_jobs" ADD CONSTRAINT "production_jobs_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "order_lines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_jobs" ADD CONSTRAINT "production_jobs_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_status_events" ADD CONSTRAINT "production_status_events_productionJobId_fkey" FOREIGN KEY ("productionJobId") REFERENCES "production_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
