import { Router } from 'express';
import { getProducts, createProduct, editProduct, deleteProduct } from './controller';
import { authenticateJWT, authorizeRoles } from '@/middlewares/auth';
import { Role } from '@/generated/prisma';

const router = Router();

router.use(authenticateJWT);

router.get('/products', getProducts);
router.post('/products', authorizeRoles([Role.admin]), createProduct);
router.put('/products/:id', authorizeRoles([Role.admin]), editProduct);
router.delete('/products/:id', authorizeRoles([Role.admin]), deleteProduct);

export default router;
