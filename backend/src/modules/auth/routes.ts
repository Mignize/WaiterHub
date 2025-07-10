import { Router } from 'express';
import { getUser, login, register } from './controller';
import { authenticateJWT } from '@/middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateJWT, getUser);

export default router;
