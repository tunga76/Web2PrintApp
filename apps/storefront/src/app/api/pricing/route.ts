import { NextResponse } from 'next/server';
import { calculateProductPrice, priceRequestSchema } from '@/features/catalog/pricing';

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = priceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_REQUEST', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const result = await calculateProductPrice(parsed.data);
  const status = result.ok ? 200 : result.code.endsWith('UNAVAILABLE') ? 404 : 422;
  return NextResponse.json(result, { status, headers: { 'Cache-Control': 'no-store' } });
}
