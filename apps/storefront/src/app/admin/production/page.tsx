import { ProductionQueue } from '@/features/production/production-queue';

export const dynamic = 'force-dynamic';

export default function AdminProductionPage() {
  return <ProductionQueue adminLinks />;
}
