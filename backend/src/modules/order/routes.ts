import { Router } from 'express';
import { getOrders, createOrder, completeOrder } from './controller';
import { authenticateJWT } from '@/middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.post('/orders/:id/complete', completeOrder);

export default router;
