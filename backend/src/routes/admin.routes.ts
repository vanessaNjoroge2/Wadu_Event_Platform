import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));

router.get('/stats', AdminController.getPlatformStats);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);
router.get('/events', AdminController.getEvents);
router.patch('/events/:id/status', AdminController.updateEventStatus);
router.get('/orders', AdminController.getOrders);

export default router;
