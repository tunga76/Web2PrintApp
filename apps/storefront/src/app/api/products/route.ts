import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';

const searchSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(120).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = searchSchema.safeParse({ q: url.searchParams.get('q') ?? undefined, category: url.searchParams.get('category') ?? undefined });
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });

  const products = await getDb().product.findMany({
    where: {
      status: 'ACTIVE',
      deletedAt: null,
      ...(parsed.data.category ? { category: { slug: parsed.data.category, isActive: true } } : {}),
      ...(parsed.data.q
        ? {
            OR: [
              { name: { contains: parsed.data.q, mode: 'insensitive' as const } },
              { shortDescription: { contains: parsed.data.q, mode: 'insensitive' as const } },
              { description: { contains: parsed.data.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      category: { select: { slug: true, name: true } },
      priceTiers: {
        where: { isActive: true, startsAt: { lte: new Date() }, OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }] },
        orderBy: { quantity: 'asc' },
        take: 1,
        select: { quantity: true, basePriceMinor: true, currency: true, vatRateBps: true },
      },
    },
  });
  return NextResponse.json(
    products.map(({ id, slug, name, shortDescription, isIndicativePricing, category, priceTiers }) => ({
      id,
      slug,
      name,
      shortDescription,
      isIndicativePricing,
      category,
      startingTier: priceTiers[0]
        ? {
            quantity: priceTiers[0].quantity,
            netMinor: priceTiers[0].basePriceMinor.toString(),
            vatRateBps: priceTiers[0].vatRateBps,
            currency: priceTiers[0].currency,
          }
        : null,
    })),
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
