import { Router, Response } from 'express';
import Joi from 'joi';
import { ShoppingModel } from '../models/Shopping';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

const createItemSchema = Joi.object({
  item_name: Joi.string().required(),
  quantity: Joi.number().required(),
  unit: Joi.string().required(),
});

const updateItemSchema = Joi.object({
  item_name: Joi.string(),
  quantity: Joi.number(),
  unit: Joi.string(),
  is_purchased: Joi.boolean(),
});

// Get shopping list
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const items = await ShoppingModel.findByUser(req.userId!);
    res.json({ items, count: items.length });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item
router.post('/', authenticate, validateRequest(createItemSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { item_name, quantity, unit } = req.body;
    const item = await ShoppingModel.create(req.userId!, item_name, quantity, unit);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item
router.put('/:itemId', authenticate, validateRequest(updateItemSchema), async (req: AuthRequest, res: Response) => {
  try {
    const item = await ShoppingModel.update(parseInt(req.params.itemId), req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
router.delete('/:itemId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const success = await ShoppingModel.delete(parseInt(req.params.itemId));
    if (!success) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
