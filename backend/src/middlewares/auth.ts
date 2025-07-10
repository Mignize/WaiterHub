import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { JwtPayload } from '@/types/jwt';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: Role;
      restaurantId: string;
    };
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      restaurantId: decoded.restaurantId,
    } as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorizeRoles =
  (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  };
