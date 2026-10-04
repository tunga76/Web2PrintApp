import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { getDatabaseEnv } from '../src/lib/env';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Illustrative development catalog data cannot be seeded in production.');
}

const { DATABASE_URL } = getDatabaseEnv();
const databaseHost = new URL(DATABASE_URL).hostname;
if (!['localhost', '127.0.0.1', '::1'].includes(databaseHost)) {
  throw new Error('The illustrative catalog seed is restricted to a local development database.');
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

const products = [
  { slug: 'business-cards', sku: 'DEMO-CARDS', name: 'Business cards', category: 'Business cards', prices: [1900, 2700, 3900, 6500] },
  { slug: 'flyers', sku: 'DEMO-FLYERS', name: 'Flyers', category: 'Flyers', prices: [2500, 3900, 5900, 9900] },
  { slug: 'leaflets', sku: 'DEMO-LEAFLETS', name: 'Leaflets', category: 'Leaflets', prices: [2900, 4500, 7000, 12000] },
  { slug: 'posters', sku: 'DEMO-POSTERS', name: 'Posters', category: 'Posters', prices: [3500, 5800, 9500, 17000] },
  { slug: 'brochures', sku: 'DEMO-BROCHURES', name: 'Brochures', category: 'Brochures', prices: [4500, 7500, 12500, 22000] },
  { slug: 'booklets', sku: 'DEMO-BOOKLETS', name: 'Booklets', category: 'Booklets', prices: [5500, 9500, 16000, 29000] },
  { slug: 'stickers', sku: 'DEMO-STICKERS', name: 'Stickers', category: 'Stickers', prices: [3900, 6900, 11900, 21900] },
  { slug: 'banners', sku: 'DEMO-BANNERS', name: 'Banners', category: 'Banners', prices: [6500, 11000, 19000, 34000] },
] as const;

const quantityBreaks = [100, 250, 500, 1000];
const orientationValues = [
  { code: 'portrait', label: 'Portrait', modifierValue: 0 },
  { code: 'landscape', label: 'Landscape', modifierValue: 0 },
];
const sideValues = [
  { code: 'single', label: 'Single sided', modifierValue: 0 },
  { code: 'double', label: 'Double sided', modifierValue: 500 },
];
const definitions: Record<string, Array<{ code: string; name: string; values: Array<{ code: string; label: string; modifierValue: number }> }>> = {
  'business-cards': [
    { code: 'size', name: 'Size', values: [{ code: 'standard', label: '85 × 55 mm', modifierValue: 0 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Paper type', values: [{ code: 'silk', label: 'Silk', modifierValue: 0 }, { code: 'uncoated', label: 'Uncoated', modifierValue: 350 }] },
    { code: 'weight', name: 'Paper weight', values: [{ code: '350gsm', label: '350 gsm', modifierValue: 0 }, { code: '400gsm', label: '400 gsm', modifierValue: 450 }] },
    { code: 'printing-side', name: 'Printing side', values: sideValues },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }, { code: 'matt', label: 'Matt', modifierValue: 650 }, { code: 'soft-touch', label: 'Soft touch', modifierValue: 1200 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'square', label: 'Square corners', modifierValue: 0 }, { code: 'rounded', label: 'Rounded corners', modifierValue: 400 }] },
  ],
  flyers: [
    { code: 'size', name: 'Size', values: [{ code: 'a6', label: 'A6', modifierValue: 0 }, { code: 'a5', label: 'A5', modifierValue: 500 }, { code: 'a4', label: 'A4', modifierValue: 1200 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Paper type', values: [{ code: 'gloss', label: 'Gloss', modifierValue: 0 }, { code: 'silk', label: 'Silk', modifierValue: 200 }, { code: 'uncoated', label: 'Uncoated', modifierValue: 350 }] },
    { code: 'weight', name: 'Paper weight', values: [{ code: '130gsm', label: '130 gsm', modifierValue: 0 }, { code: '170gsm', label: '170 gsm', modifierValue: 500 }, { code: '250gsm', label: '250 gsm', modifierValue: 1100 }] },
    { code: 'printing-side', name: 'Printing side', values: sideValues },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }, { code: 'gloss', label: 'Gloss', modifierValue: 900 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'flat', label: 'Flat', modifierValue: 0 }, { code: 'half-fold', label: 'Half fold', modifierValue: 600 }] },
  ],
  leaflets: [
    { code: 'size', name: 'Size', values: [{ code: 'a5', label: 'A5', modifierValue: 0 }, { code: 'a4', label: 'A4', modifierValue: 600 }, { code: 'a3', label: 'A3', modifierValue: 1400 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Paper type', values: [{ code: 'gloss', label: 'Gloss', modifierValue: 0 }, { code: 'silk', label: 'Silk', modifierValue: 200 }, { code: 'uncoated', label: 'Uncoated', modifierValue: 350 }] },
    { code: 'weight', name: 'Paper weight', values: [{ code: '130gsm', label: '130 gsm', modifierValue: 0 }, { code: '170gsm', label: '170 gsm', modifierValue: 500 }, { code: '250gsm', label: '250 gsm', modifierValue: 1100 }] },
    { code: 'printing-side', name: 'Printing side', values: sideValues },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }, { code: 'matt', label: 'Matt', modifierValue: 950 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'flat', label: 'Flat', modifierValue: 0 }, { code: 'half-fold', label: 'Half fold', modifierValue: 600 }, { code: 'tri-fold', label: 'Tri-fold', modifierValue: 900 }] },
  ],
  posters: [
    { code: 'size', name: 'Size', values: [{ code: 'a3', label: 'A3', modifierValue: 0 }, { code: 'a2', label: 'A2', modifierValue: 1100 }, { code: 'a1', label: 'A1', modifierValue: 2400 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Paper type', values: [{ code: 'satin', label: 'Satin', modifierValue: 0 }, { code: 'photo', label: 'Photo gloss', modifierValue: 800 }] },
    { code: 'weight', name: 'Paper weight', values: [{ code: '150gsm', label: '150 gsm', modifierValue: 0 }, { code: '200gsm', label: '200 gsm', modifierValue: 700 }] },
    { code: 'printing-side', name: 'Printing side', values: [{ code: 'single', label: 'Single sided', modifierValue: 0 }] },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }, { code: 'matt', label: 'Matt', modifierValue: 750 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'trimmed', label: 'Trimmed', modifierValue: 0 }] },
  ],
  brochures: [
    { code: 'size', name: 'Size', values: [{ code: 'a5', label: 'A5', modifierValue: 0 }, { code: 'a4', label: 'A4', modifierValue: 800 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Paper type', values: [{ code: 'silk', label: 'Silk', modifierValue: 0 }, { code: 'gloss', label: 'Gloss', modifierValue: 300 }] },
    { code: 'weight', name: 'Paper weight', values: [{ code: '130gsm', label: '130 gsm', modifierValue: 0 }, { code: '170gsm', label: '170 gsm', modifierValue: 700 }] },
    { code: 'printing-side', name: 'Printing side', values: sideValues },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }, { code: 'gloss', label: 'Gloss', modifierValue: 1000 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'folded', label: 'Folded', modifierValue: 0 }, { code: 'stapled', label: 'Stapled', modifierValue: 900 }] },
  ],
  booklets: [
    { code: 'size', name: 'Size', values: [{ code: 'a5', label: 'A5', modifierValue: 0 }, { code: 'a4', label: 'A4', modifierValue: 900 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Paper type', values: [{ code: 'silk', label: 'Silk', modifierValue: 0 }, { code: 'uncoated', label: 'Uncoated', modifierValue: 300 }] },
    { code: 'weight', name: 'Paper weight', values: [{ code: '130gsm', label: '130 gsm', modifierValue: 0 }, { code: '170gsm', label: '170 gsm', modifierValue: 700 }] },
    { code: 'printing-side', name: 'Printing side', values: sideValues },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }, { code: 'matt', label: 'Matt', modifierValue: 1100 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'stapled', label: 'Stapled', modifierValue: 0 }, { code: 'wire-bound', label: 'Wire bound', modifierValue: 1800 }] },
  ],
  stickers: [
    { code: 'size', name: 'Size', values: [{ code: '50mm', label: '50 mm', modifierValue: 0 }, { code: '75mm', label: '75 mm', modifierValue: 500 }, { code: 'a6', label: 'A6 sheet', modifierValue: 900 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Material', values: [{ code: 'paper', label: 'Paper', modifierValue: 0 }, { code: 'vinyl', label: 'Water-resistant vinyl', modifierValue: 950 }] },
    { code: 'weight', name: 'Material weight', values: [{ code: 'standard', label: 'Standard', modifierValue: 0 }] },
    { code: 'printing-side', name: 'Printing side', values: [{ code: 'single', label: 'Single sided', modifierValue: 0 }] },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }, { code: 'gloss', label: 'Gloss', modifierValue: 650 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'kiss-cut', label: 'Kiss cut', modifierValue: 0 }, { code: 'die-cut', label: 'Die cut', modifierValue: 700 }] },
  ],
  banners: [
    { code: 'size', name: 'Size', values: [{ code: '850x2000', label: '850 × 2000 mm', modifierValue: 0 }, { code: '1000x2000', label: '1000 × 2000 mm', modifierValue: 1100 }] },
    { code: 'orientation', name: 'Orientation', values: orientationValues },
    { code: 'material', name: 'Material', values: [{ code: 'pvc', label: 'PVC', modifierValue: 0 }, { code: 'fabric', label: 'Fabric', modifierValue: 1800 }] },
    { code: 'weight', name: 'Material weight', values: [{ code: 'standard', label: 'Standard', modifierValue: 0 }, { code: 'heavy-duty', label: 'Heavy duty', modifierValue: 1400 }] },
    { code: 'printing-side', name: 'Printing side', values: sideValues },
    { code: 'lamination', name: 'Lamination', values: [{ code: 'none', label: 'None', modifierValue: 0 }] },
    { code: 'finishing', name: 'Finishing', values: [{ code: 'eyelets', label: 'Eyelets', modifierValue: 0 }, { code: 'pole-pocket', label: 'Pole pocket', modifierValue: 850 }] },
  ],
};

async function seed() {
  for (const product of products) {
    const category = await db.category.upsert({
      where: { slug: product.slug },
      update: { name: product.category, isActive: true, deletedAt: null },
      create: { slug: product.slug, name: product.category },
      select: { id: true },
    });
    const record = await db.product.upsert({
      where: { slug: product.slug },
      update: {
        categoryId: category.id,
        sku: product.sku,
        name: product.name,
        shortDescription: 'Illustrative development product; specifications and prices require commercial approval.',
        status: 'ACTIVE',
        vatRateBps: 2000,
        isIndicativePricing: true,
        deletedAt: null,
      },
      create: {
        categoryId: category.id,
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        shortDescription: 'Illustrative development product; specifications and prices require commercial approval.',
        status: 'ACTIVE',
        vatRateBps: 2000,
        isIndicativePricing: true,
      },
      select: { id: true },
    });

    for (const [index, quantity] of quantityBreaks.entries()) {
      await db.productPriceTier.upsert({
        where: { productId_quantity: { productId: record.id, quantity } },
        update: { basePriceMinor: BigInt(product.prices[index] ?? 0), vatRateBps: 2000, isActive: true, endsAt: null },
        create: { productId: record.id, quantity, basePriceMinor: BigInt(product.prices[index] ?? 0), vatRateBps: 2000 },
      });
    }

    for (const [index, group] of definitions[product.slug]!.entries()) {
      const groupRecord = await db.productOptionGroup.upsert({
        where: { productId_code: { productId: record.id, code: group.code } },
        update: { name: group.name, isRequired: true, allowMultiple: false, sortOrder: index, isActive: true },
        create: { productId: record.id, code: group.code, name: group.name, isRequired: true, sortOrder: index },
        select: { id: true },
      });
      for (const [valueIndex, value] of group.values.entries()) {
        await db.productOptionValue.upsert({
          where: { groupId_code: { groupId: groupRecord.id, code: value.code } },
          update: { label: value.label, modifierType: value.modifierValue === 0 ? 'NONE' : 'FIXED', modifierValue: BigInt(value.modifierValue), sortOrder: valueIndex, isActive: true },
          create: { groupId: groupRecord.id, code: value.code, label: value.label, modifierType: value.modifierValue === 0 ? 'NONE' : 'FIXED', modifierValue: BigInt(value.modifierValue), sortOrder: valueIndex },
        });
      }
    }
  }

  for (const method of [
    { code: 'standard', name: 'Standard delivery', speed: 'STANDARD' as const, priceNetMinor: 495, estimatedDaysMin: 4, estimatedDaysMax: 6 },
    { code: 'express', name: 'Express delivery', speed: 'EXPRESS' as const, priceNetMinor: 995, estimatedDaysMin: 2, estimatedDaysMax: 3 },
  ]) {
    await db.deliveryMethod.upsert({
      where: { code: method.code },
      update: { ...method, isActive: true },
      create: method,
    });
  }

  console.info(`Seeded ${products.length} development products with illustrative pricing.`);
  console.info('Do not use these demonstration prices or delivery estimates for real orders.');
}

seed()
  .finally(async () => db.$disconnect())
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
