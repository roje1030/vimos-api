import type { Request, Response } from 'express';

export async function getWelcomeMessage(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ message: 'Welcome to VIMOS API' });
}

export async function getHealthStatus(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ status: 'OK' });
}
