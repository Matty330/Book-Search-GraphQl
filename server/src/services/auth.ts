import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

/**
 * NOTE:
 * We explicitly ensure every branch ends in a 'return'.
 * This fixes the “Not all code paths return a value” error.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    req.user = decoded as JwtPayload;
    next();
    return;
  });
};

export const signToken = (_id: string, username: string, email: string): string => {
  return jwt.sign({ _id, username, email }, JWT_SECRET, { expiresIn: '1h' });
};
