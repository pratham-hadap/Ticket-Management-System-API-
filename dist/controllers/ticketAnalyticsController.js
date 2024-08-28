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
exports.getTicketAnalytics = void 0;
const db_1 = __importDefault(require("../models/db"));
const getTicketAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, status } = req.query;
    let query = `SELECT type,
                      COUNT(*) AS totalTickets,
                      SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS openTickets,
                      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closedTickets
               FROM tickets`;
    const filters = [];
    const values = [];
    if (type) {
        filters.push(`type = $${values.length + 1}`);
        values.push(type);
    }
    if (status) {
        filters.push(`status = $${values.length + 1}`);
        values.push(status);
    }
    if (filters.length > 0) {
        query += ' WHERE ' + filters.join(' AND ');
    }
    query += ' GROUP BY type';
    try {
        const result = yield db_1.default.query(query, values);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTicketAnalytics = getTicketAnalytics;
