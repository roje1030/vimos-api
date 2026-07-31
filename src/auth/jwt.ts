import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';

import { loadEnv } from '../config/env.js';

const env = loadEnv();
const JWT_SECRET = env.jwtSecret ?? 'dev-secret-change-me';
const JWT_EXPIRES_IN = '1h';
const revokedTokens = new Set<string>();

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  if (revokedTokens.has(token)) {
    throw new Error('Token has been revoked');
  }

  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function revokeToken(token: string): void {
  revokedTokens.add(token);
}

export function createTokenId(): string {
  return randomBytes(16).toString('hex');
}
