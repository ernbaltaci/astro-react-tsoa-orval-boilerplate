import { PrismaClient } from '@prisma/client';
import { singleton } from 'tsyringe';

// Reuse Prisma client in dev to avoid exhausting database connections on HMR
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'production'
        ? ['error']
        : ['query', 'warn', 'error'],
  });
}

@singleton()
export class DatabaseService {
  public readonly client: PrismaClient;

  constructor() {
    this.client = globalForPrisma.__prisma ?? createPrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.__prisma = this.client;
    }

    // Optional eager connect; comment out if you prefer lazy
    void this.client.$connect();

    // Graceful shutdown hooks (idempotent)
    const shutdown = async () => {
      try {
        await this.client.$disconnect();
      } catch {
        // ignore
      }
    };

    process.once('beforeExit', shutdown);
    process.once('SIGINT', async () => {
      await shutdown();
      process.exit(0);
    });
    process.once('SIGTERM', async () => {
      await shutdown();
      process.exit(0);
    });
  }

  get prisma() {
    return this.client;
  }
}

