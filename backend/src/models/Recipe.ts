import { pool } from '../index';

export interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  ingredients: any[];
  instructions: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty_level?: string;
  cuisine?: string;
  created_at: Date;
  updated_at: Date;
}

export class RecipeModel {
  static async create(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    const result = await pool.query(
      `INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty_level, cuisine)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        recipe.user_id,
        recipe.title,
        recipe.description,
        JSON.stringify(recipe.ingredients),
        recipe.instructions,
        recipe.prep_time,
        recipe.cook_time,
        recipe.servings,
        recipe.difficulty_level,
        recipe.cuisine,
      ]
    );
    return result.rows[0];
  }

  static async findAll(limit = 50, offset = 0): Promise<Recipe[]> {
    const result = await pool.query(
      'SELECT * FROM recipes ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Recipe | null> {
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: number): Promise<Recipe[]> {
    const result = await pool.query('SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  static async search(query: string, limit = 50): Promise<Recipe[]> {
    const result = await pool.query(
      `SELECT * FROM recipes WHERE title ILIKE $1 OR description ILIKE $1 OR cuisine ILIKE $1 LIMIT $2`,
      [`%${query}%`, limit]
    );
    return result.rows;
  }

  static async update(id: number, updates: Partial<Recipe>): Promise<Recipe> {
    const fields = Object.keys(updates).filter((f) => f !== 'id' && f !== 'user_id');
    const values = fields.map((f) => updates[f as keyof Recipe]);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE recipes SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
