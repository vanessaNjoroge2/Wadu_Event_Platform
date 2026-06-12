import { Request, Response, NextFunction } from 'express';
import { OrganizerService } from '../services/organizer.service';
import { successResponse } from '../utils/response';

export class OrganizerController {
  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrganizerService.getDashboardStats(req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getOrganizerEvents(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrganizerService.getOrganizerEvents(req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getEventAttendees(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrganizerService.getEventAttendees(req.params.id as string, req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getRevenueAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrganizerService.getRevenueAnalytics(req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getDailySalesAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrganizerService.getDailySalesAnalytics(req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getTicketCategoriesAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrganizerService.getTicketCategoriesAnalytics(req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getPayouts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrganizerService.getPayouts(req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }
}
