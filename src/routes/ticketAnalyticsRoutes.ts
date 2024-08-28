import { Router } from 'express';
import { getTicketAnalytics } from '../controllers/ticketAnalyticsController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/tickets/analytics', authMiddleware, getTicketAnalytics);

export default router;
