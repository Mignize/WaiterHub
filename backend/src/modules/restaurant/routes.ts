import { Router } from 'express';
import { getRestaurant } from './controller';
import { authenticateJWT } from '@/middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/restaurant', getRestaurant);

export default router;
