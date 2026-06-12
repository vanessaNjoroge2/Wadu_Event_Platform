import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { successResponse } from '../utils/response';

export class UsersController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsersService.getProfile(req.params.id as string);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await UsersService.updateProfile(req.params.id as string, req.user.id, req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await UsersService.changePassword(req.params.id as string, req.user.id, req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }
}
