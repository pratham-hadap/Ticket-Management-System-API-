"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketHistory = void 0;
const db_1 = __importDefault(require("../models/db"));
const getTicketHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, status, priority, type, venue } = req.query;
    let query = `SELECT COUNT(*) AS totalTickets,
                      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closedTickets,
                      SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS openTickets,
                      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) AS inProgressTickets
               FROM tickets`;
    const filters = [];
    const values = [];
    const startDateStr = startDate; // Ensure this is a string
    const endDateStr = endDate;
    if (startDateStr) {
        values.push(new Date(startDateStr).toISOString());
    }
    if (endDateStr) {
        values.push(new Date(endDateStr).toISOString());
    }
    if (status) {
        filters.push(`status = $${values.length + 1}`);
        values.push(status);
    }
    if (priority) {
        filters.push(`priority = $${values.length + 1}`);
        values.push(priority);
    }
    if (type) {
        filters.push(`type = $${values.length + 1}`);
        values.push(type);
    }
    if (venue) {
        filters.push(`venue = $${values.length + 1}`);
        values.push(venue);
    }
    if (filters.length > 0) {
        query += ' WHERE ' + filters.join(' AND ');
    }
    try {
        const result = yield db_1.default.query(query, values);
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTicketHistory = getTicketHistory;
