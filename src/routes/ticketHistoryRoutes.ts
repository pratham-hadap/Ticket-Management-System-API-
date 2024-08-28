import { Router } from 'express';
import { getTicketHistory } from '../controllers/ticketHistoryController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.get('/tickets/analytics', authMiddleware, getTicketHistory);

export default router;
