import prisma from '@/prisma';
import { JwtPayload } from '@/types/jwt';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.user as JwtPayload;
    const users = await prisma.user.findMany({
      where: {
        restaurantId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, name } = req.body;
    const { restaurantId } = req.user as JwtPayload;
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role,
        name,
        restaurantId,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, role, name } = req.body;
    const { restaurantId } = req.user as JwtPayload;

    if (!email || !role || !name) {
      return res.status(400).json({ error: 'Email, role, and name are required' });
    }

    const data = {
      email,
      role,
      name,
    } as {
      email: string;
      role: Role;
      name: string;
      password?: string;
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id,
        restaurantId,
      },
      data,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { restaurantId } = req.user as JwtPayload;
    const user = await prisma.user.delete({
      where: {
        id,
        restaurantId,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
