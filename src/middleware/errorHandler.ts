import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
}

