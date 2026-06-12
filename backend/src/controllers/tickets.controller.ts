import { Request, Response, NextFunction } from 'express';
import { TicketsService } from '../services/tickets.service';
import { successResponse } from '../utils/response';

export class TicketsController {
  static async getTicketsByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TicketsService.getTicketsByEvent(req.params.eventId as string);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async addTicketType(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await TicketsService.addTicketType(req.params.eventId as string, req.user.id, req.body);
      return successResponse(res, result, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async updateTicketType(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await TicketsService.updateTicketType(req.params.id as string, req.user.id, req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }
}
