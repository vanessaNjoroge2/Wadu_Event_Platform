import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const u = val.toUpperCase();
        if (u === 'ORGANISER') return 'ORGANIZER';
        return u;
      }
      return val;
    },
    z.enum(['ATTENDEE', 'ORGANIZER', 'ADMIN']).default('ATTENDEE')
  ),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const verifySchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

router.post('/register', validate({ body: registerSchema }), AuthController.register);
router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.post('/verify', validate({ body: verifySchema }), AuthController.verify);
router.post('/verify-code', validate({ body: verifySchema }), AuthController.verifyCode);
router.post('/resend-verification', validate({ body: resendVerificationSchema }), AuthController.resendVerification);
router.post('/logout', requireAuth, AuthController.logout);
router.get('/me', requireAuth, AuthController.me);

export default router;
