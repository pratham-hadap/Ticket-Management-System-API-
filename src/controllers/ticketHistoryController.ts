import { Request, Response } from 'express';
import pool from '../models/db';

const getTicketHistory = async (req: Request, res: Response) => {
  const { startDate, endDate, status, priority, type, venue } = req.query;

  let query = `SELECT COUNT(*) AS totalTickets,
                      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closedTickets,
                      SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS openTickets,
                      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) AS inProgressTickets
               FROM tickets`;

  const filters: string[] = [];
  const values: any[] = [];
  const startDateStr = startDate as string; // Ensure this is a string
  const endDateStr = endDate as string; 

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
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getTicketHistory };
