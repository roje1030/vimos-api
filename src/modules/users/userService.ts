import { UserRepository, type UserRecord } from './userRepository.js';

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async listUsers(): Promise<UserRecord[]> {
    return this.repository.findAll();
  }

  async getUserById(id: string): Promise<UserRecord | null> {
    return this.repository.findById(id);
  }

  async createUser(input: { email: string; name?: string | null; role: string }): Promise<UserRecord> {
    return this.repository.create(input);
  }

  async updateUser(id: string, input: { email?: string; name?: string | null; role?: string }): Promise<UserRecord | null> {
    return this.repository.update(id, input);
  }

  async deleteUser(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
