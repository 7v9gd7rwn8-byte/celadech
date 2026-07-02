import { pool } from '../index';
import { QueryResult } from 'pg';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  bio?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(username: string, email: string, passwordHash: string): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, passwordHash]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  static async update(id: number, updates: Partial<User>): Promise<User> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
