import { Router } from 'express';
import { z } from 'zod';
import { EventsController } from '../controllers/events.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

const ticketInputSchema = z.object({
  name: z.string().min(1, 'Ticket name is required'),
  description: z.string().default(''),
  price: z.number().int().min(0, 'Price must be non-negative'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  address: z.string().min(1, 'Address is required'),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  imageUrl: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).default('DRAFT'),
  tickets: z.array(ticketInputSchema).optional(),
});

const updateEventSchema = createEventSchema.partial().extend({
  tickets: z.array(ticketInputSchema.extend({
    id: z.string().optional()
  })).optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']),
});

const listEventsQuerySchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

router.get('/', validate({ query: listEventsQuerySchema }), EventsController.listEvents);
router.get('/:id', EventsController.getEventById);
router.post('/', requireAuth, requireRole(Role.ORGANIZER, Role.ADMIN), validate({ body: createEventSchema }), EventsController.create);
router.patch('/:id/status', requireAuth, requireRole(Role.ORGANIZER, Role.ADMIN), validate({ body: updateStatusSchema }), EventsController.updateStatus);
router.patch('/:id', requireAuth, requireRole(Role.ORGANIZER, Role.ADMIN), validate({ body: updateEventSchema }), EventsController.updateEvent);
router.delete('/:id', requireAuth, requireRole(Role.ORGANIZER, Role.ADMIN), EventsController.deleteEvent);

export default router;
