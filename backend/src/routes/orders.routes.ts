import { Router } from 'express';
import { z } from 'zod';
import { OrdersController } from '../controllers/orders.controller';
import { validate } from '../middleware/validate';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

const orderItemSchema = z.object({
  ticketTypeId: z.string().min(1, 'ticketTypeId is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

const createOrderSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
  items: z.array(orderItemSchema).nonempty('At least one ticket must be ordered'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  deliveryMethod: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']).default('BOTH'),
  paymentMethod: z.enum(['CARD', 'MPESA', 'PAYPAL', 'BANK']),
});

router.post('/', optionalAuth, validate({ body: createOrderSchema }), OrdersController.createOrder);
router.get('/', requireAuth, OrdersController.listOrders);
router.get('/:id', requireAuth, OrdersController.getOrderDetails);
router.delete('/:id', requireAuth, OrdersController.deleteOrder);

export default router;
