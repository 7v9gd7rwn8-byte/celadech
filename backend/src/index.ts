import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import authRoutes from './routes/auth';
import recipesRoutes from './routes/recipes';
import usersRoutes from './routes/users';
import favoritesRoutes from './routes/favorites';
import menusRoutes from './routes/menus';
import shoppingListRoutes from './routes/shopping';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/shopping-list', shoppingListRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
});
