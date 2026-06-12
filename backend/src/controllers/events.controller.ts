import { Request, Response, NextFunction } from 'express';
import { EventsService } from '../services/events.service';
import { successResponse } from '../utils/response';

export class EventsController {
  static async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EventsService.listEvents(req.query);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EventsService.getEventById(req.params.id as string);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await EventsService.createEvent(req.user.id, req.body);
      return successResponse(res, result, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async createEvent(req: Request, res: Response, next: NextFunction) {
    return EventsController.create(req, res, next);
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const { status } = req.body;
      const result = await EventsService.updateStatus(req.params.id as string, req.user.id, status);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await EventsService.updateEvent(req.params.id as string, req.user.id, req.body);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }

  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      const result = await EventsService.deleteEvent(req.params.id as string, req.user.id);
      return successResponse(res, result, 200);
    } catch (error) {
      return next(error);
    }
  }
}
