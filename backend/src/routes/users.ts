import { Router, Response } from 'express';
import { UserModel } from '../models/User';
import { RecipeModel } from '../models/Recipe';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { bio, avatar_url } = req.body;

    const user = await UserModel.update(req.userId!, {
      bio,
      avatar_url,
    } as any);

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's recipes
router.get('/:userId/recipes', async (req: AuthRequest, res: Response) => {
  try {
    const recipes = await RecipeModel.findByUserId(parseInt(req.params.userId));
    res.json({ recipes, count: recipes.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
