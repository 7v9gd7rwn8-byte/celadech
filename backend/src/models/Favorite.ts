import { pool } from '../index';

export interface Favorite {
  id: number;
  user_id: number;
  recipe_id: number;
  created_at: Date;
}

export class FavoriteModel {
  static async create(userId: number, recipeId: number): Promise<Favorite> {
    const result = await pool.query(
      'INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) RETURNING *',
      [userId, recipeId]
    );
    return result.rows[0];
  }

  static async findByUserAndRecipe(userId: number, recipeId: number): Promise<Favorite | null> {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
    return result.rows[0] || null;
  }

  static async findByUser(userId: number): Promise<Favorite[]> {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async delete(userId: number, recipeId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
