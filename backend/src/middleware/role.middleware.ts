import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { Role } from '@prisma/client';

export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role as Role)) {
      return errorResponse(res, 'Access denied: Insufficient permissions', 403);
    }

    return next();
  };
};
