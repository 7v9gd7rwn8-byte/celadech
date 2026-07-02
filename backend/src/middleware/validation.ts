import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map((d) => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });
    }

    req.body = value;
    next();
  };
};
