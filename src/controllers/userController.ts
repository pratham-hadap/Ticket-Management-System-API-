import { Request, Response } from 'express';
import pool from '../models/db';
import bcrypt from 'bcryptjs';

const createUser = async (req: Request, res: Response) => {
  const { name, email, type, password } = req.body;

  // Validation
  if (type !== 'customer' && type !== 'admin') {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, type, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
      [name, email, type, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === '23505') {
        // handle specific error code
      }
    }
  }
};

export { createUser };
