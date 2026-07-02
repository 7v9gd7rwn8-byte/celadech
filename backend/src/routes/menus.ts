import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get menus
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implement menu routes
    res.json({ message: 'Get menus - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create menu
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implement menu routes
    res.json({ message: 'Create menu - coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
