import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { successResponse } from '../utils/response';

export class AdminController {
  static async getPlatformStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getPlatformStats();
      return successResponse(res, stats, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getUsers();
      return successResponse(res, users, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;
      const user = await AdminService.updateUserRole(req.params.id as string, role);
      return successResponse(res, user, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteUser(req.params.id as string);
      return successResponse(res, { message: 'User deleted successfully' }, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await AdminService.getEvents();
      return successResponse(res, events, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateEventStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const event = await AdminService.updateEventStatus(req.params.id as string, status);
      return successResponse(res, event, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await AdminService.getOrders();
      return successResponse(res, orders, 200);
    } catch (error) {
      return next(error);
    }
  }
}
