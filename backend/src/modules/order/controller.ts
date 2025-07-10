import { Request, Response } from 'express';
import prisma from '@/prisma';
import { JwtPayload } from '@/types/jwt';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.user as JwtPayload;
    const { status, page = '1', limit = '10' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ error: 'page must be a positive integer' });
    }
    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json({ error: 'limit must be a positive integer between 1 and 100' });
    }

    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        ...(status ? { status: String(status) } : {}),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limitNumber,
      skip: (pageNumber - 1) * limitNumber,
    });

    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.user as JwtPayload;
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    const order = await prisma.order.create({
      data: {
        restaurantId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const completeOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { restaurantId } = req.user as JwtPayload;
    const order = await prisma.order.update({
      where: {
        id,
        restaurantId,
      },
      data: {
        status: 'COMPLETED',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
