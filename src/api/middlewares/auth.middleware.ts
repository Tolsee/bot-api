import { timingSafeEqual } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const encoder = new TextEncoder();
  const pass = encoder.encode(req.headers['authorization']);
  const secret = encoder.encode(`Bearer ${process.env.AUTHORIZATION_SECRET}`);

  if (pass.length === secret.length && timingSafeEqual(pass, secret)) {
    return next();
  }

  res.status(401).json({ error: 'Unauthorized' });
}
