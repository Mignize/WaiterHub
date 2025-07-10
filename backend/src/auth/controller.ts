import { Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user.id, role: user.role, restaurantId: user.restaurantId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '8h' },
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
    },
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, role, restaurantId } = req.body;
  if (!email || !password || !role || !restaurantId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: passwordHash, role, restaurantId },
      select: { id: true, email: true, role: true, restaurantId: true },
    });
    res.status(201).json(user);
  } catch {
    res.status(500).json({ error: 'Error registering user' });
  }
};
