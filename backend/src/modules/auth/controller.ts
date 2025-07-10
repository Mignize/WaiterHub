import { Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';
import { createSlug } from '@/utils';
import { JwtPayload } from '@/types/jwt';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const user = await prisma.user.findUnique({
    where: { email },
  });
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
  const { name, email, password, restaurantName } = req.body;
  if (!name || !email || !password || !restaurantName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const slug = createSlug(name);
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const existsRestaurant = await prisma.restaurant.findUnique({ where: { slug, name } });
  if (existsRestaurant) return res.status(409).json({ error: 'Restaurant already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const restaurant = await prisma.restaurant.create({
      data: { name, slug },
      select: { id: true },
    });
    const user = await prisma.user.create({
      data: { name, email, password: passwordHash, role: 'admin', restaurantId: restaurant.id },
      select: { id: true, email: true, role: true, restaurantId: true },
    });
    const token = jwt.sign(
      { userId: user.id, role: user.role, restaurantId: user.restaurantId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' },
    );
    res.status(201).json({
      token,
      user,
    });
  } catch {
    res.status(500).json({ error: 'Error registering user' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.user as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, restaurantId: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};
