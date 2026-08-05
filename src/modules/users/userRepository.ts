import { prisma } from '../../config/prisma.js';
import type { User as PrismaUser } from '../../generated/prisma/client.js';
import { hashPassword } from '../../auth/password.js';

export interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Includes the password hash — only used internally for login checks,
// never returned directly from the API.
export interface UserWithPassword extends UserRecord {
  password: string;
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

function toUserWithPassword(user: PrismaUser): UserWithPassword {
  return {
    ...toUserRecord(user),
    password: user.password,
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

  // Used only by login — includes the password hash.
  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? toUserWithPassword(user) : null;
  }

  async create(data: { email: string; name?: string | null; role: string; password: string }): Promise<UserRecord> {
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        email: data.email,
        name: data.name ?? data.email,
        role: data.role as PrismaUser['role'],
        password: hashedPassword,
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