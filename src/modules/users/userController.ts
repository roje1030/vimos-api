import type { Request, Response } from 'express';

import { UserService } from './userService.js';

export class UserController {
  constructor(private readonly service: UserService) {}

  listUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.service.listUsers();
    res.status(200).json(users);
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'User id is required' });
      return;
    }

    const user = await this.service.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.createUser(req.body);
    res.status(201).json(user);
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'User id is required' });
      return;
    }

    const user = await this.service.updateUser(id, req.body);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: 'User id is required' });
      return;
    }

    await this.service.deleteUser(id);
    res.status(204).send();
  };
}
