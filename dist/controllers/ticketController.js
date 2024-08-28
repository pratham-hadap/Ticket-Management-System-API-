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
exports.getTicketDetails = exports.assignUserToTicket = exports.createTicket = void 0;
const db_1 = __importDefault(require("../models/db"));
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, type, venue, status, price, priority, dueDate, createdBy } = req.body;
    // Validation
    if (new Date(dueDate) <= new Date()) {
        return res.status(400).json({ message: 'Due date must be in the future' });
    }
    try {
        const result = yield db_1.default.query('INSERT INTO tickets (title, description, type, venue, status, price, priority, due_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [title, description, type, venue, status, price, priority, dueDate, createdBy]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createTicket = createTicket;
const assignUserToTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const { userId } = req.body;
    try {
        // Check if ticket is closed
        const ticketResult = yield db_1.default.query('SELECT status FROM tickets WHERE id = $1', [ticketId]);
        const ticket = ticketResult.rows[0];
        if (ticket.status === 'closed') {
            return res.status(400).json({ message: 'Cannot assign users to a closed ticket' });
        }
        // Check if user is already assigned
        const assignmentResult = yield db_1.default.query('SELECT * FROM ticket_assignments WHERE ticket_id = $1 AND user_id = $2', [ticketId, userId]);
        if (assignmentResult.rows.length > 0) {
            return res.status(400).json({ message: 'User already assigned to this ticket' });
        }
        // Assign user
        yield db_1.default.query('INSERT INTO ticket_assignments (ticket_id, user_id) VALUES ($1, $2)', [ticketId, userId]);
        res.json({ message: 'User assigned successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.assignUserToTicket = assignUserToTicket;
const getTicketDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    try {
        const ticketResult = yield db_1.default.query(`SELECT t.*, json_agg(json_build_object('userId', u.id, 'name', u.name, 'email', u.email)) AS assigned_users
       FROM tickets t
       LEFT JOIN ticket_assignments ta ON t.id = ta.ticket_id
       LEFT JOIN users u ON ta.user_id = u.id
       WHERE t.id = $1
       GROUP BY t.id`, [ticketId]);
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticketResult.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTicketDetails = getTicketDetails;
