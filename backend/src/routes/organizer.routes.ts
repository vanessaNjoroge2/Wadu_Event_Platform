import { Router } from 'express';
import { OrganizerController } from '../controllers/organizer.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Apply organizer-only protection to all organizer dashboard sub-routes
router.use(requireAuth, requireRole(Role.ORGANIZER, Role.ADMIN));

router.get('/dashboard', OrganizerController.getDashboardStats);
router.get('/events', OrganizerController.getOrganizerEvents);
router.get('/events/:id/attendees', OrganizerController.getEventAttendees);
router.get('/analytics/revenue', OrganizerController.getRevenueAnalytics);
router.get('/analytics/daily-sales', OrganizerController.getDailySalesAnalytics);
router.get('/analytics/ticket-categories', OrganizerController.getTicketCategoriesAnalytics);
router.get('/payouts', OrganizerController.getPayouts);

export default router;
