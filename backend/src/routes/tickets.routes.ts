import { Router } from 'express';
import { z } from 'zod';
import { TicketsController } from '../controllers/tickets.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

const addTicketTypeSchema = z.object({
  name: z.string().min(1, 'Ticket type name is required'),
  description: z.string().default(''),
  price: z.number().int().min(0, 'Price must be non-negative'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

const updateTicketTypeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().min(0).optional(),
  quantity: z.number().int().min(1).optional(),
});

router.get('/event/:eventId', TicketsController.getTicketsByEvent);
router.post('/event/:eventId', requireAuth, requireRole(Role.ORGANIZER, Role.ADMIN), validate({ body: addTicketTypeSchema }), TicketsController.addTicketType);
router.patch('/:id', requireAuth, requireRole(Role.ORGANIZER, Role.ADMIN), validate({ body: updateTicketTypeSchema }), TicketsController.updateTicketType);

export default router;
