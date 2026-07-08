import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(' Error caught by global handler:', err);
  
  const status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.errors || null;

  if (status === 500 && env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
    details = null;
  }

  return errorResponse(res, message, status, details);
};
