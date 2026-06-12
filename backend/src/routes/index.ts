import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import eventsRoutes from './events.routes';
import categoriesRoutes from './categories.routes';
import citiesRoutes from './cities.routes';
import ticketsRoutes from './tickets.routes';
import ordersRoutes from './orders.routes';
import organizerRoutes from './organizer.routes';
import paymentsRoutes from './payments.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/events', eventsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/cities', citiesRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/orders', ordersRoutes);
router.use('/organizer', organizerRoutes);
router.use('/payments', paymentsRoutes);
router.use('/admin', adminRoutes);

export default router;
