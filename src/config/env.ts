import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  port: number;
  nodeEnv: string;
  appName: string;
  jwtSecret: string;
  databaseUrl: string;
}

function getNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadEnv(): EnvConfig {
  return {
    port: getNumberEnv('PORT', 3000),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    appName: process.env.APP_NAME ?? 'vimos-api',
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    databaseUrl: process.env.DATABASE_URL ?? '',
  };
}

export default loadEnv;