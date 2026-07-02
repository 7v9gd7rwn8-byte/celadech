import { Router, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { UserModel } from '../models/User';
import { validateRequest } from '../middleware/validation';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register
router.post('/register', validateRequest(registerSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '10'));

    // Create user
    const user = await UserModel.create(username, email, passwordHash);

    // Generate token
    const token = jwt.encode(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || ''
    );

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', validateRequest(loginSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.encode(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || ''
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
