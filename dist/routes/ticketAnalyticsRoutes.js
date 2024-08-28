"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketAnalyticsController_1 = require("../controllers/ticketAnalyticsController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.get('/tickets/analytics', authMiddleware_1.default, ticketAnalyticsController_1.getTicketAnalytics);
exports.default = router;
