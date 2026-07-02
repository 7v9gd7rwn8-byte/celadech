import { Router, Response } from 'express';
import Joi from 'joi';
import { RecipeModel } from '../models/Recipe';
import { FavoriteModel } from '../models/Favorite';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

const createRecipeSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(2000),
  ingredients: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().required(),
    unit: Joi.string().required(),
  })).required(),
  instructions: Joi.string().required(),
  prep_time: Joi.number(),
  cook_time: Joi.number(),
  servings: Joi.number(),
  difficulty_level: Joi.string().valid('easy', 'medium', 'hard'),
  cuisine: Joi.string(),
});

// Get all recipes
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const recipes = await RecipeModel.findAll(limit, offset);
    res.json({ recipes, count: recipes.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search recipes
router.get('/search', async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const recipes = await RecipeModel.search(query);
    res.json({ recipes, count: recipes.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recipe by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const recipe = await RecipeModel.findById(parseInt(req.params.id));
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create recipe
router.post('/', authenticate, validateRequest(createRecipeSchema), async (req: AuthRequest, res: Response) => {
  try {
    const recipe = await RecipeModel.create({
      user_id: req.userId!,
      ...req.body,
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update recipe
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const recipe = await RecipeModel.findById(parseInt(req.params.id));
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await RecipeModel.update(recipe.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete recipe
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const recipe = await RecipeModel.findById(parseInt(req.params.id));
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await RecipeModel.delete(recipe.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
