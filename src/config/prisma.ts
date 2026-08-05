import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { loadEnv } from './env.js';

const env = loadEnv();

const adapter = new PrismaPg({ connectionString: env.databaseUrl });

// Single shared Prisma Client instance for the whole app.
// Every repository should import `prisma` from here instead of
// creating its own `new PrismaClient()` — sharing one instance
// avoids exhausting the database's connection pool.
export const prisma = new PrismaClient({ adapter });

export default prisma;  