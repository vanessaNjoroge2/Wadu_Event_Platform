import { Router } from 'express';
import { z } from 'zod';
import { UsersController } from '../controllers/users.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional().nullable(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

router.get('/:id', requireAuth, UsersController.getProfile);
router.patch('/:id', requireAuth, validate({ body: updateProfileSchema }), UsersController.updateProfile);
router.patch('/:id/password', requireAuth, validate({ body: changePasswordSchema }), UsersController.changePassword);

export default router;
