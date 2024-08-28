import { Request, Response } from 'express';
import pool from '../models/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  res.json({ token });
};

export { loginUser };
