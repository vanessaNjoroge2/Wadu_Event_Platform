import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return successResponse(res, result, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.verifyEmail(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async verifyCode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.verifyCode(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resendVerification(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Stateless JWT logout is handled on client-side by discarding the token.
      // We return a generic message acknowledging session end.
      return successResponse(res, { message: 'Logged out successfully' }, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.forgotPassword(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const profile = await AuthService.getMe(req.user.id);
      return successResponse(res, profile, 200);
    } catch (error) {
      return next(error);
    }
  }
}
