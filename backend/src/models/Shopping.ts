import { pool } from '../index';

export interface ShoppingItem {
  id: number;
  user_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  is_purchased: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ShoppingModel {
  static async create(
    userId: number,
    itemName: string,
    quantity: number,
    unit: string
  ): Promise<ShoppingItem> {
    const result = await pool.query(
      'INSERT INTO shopping_items (user_id, item_name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, itemName, quantity, unit]
    );
    return result.rows[0];
  }

  static async findByUser(userId: number): Promise<ShoppingItem[]> {
    const result = await pool.query(
      'SELECT * FROM shopping_items WHERE user_id = $1 ORDER BY is_purchased ASC, created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async update(id: number, updates: Partial<ShoppingItem>): Promise<ShoppingItem> {
    const fields = Object.keys(updates).filter((f) => f !== 'id' && f !== 'user_id');
    const values = fields.map((f) => updates[f as keyof ShoppingItem]);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE shopping_items SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM shopping_items WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
