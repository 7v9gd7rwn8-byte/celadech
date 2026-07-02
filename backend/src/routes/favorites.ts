import { Router, Response } from 'express';
import { FavoriteModel } from '../models/Favorite';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user's favorites
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await FavoriteModel.findByUser(req.userId!);
    res.json({ favorites, count: favorites.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to favorites
router.post('/:recipeId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const recipeId = parseInt(req.params.recipeId);

    // Check if already favorited
    const existing = await FavoriteModel.findByUserAndRecipe(req.userId!, recipeId);
    if (existing) {
      return res.status(409).json({ error: 'Already in favorites' });
    }

    const favorite = await FavoriteModel.create(req.userId!, recipeId);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from favorites
router.delete('/:recipeId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    const success = await FavoriteModel.delete(req.userId!, recipeId);

    if (!success) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
