import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { getDatabaseEnv } from '@/lib/env';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  const adapter = new PrismaPg({ connectionString: getDatabaseEnv().DATABASE_URL });
  return new PrismaClient({ adapter });
}

export function getDb() {
  globalForPrisma.prisma ??= createClient();
  return globalForPrisma.prisma;
}
