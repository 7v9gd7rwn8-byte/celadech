import { Request, Response, NextFunction } from 'express';
import jwt from 'jwt-simple';

interface AuthRequest extends Request {
  userId?: number;
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.decode(token, process.env.JWT_SECRET || '');
    req.userId = decoded.id;
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export { AuthRequest };
