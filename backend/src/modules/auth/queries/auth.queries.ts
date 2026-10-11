import { query } from '../../../config/db.js';

export const findUserByEmail = async (email: string) => {
  const sql = `SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`;
  const result = await query(sql, [email.trim()]);
  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const sql = `SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1 LIMIT 1`;
  const result = await query(sql, [id]);
  return result.rows[0];
};

export const createUser = async (name: string, email: string, passwordHash: string, phone = '', role = 'customer') => {
  const sql = `
    INSERT INTO users (name, email, password_hash, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role, created_at
  `;
  const result = await query(sql, [name, email.trim().toLowerCase(), passwordHash, phone, role]);
  return result.rows[0];
};
