'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN' || !session.user.id) throw new Error('Administrator access required.');
  return session.user.id;
}

async function requireProductionStaff() {
  const session = await auth();
  if (!session?.user?.id || !['ADMIN', 'PRODUCTION'].includes(session.user.role)) throw new Error('Production staff access required.');
  return session.user.id;
}

function isChecked(value: FormDataEntryValue | null) {
  return value === 'on' || value === 'true';
}

export async function updateProduct(formData: FormData) {
  const actorUserId = await requireAdmin();
  const parsed = z.object({
    id: z.string().min(1).max(40),
    name: z.string().trim().min(2).max(180),
    sku: z.string().trim().min(2).max(64).regex(/^[A-Za-z0-9_-]+$/),
    shortDescription: z.string().trim().max(500).optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
    vatRateBps: z.coerce.number().int().min(0).max(10_000),
    approvePricing: z.boolean(),
  }).safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    sku: formData.get('sku'),
    shortDescription: formData.get('shortDescription') || undefined,
    status: formData.get('status'),
    vatRateBps: formData.get('vatRateBps'),
    approvePricing: isChecked(formData.get('approvePricing')),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid product data.');

  const db = getDb();
  const productSlug = await db.$transaction(async (transaction) => {
    const before = await transaction.product.findUnique({ where: { id: parsed.data.id } });
    if (!before) throw new Error('Product not found.');
    const after = await transaction.product.update({
      where: { id: before.id },
      data: {
        name: parsed.data.name,
        sku: parsed.data.sku,
        shortDescription: parsed.data.shortDescription ?? null,
        status: parsed.data.status,
        vatRateBps: parsed.data.vatRateBps,
        isIndicativePricing: !parsed.data.approvePricing,
      },
    });
    await transaction.adminAuditLog.create({
      data: {
        actorUserId,
        action: parsed.data.approvePricing ? 'product.updated_and_pricing_approved' : 'product.updated',
        entityType: 'Product',
        entityId: before.id,
        before: { name: before.name, sku: before.sku, status: before.status, vatRateBps: before.vatRateBps, isIndicativePricing: before.isIndicativePricing },
        after: { name: after.name, sku: after.sku, status: after.status, vatRateBps: after.vatRateBps, isIndicativePricing: after.isIndicativePricing },
      },
    });
    return after.slug;
  });
  revalidatePath('/products');
  revalidatePath(`/products/${productSlug}`);
  revalidatePath('/admin/products');
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = z.object({
    categoryId: z.string().min(1).max(40),
    slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    sku: z.string().trim().min(2).max(64).regex(/^[A-Za-z0-9_-]+$/),
    name: z.string().trim().min(2).max(180),
    shortDescription: z.string().trim().max(500).optional(),
  }).safeParse({ categoryId: formData.get('categoryId'), slug: formData.get('slug'), sku: formData.get('sku'), name: formData.get('name'), shortDescription: formData.get('shortDescription') || undefined });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid product data.');
  const product = await getDb().product.create({
    data: {
      categoryId: parsed.data.categoryId,
      slug: parsed.data.slug,
      sku: parsed.data.sku,
      name: parsed.data.name,
      shortDescription: parsed.data.shortDescription ?? null,
      status: 'DRAFT',
      isIndicativePricing: true,
    },
    select: { id: true, slug: true },
  });
  redirect(`/admin/products/${product.id}`);
}

export async function createCategory(formData: FormData) {
  const actorUserId = await requireAdmin();
  const parsed = z.object({ slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(2).max(160) }).safeParse({ slug: formData.get('slug'), name: formData.get('name') });
  if (!parsed.success) throw new Error('Enter a valid category name and URL slug.');
  const category = await getDb().category.create({ data: parsed.data });
  await getDb().adminAuditLog.create({ data: { actorUserId, action: 'category.created', entityType: 'Category', entityId: category.id, after: { slug: category.slug, name: category.name } } });
  revalidatePath('/admin/products');
  revalidatePath('/products');
}

function parseMoneyToMinor(value: string) {
  const match = /^(\d{1,7})(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) return null;
  return BigInt(match[1]!) * 100n + BigInt((match[2] ?? '').padEnd(2, '0') || '0');
}

export async function saveProductOptionGroup(formData: FormData) {
  const actorUserId = await requireAdmin();
  const parsed = z.object({
    productId: z.string().min(1).max(40),
    code: z.string().trim().min(1).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().trim().min(1).max(120),
    required: z.boolean(),
    values: z.string().min(1).max(10_000),
  }).safeParse({ productId: formData.get('productId'), code: formData.get('code'), name: formData.get('name'), required: isChecked(formData.get('required')), values: formData.get('values') });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid option group.');
  const values = parsed.data.values.split(/\r?\n/).map((line) => {
    const match = /^\s*([a-z0-9]+(?:-[a-z0-9]+)*)\s*\|\s*(.{1,160}?)\s*\|\s*(\d{1,7}(?:\.\d{1,2})?)\s*$/.exec(line);
    if (!match) throw new Error('Each option line must be code | label | extra price in GBP.');
    const modifierValue = parseMoneyToMinor(match[3]!);
    if (modifierValue === null) throw new Error('Option extra prices must use GBP with up to two decimal places.');
    return { code: match[1]!, label: match[2]!, modifierValue };
  });
  if (values.length > 80 || new Set(values.map((value) => value.code)).size !== values.length) throw new Error('Option values must be unique, with at most 80 values per group.');

  const db = getDb();
  await db.$transaction(async (transaction) => {
    const product = await transaction.product.findUnique({ where: { id: parsed.data.productId }, select: { id: true } });
    if (!product) throw new Error('Product not found.');
    const group = await transaction.productOptionGroup.upsert({
      where: { productId_code: { productId: product.id, code: parsed.data.code } },
      update: { name: parsed.data.name, isRequired: parsed.data.required, isActive: true },
      create: { productId: product.id, code: parsed.data.code, name: parsed.data.name, isRequired: parsed.data.required },
      select: { id: true },
    });
    for (const [sortOrder, value] of values.entries()) {
      await transaction.productOptionValue.upsert({
        where: { groupId_code: { groupId: group.id, code: value.code } },
        update: { label: value.label, modifierType: value.modifierValue === 0n ? 'NONE' : 'FIXED', modifierValue: value.modifierValue, isActive: true, sortOrder },
        create: { groupId: group.id, code: value.code, label: value.label, modifierType: value.modifierValue === 0n ? 'NONE' : 'FIXED', modifierValue: value.modifierValue, sortOrder },
      });
    }
    await transaction.productOptionValue.updateMany({
      where: { groupId: group.id, code: { notIn: values.map((value) => value.code) } },
      data: { isActive: false },
    });
    await transaction.adminAuditLog.create({
      data: {
        actorUserId,
        action: 'product.option_group_updated',
        entityType: 'ProductOptionGroup',
        entityId: group.id,
        after: { code: parsed.data.code, name: parsed.data.name, required: parsed.data.required, optionCount: values.length },
      },
    });
  });
  revalidatePath(`/admin/products/${parsed.data.productId}`);
  revalidatePath(`/products`);
}

export async function updatePriceTier(formData: FormData) {
  const actorUserId = await requireAdmin();
  const parsed = z.object({
    productId: z.string().min(1).max(40),
    quantity: z.coerce.number().int().positive().max(1_000_000),
    price: z.string().max(12),
    vatRateBps: z.union([z.literal(''), z.coerce.number().int().min(0).max(10_000)]),
  }).safeParse({ productId: formData.get('productId'), quantity: formData.get('quantity'), price: formData.get('price'), vatRateBps: formData.get('vatRateBps') ?? '' });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid price tier.');
  const basePriceMinor = parseMoneyToMinor(parsed.data.price);
  if (basePriceMinor === null || basePriceMinor === 0n) throw new Error('Enter a price greater than £0.00 with up to two decimal places.');

  const db = getDb();
  await db.$transaction(async (transaction) => {
    const product = await transaction.product.findUnique({ where: { id: parsed.data.productId }, select: { id: true } });
    if (!product) throw new Error('Product not found.');
    const key = { productId_quantity: { productId: product.id, quantity: parsed.data.quantity } };
    const before = await transaction.productPriceTier.findUnique({ where: key });
    const after = await transaction.productPriceTier.upsert({
      where: key,
      update: { basePriceMinor, vatRateBps: parsed.data.vatRateBps === '' ? null : parsed.data.vatRateBps, isActive: true, startsAt: new Date(), endsAt: null },
      create: { productId: product.id, quantity: parsed.data.quantity, basePriceMinor, vatRateBps: parsed.data.vatRateBps === '' ? null : parsed.data.vatRateBps },
    });
    await transaction.adminAuditLog.create({
      data: {
        actorUserId,
        action: 'product.price_tier_updated',
        entityType: 'ProductPriceTier',
        entityId: after.id,
        ...(before ? { before: { quantity: before.quantity, basePriceMinor: before.basePriceMinor.toString(), vatRateBps: before.vatRateBps } } : {}),
        after: { quantity: after.quantity, basePriceMinor: after.basePriceMinor.toString(), vatRateBps: after.vatRateBps },
      },
    });
  });
  revalidatePath('/products');
  revalidatePath('/admin/products');
}

const orderTransitions = {
  CONFIRMED: ['IN_PRODUCTION'],
  SHIPPED: ['COMPLETED'],
  IN_PRODUCTION: [],
  PARTIALLY_SHIPPED: [],
  PENDING_PAYMENT: [],
  COMPLETED: [],
  CANCELLED: [],
  REFUNDED: [],
} as const;

export async function updateOrderStatus(formData: FormData) {
  const actorUserId = await requireAdmin();
  const parsed = z.object({ orderId: z.string().min(1).max(40), status: z.enum(['IN_PRODUCTION', 'PARTIALLY_SHIPPED', 'SHIPPED', 'COMPLETED']) }).safeParse({ orderId: formData.get('orderId'), status: formData.get('status') });
  if (!parsed.success) throw new Error('Invalid order status.');
  const db = getDb();
  await db.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id: parsed.data.orderId },
      include: { lines: { include: { productionJob: { select: { status: true } } }, select: { id: true } }, shipments: { select: { status: true } } },
    });
    if (!order || !(orderTransitions[order.status] as readonly string[]).includes(parsed.data.status)) throw new Error('This order status transition is not allowed.');
    if (parsed.data.status === 'IN_PRODUCTION' && (!order.lines.length || order.lines.some((line) => !line.productionJob || !['IN_PRODUCTION', 'FINISHING', 'PACKAGING', 'READY_TO_SHIP', 'COMPLETE'].includes(line.productionJob.status)))) {
      throw new Error('Every production job must have started before the order can move to production.');
    }
    if (parsed.data.status === 'COMPLETED' && (!order.shipments.length || order.shipments.some((shipment) => shipment.status !== 'DELIVERED') || order.lines.some((line) => line.productionJob?.status !== 'COMPLETE'))) {
      throw new Error('Every shipment must be delivered and every production job complete before closing the order.');
    }
    await transaction.order.update({ where: { id: order.id }, data: { status: parsed.data.status } });
    await transaction.adminAuditLog.create({
      data: { actorUserId, action: 'order.status_changed', entityType: 'Order', entityId: order.id, before: { status: order.status }, after: { status: parsed.data.status } },
    });
  });
  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  revalidatePath('/account/orders');
}

const productionTransitions: Record<string, string[]> = {
  AWAITING_ARTWORK: ['ARTWORK_REVIEW', 'ON_HOLD', 'CANCELLED'],
  ARTWORK_REVIEW: ['AWAITING_PROOF_APPROVAL', 'READY_FOR_PRODUCTION', 'ON_HOLD', 'CANCELLED'],
  AWAITING_PROOF_APPROVAL: ['READY_FOR_PRODUCTION', 'ARTWORK_REVIEW', 'ON_HOLD'],
  READY_FOR_PRODUCTION: ['IN_PRODUCTION', 'ON_HOLD'],
  IN_PRODUCTION: ['FINISHING', 'ON_HOLD'],
  FINISHING: ['PACKAGING', 'ON_HOLD'],
  PACKAGING: ['READY_TO_SHIP', 'ON_HOLD'],
  READY_TO_SHIP: ['COMPLETE', 'ON_HOLD'],
  COMPLETE: [],
  ON_HOLD: ['ARTWORK_REVIEW', 'AWAITING_ARTWORK', 'AWAITING_PROOF_APPROVAL', 'READY_FOR_PRODUCTION', 'IN_PRODUCTION', 'FINISHING', 'PACKAGING', 'READY_TO_SHIP', 'CANCELLED'],
  CANCELLED: [],
};

export async function updateProductionJob(formData: FormData) {
  const actorUserId = await requireProductionStaff();
  const parsed = z.object({
    jobId: z.string().min(1).max(40),
    status: z.enum(['AWAITING_ARTWORK', 'ARTWORK_REVIEW', 'AWAITING_PROOF_APPROVAL', 'READY_FOR_PRODUCTION', 'IN_PRODUCTION', 'FINISHING', 'PACKAGING', 'READY_TO_SHIP', 'COMPLETE', 'ON_HOLD', 'CANCELLED']),
    manufacturingMethod: z.enum(['OWN_PRODUCTION', 'PRINT_PARTNER']),
    partnerName: z.string().trim().max(160).optional(),
    note: z.string().trim().max(500).optional(),
  }).safeParse({
    jobId: formData.get('jobId'),
    status: formData.get('status'),
    manufacturingMethod: formData.get('manufacturingMethod'),
    partnerName: formData.get('partnerName') || undefined,
    note: formData.get('note') || undefined,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid production update.');
  const db = getDb();
  await db.$transaction(async (transaction) => {
    const job = await transaction.productionJob.findUnique({ where: { id: parsed.data.jobId } });
    if (!job || !(productionTransitions[job.status] ?? []).includes(parsed.data.status)) throw new Error('This production status transition is not allowed.');
    const now = new Date();
    const updated = await transaction.productionJob.update({
      where: { id: job.id },
      data: {
        status: parsed.data.status,
        manufacturingMethod: parsed.data.manufacturingMethod,
        partnerName: parsed.data.manufacturingMethod === 'PRINT_PARTNER' ? parsed.data.partnerName ?? null : null,
        ...(parsed.data.status === 'IN_PRODUCTION' && !job.startedAt ? { startedAt: now } : {}),
        ...(parsed.data.status === 'COMPLETE' ? { completedAt: now } : {}),
      },
    });
    await transaction.productionStatusEvent.create({
      data: { productionJobId: job.id, fromStatus: job.status, toStatus: parsed.data.status, actorUserId, note: parsed.data.note ?? null },
    });
    await transaction.adminAuditLog.create({
      data: {
        actorUserId,
        action: 'production.status_changed',
        entityType: 'ProductionJob',
        entityId: job.id,
        before: { status: job.status, manufacturingMethod: job.manufacturingMethod, partnerName: job.partnerName },
        after: { status: updated.status, manufacturingMethod: updated.manufacturingMethod, partnerName: updated.partnerName },
      },
    });
    const orderLines = await transaction.orderLine.findMany({
      where: { id: job.orderLineId },
      select: { order: { select: { id: true, status: true, lines: { select: { productionJob: { select: { status: true } } } } } } },
    });
    const order = orderLines[0]?.order;
    const allJobsStarted = order?.lines.length && order.lines.every((line) => line.productionJob && ['IN_PRODUCTION', 'FINISHING', 'PACKAGING', 'READY_TO_SHIP', 'COMPLETE'].includes(line.productionJob.status));
    if (order && ['CONFIRMED', 'IN_PRODUCTION'].includes(order.status) && allJobsStarted) {
      await transaction.order.update({ where: { id: order.id }, data: { status: 'IN_PRODUCTION' } });
    }
    if (order && parsed.data.status === 'CANCELLED') {
      await transaction.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } });
    }
  });
  revalidatePath('/admin/production');
  revalidatePath('/production');
  revalidatePath('/admin/orders');
  revalidatePath('/account/orders');
}

export async function addShipment(formData: FormData) {
  const actorUserId = await requireAdmin();
  const parsed = z.object({
    orderId: z.string().min(1).max(40),
    carrierName: z.string().trim().min(2).max(120),
    trackingNumber: z.string().trim().min(2).max(160),
    trackingUrl: z.string().url().refine((url) => ['https:', 'http:'].includes(new URL(url).protocol)).optional(),
    note: z.string().trim().max(500).optional(),
  }).safeParse({ orderId: formData.get('orderId'), carrierName: formData.get('carrierName'), trackingNumber: formData.get('trackingNumber'), trackingUrl: formData.get('trackingUrl') || undefined, note: formData.get('note') || undefined });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid shipping tracking data.');
  const db = getDb();
  await db.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id: parsed.data.orderId },
      include: { lines: { include: { productionJob: { select: { status: true } } } } },
    });
    if (!order) throw new Error('Order not found.');
    if (!['IN_PRODUCTION', 'SHIPPED'].includes(order.status)) throw new Error('The order must be in production before it can be dispatched.');
    if (!order.lines.length || order.lines.some((line) => line.productionJob?.status !== 'READY_TO_SHIP' && line.productionJob?.status !== 'COMPLETE')) {
      throw new Error('Every production job must be ready to ship before adding tracking.');
    }
    const shipment = await transaction.shipment.create({
      data: {
        orderId: order.id,
        carrierName: parsed.data.carrierName,
        trackingNumber: parsed.data.trackingNumber,
        trackingUrl: parsed.data.trackingUrl ?? null,
        note: parsed.data.note ?? null,
        status: 'DISPATCHED',
        shippedAt: new Date(),
      },
    });
    await transaction.order.update({ where: { id: order.id }, data: { status: 'SHIPPED' } });
    await transaction.adminAuditLog.create({
      data: { actorUserId, action: 'shipment.created', entityType: 'Shipment', entityId: shipment.id, after: { trackingNumber: shipment.trackingNumber, carrierName: shipment.carrierName, status: shipment.status } },
    });
  });
  revalidatePath('/admin/orders');
  revalidatePath('/account/orders');
}

const shipmentTransitions: Record<string, string[]> = {
  PREPARING: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['IN_TRANSIT', 'DELIVERED', 'EXCEPTION', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED', 'EXCEPTION'],
  DELIVERED: [],
  EXCEPTION: ['IN_TRANSIT', 'DELIVERED'],
  CANCELLED: [],
};

export async function updateShipmentStatus(formData: FormData) {
  const actorUserId = await requireAdmin();
  const parsed = z.object({ shipmentId: z.string().min(1).max(40), status: z.enum(['DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'EXCEPTION', 'CANCELLED']), note: z.string().trim().max(500).optional() }).safeParse({ shipmentId: formData.get('shipmentId'), status: formData.get('status'), note: formData.get('note') || undefined });
  if (!parsed.success) throw new Error('Invalid shipment update.');
  const db = getDb();
  await db.$transaction(async (transaction) => {
    const shipment = await transaction.shipment.findUnique({ where: { id: parsed.data.shipmentId }, include: { order: { include: { lines: { include: { productionJob: { select: { status: true } } } }, shipments: { select: { status: true } } } } } });
    if (!shipment || !(shipmentTransitions[shipment.status] ?? []).includes(parsed.data.status)) throw new Error('This shipment status transition is not allowed.');
    const updated = await transaction.shipment.update({ where: { id: shipment.id }, data: { status: parsed.data.status, note: parsed.data.note ?? shipment.note, ...(parsed.data.status === 'DELIVERED' ? { deliveredAt: new Date() } : {}) } });
    await transaction.adminAuditLog.create({
      data: { actorUserId, action: 'shipment.status_changed', entityType: 'Shipment', entityId: shipment.id, before: { status: shipment.status }, after: { status: updated.status, note: updated.note } },
    });
    const allDelivered = shipment.order.shipments.every((item) => item.status === 'DELIVERED' || item.status === updated.status);
    const allProductionComplete = shipment.order.lines.every((line) => line.productionJob?.status === 'COMPLETE');
    if (parsed.data.status === 'DELIVERED' && allDelivered && allProductionComplete && shipment.order.status === 'SHIPPED') {
      await transaction.order.update({ where: { id: shipment.order.id }, data: { status: 'COMPLETED' } });
    }
  });
  revalidatePath('/admin/orders');
  revalidatePath('/account/orders');
}

export async function reviewArtwork(formData: FormData) {
  const actorUserId = await requireProductionStaff();
  const parsed = z.object({ artworkId: z.string().min(1).max(40), decision: z.enum(['APPROVED', 'REJECTED']), note: z.string().trim().max(500).optional() }).safeParse({ artworkId: formData.get('artworkId'), decision: formData.get('decision'), note: formData.get('note') || undefined });
  if (!parsed.success) throw new Error('Invalid artwork review.');
  const db = getDb();
  await db.$transaction(async (transaction) => {
    const artwork = await transaction.artworkAsset.findUnique({ where: { id: parsed.data.artworkId } });
    if (!artwork || artwork.status !== 'REVIEW_REQUIRED' || artwork.deletedAt) throw new Error('Only virus-scanned artwork awaiting review can be approved.');
    const updated = await transaction.artworkAsset.update({ where: { id: artwork.id }, data: { status: parsed.data.decision } });
    await transaction.adminAuditLog.create({
      data: {
        actorUserId,
        action: `artwork.${parsed.data.decision.toLowerCase()}`,
        entityType: 'ArtworkAsset',
        entityId: artwork.id,
        before: { status: artwork.status },
        after: { status: updated.status, note: parsed.data.note ?? null },
      },
    });
  });
  revalidatePath('/admin/artwork');
  revalidatePath('/account/artwork');
  revalidatePath('/cart');
}
