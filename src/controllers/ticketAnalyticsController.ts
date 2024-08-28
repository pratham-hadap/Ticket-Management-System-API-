import { Request, Response } from 'express';
import pool from '../models/db';

const getTicketAnalytics = async (req: Request, res: Response) => {
  const { type, status } = req.query;

  let query = `SELECT type,
                      COUNT(*) AS totalTickets,
                      SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS openTickets,
                      SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closedTickets
               FROM tickets`;

  const filters: string[] = [];
  const values: any[] = [];

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
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getTicketAnalytics };
