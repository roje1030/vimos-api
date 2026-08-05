import { prisma } from '../../config/prisma.js';
import type { User as PrismaUser } from '../../generated/prisma/client.js';

export interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

function toUserRecord(user: PrismaUser): UserRecord {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserRepository {
  async findAll(): Promise<UserRecord[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return users.map(toUserRecord);
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? toUserRecord(user) : null;
  }

  async create(data: { email: string; name?: string | null; role: string }): Promise<UserRecord> {
    const user = await prisma.user.create({
      data: {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        email: data.email,
        name: data.name ?? data.email,
        role: data.role as PrismaUser['role'],
        password: '', // placeholder — real password handling comes with the auth rewrite
        allowedModules: [],
      },
    });
    return toUserRecord(user);
  }

  async update(id: string, data: { email?: string; name?: string | null; role?: string }): Promise<UserRecord | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name ?? undefined,
          role: data.role as PrismaUser['role'] | undefined,
        },
      });
      return toUserRecord(user);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } }).catch(() => undefined);
  }
}