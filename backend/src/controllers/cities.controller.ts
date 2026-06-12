import { Request, Response, NextFunction } from 'express';
import prisma from '../models/prisma';
import { successResponse } from '../utils/response';
import { EventStatus } from '@prisma/client';

export class CitiesController {
  static async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await prisma.event.findMany({
        where: {
          status: EventStatus.PUBLISHED,
        },
        select: {
          city: true,
        },
      });

      const counts: Record<string, number> = {};
      const defaultCities = ['Nairobi', 'Lamu', 'Naivasha', 'Kisumu', 'Mombasa'];
      
      defaultCities.forEach(city => {
        counts[city] = 0;
      });

      events.forEach((e) => {
        counts[e.city] = (counts[e.city] || 0) + 1;
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
