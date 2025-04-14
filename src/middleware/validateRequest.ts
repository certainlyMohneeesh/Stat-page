import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Example validation rules for a service creation request
export const validateRequest = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('status').isIn(['OPERATIONAL', 'DEGRADED', 'PARTIAL_OUTAGE', 'MAJOR_OUTAGE', 'MAINTENANCE'])
    .withMessage('Status must be one of the predefined values'),
  body('description').optional().isString(),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];