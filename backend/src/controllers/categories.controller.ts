import { Request, Response, NextFunction } from 'express';
import prisma from '../models/prisma';
import { successResponse } from '../utils/response';
import { EventStatus } from '@prisma/client';

export class CategoriesController {
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await prisma.event.findMany({
        where: {
          status: EventStatus.PUBLISHED,
        },
        select: {
          category: true,
        },
      });

      const counts: Record<string, number> = {};
      
      // Default categories to ensure we return them even if count is 0
      const defaultCategories = [
        'Music',
        'Technology',
        'Outdoors',
        'Sports',
        'Culture',
        'Art',
        'Food',
        'Fashion'
      ];
      
      defaultCategories.forEach(cat => {
        counts[cat] = 0;
      });

      events.forEach((e) => {
        counts[e.category] = (counts[e.category] || 0) + 1;
      });

      const data = Object.keys(counts).map((name) => ({
        name,
        count: counts[name],
      }));

      return successResponse(res, data, 200);
    } catch (error) {
      return next(error);
    }
  }
}
