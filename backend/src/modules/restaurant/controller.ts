import prisma from '@/prisma';
import { JwtPayload } from '@/types/jwt';
import { Request, Response } from 'express';

export const getRestaurant = async (req: Request, res: Response) => {
  const { restaurantId } = req.user as JwtPayload;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
    },
  });

  return res.status(200).send(restaurant);
};
