export interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  private readonly users: UserRecord[] = [];

  async findAll(): Promise<UserRecord[]> {
    return [...this.users].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async create(data: { email: string; name?: string | null; role: string }): Promise<UserRecord> {
    const user: UserRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      email: data.email,
      name: data.name ?? null,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async update(id: string, data: { email?: string; name?: string | null; role?: string }): Promise<UserRecord | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return null;
    }

    const existingUser = this.users[index];
    if (!existingUser) {
      return null;
    }

    const updatedUser: UserRecord = {
      id: existingUser.id,
      email: data.email ?? existingUser.email,
      name: data.name ?? existingUser.name,
      role: data.role ?? existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: new Date(),
    };

    this.users[index] = updatedUser;

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}
