import type { Request, Response } from 'express';

import { comparePassword } from '../auth/password.js';
import { revokeToken, signToken } from '../auth/jwt.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { UserRepository } from '../modules/users/userRepository.js';
import { UserService } from '../modules/users/userService.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function loginController(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = await userService.getUserByEmailForLogin(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.status(200).json({ token });
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    revokeToken(authHeader.slice(7));
  }

  res.status(200).json({ message: 'Logged out successfully' });
}

export async function meController(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.status(200).json({ email: req.user.email, role: req.user.role });
}