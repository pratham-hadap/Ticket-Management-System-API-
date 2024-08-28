"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.post('/tickets', authMiddleware_1.default, ticketController_1.createTicket);
router.post('/tickets/:ticketId/assign', authMiddleware_1.default, ticketController_1.assignUserToTicket);
router.get('/tickets/:ticketId', authMiddleware_1.default, ticketController_1.getTicketDetails);
// Add other ticket-related routes
exports.default = router;
