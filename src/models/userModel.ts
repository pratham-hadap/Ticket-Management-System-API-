import pool from './db';

export const createUser = async (name: string, email: string, type: string, password: string) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, type, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, type, password]
  );
  return result.rows[0];
};

// Add other user-related functions
