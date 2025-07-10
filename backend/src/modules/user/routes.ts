import { Router } from 'express';
import { getUsers, createUser, editUser, deleteUser } from './controller';
import { authenticateJWT, authorizeRoles } from '@/middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/users', authorizeRoles([Role.admin]), getUsers);
router.post('/user', authorizeRoles([Role.admin]), createUser);
router.put('/user/:id', authorizeRoles([Role.admin]), editUser);
router.delete('/user/:id', authorizeRoles([Role.admin]), deleteUser);

export default router;
