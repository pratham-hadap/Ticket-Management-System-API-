import { Router } from 'express';
import { createTicket, assignUserToTicket, getTicketDetails } from '../controllers/ticketController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/tickets', authMiddleware, createTicket);
router.post('/tickets/:ticketId/assign', authMiddleware, assignUserToTicket);
router.get('/tickets/:ticketId', authMiddleware, getTicketDetails);

// Add other ticket-related routes

export default router;
