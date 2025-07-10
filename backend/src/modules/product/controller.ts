import prisma from '@/prisma';
import { JwtPayload } from '@/types/jwt';
import { Request, Response } from 'express';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.user as JwtPayload;
    const products = await prisma.product.findMany({
      where: {
        restaurantId,
      },
    });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const { restaurantId } = req.user as JwtPayload;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const product = await prisma.product.create({
      data: {
        name,
        price,
        restaurantId,
      },
    });
    res.status(201).json(product);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const { restaurantId } = req.user as JwtPayload;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const product = await prisma.product.update({
      where: {
        id,
        restaurantId,
      },
      data: {
        name,
        price,
      },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { restaurantId } = req.user as JwtPayload;
    const product = await prisma.product.delete({
      where: {
        id,
        restaurantId,
      },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
