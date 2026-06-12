import { Request, Response, NextFunction } from 'express';
import { OrdersService } from '../services/orders.service';
import { successResponse } from '../utils/response';

export class OrdersController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // Optional authentication: req.user may be present or undefined (guest)
      const userId = req.user ? req.user.id : null;
      const result = await OrdersService.createOrder(userId, req.body);
      return successResponse(res, result, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrdersService.listOrders(req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await OrdersService.getOrderDetails(req.params.id as string, req.user.id, req.user.role);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }
}
