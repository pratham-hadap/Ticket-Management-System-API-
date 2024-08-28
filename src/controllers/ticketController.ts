import { Request, Response } from 'express';
import pool from '../models/db';

const createTicket = async (req: Request, res: Response) => {
  const { title, description, type, venue, status, price, priority, dueDate, createdBy } = req.body;

  // Validation
  if (new Date(dueDate) <= new Date()) {
    return res.status(400).json({ message: 'Due date must be in the future' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tickets (title, description, type, venue, status, price, priority, due_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, description, type, venue, status, price, priority, dueDate, createdBy]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const assignUserToTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const { userId } = req.body;

  try {
    // Check if ticket is closed
    const ticketResult = await pool.query('SELECT status FROM tickets WHERE id = $1', [ticketId]);
    const ticket = ticketResult.rows[0];
    if (ticket.status === 'closed') {
      return res.status(400).json({ message: 'Cannot assign users to a closed ticket' });
    }

    // Check if user is already assigned
    const assignmentResult = await pool.query('SELECT * FROM ticket_assignments WHERE ticket_id = $1 AND user_id = $2', [ticketId, userId]);
    if (assignmentResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already assigned to this ticket' });
    }

    // Assign user
    await pool.query('INSERT INTO ticket_assignments (ticket_id, user_id) VALUES ($1, $2)', [ticketId, userId]);
    res.json({ message: 'User assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTicketDetails = async (req: Request, res: Response) => {
  const { ticketId } = req.params;

  try {
    const ticketResult = await pool.query(
      `SELECT t.*, json_agg(json_build_object('userId', u.id, 'name', u.name, 'email', u.email)) AS assigned_users
       FROM tickets t
       LEFT JOIN ticket_assignments ta ON t.id = ta.ticket_id
       LEFT JOIN users u ON ta.user_id = u.id
       WHERE t.id = $1
       GROUP BY t.id`,
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticketResult.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { createTicket, assignUserToTicket, getTicketDetails };
