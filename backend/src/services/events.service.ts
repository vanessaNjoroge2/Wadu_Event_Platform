import prisma from '../models/prisma';
import { EventStatus, Prisma } from '@prisma/client';

export class EventsService {
  static async listEvents(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {
      status: EventStatus.PUBLISHED,
    };

    if (query.category) {
      where.category = { equals: query.category as string, mode: 'insensitive' };
    }
    if (query.city) {
      where.city = { equals: query.city as string, mode: 'insensitive' };
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search as string, mode: 'insensitive' } },
        { description: { contains: query.search as string, mode: 'insensitive' } },
        { venueName: { contains: query.search as string, mode: 'insensitive' } },
      ];
    }

    const [total, events] = await prisma.$transaction([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          tickets: true,
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
      }),
    ]);

    const formattedEvents = events.map((event) => {
      const cheapestPrice = event.tickets.length > 0
        ? Math.min(...event.tickets.map((t) => t.price))
        : 0;

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        location: `${event.venueName}, ${event.city}`,
        city: event.city,
        country: event.country,
        venueName: event.venueName,
        address: event.address,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        imageUrl: event.imageUrl,
        status: event.status,
        organizer: {
          id: event.organizer.id,
          name: `${event.organizer.firstName} ${event.organizer.lastName}`,
          email: event.organizer.email,
        },
        price: cheapestPrice === 0 ? 'Free' : `KES ${cheapestPrice.toLocaleString()}`,
        tickets: event.tickets.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          price: t.price,
          quantity: t.quantity,
          sold: t.sold,
          available: t.quantity - t.sold,
        })),
        createdAt: event.createdAt,
      };
    });

    return {
      events: formattedEvents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!event) {
      const error = new Error('Event not found');
      (error as any).status = 404;
      throw error;
    }

    const cheapestPrice = event.tickets.length > 0
      ? Math.min(...event.tickets.map((t) => t.price))
      : 0;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      location: `${event.venueName}, ${event.city}`,
      city: event.city,
      country: event.country,
      venueName: event.venueName,
      address: event.address,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      imageUrl: event.imageUrl,
      status: event.status,
      organizer: {
        id: event.organizer.id,
        name: `${event.organizer.firstName} ${event.organizer.lastName}`,
        email: event.organizer.email,
        phone: event.organizer.phone,
      },
      price: cheapestPrice === 0 ? 'Free' : `KES ${cheapestPrice.toLocaleString()}`,
      tickets: event.tickets.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        price: t.price,
        quantity: t.quantity,
        sold: t.sold,
        available: t.quantity - t.sold,
      })),
      createdAt: event.createdAt,
    };
  }

  static async createEvent(organizerId: string, data: any) {
    const { tickets, ...eventFields } = data;

    const event = await prisma.event.create({
      data: {
        ...eventFields,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        organizerId,
        status: data.status || EventStatus.DRAFT,
      },
    });

    if (tickets && Array.isArray(tickets)) {
      for (const t of tickets) {
        await prisma.ticketType.create({
          data: {
            eventId: event.id,
            name: t.name,
            description: t.description || '',
            price: t.price,
            quantity: t.quantity,
          },
        });
      }
    }

    return this.getEventById(event.id);
  }

  static async updateEvent(id: string, organizerId: string, data: any) {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      const error = new Error('Event not found');
      (error as any).status = 404;
      throw error;
    }

    if (event.organizerId !== organizerId) {
      const error = new Error('Unauthorized to modify this event');
      (error as any).status = 403;
      throw error;
    }

    const { tickets, ...eventFields } = data;

    const updateData: any = { ...eventFields };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    await prisma.event.update({
      where: { id },
      data: updateData,
    });

    if (tickets && Array.isArray(tickets)) {
      for (const t of tickets) {
        if (t.id) {
          await prisma.ticketType.update({
            where: { id: t.id },
            data: {
              name: t.name,
              description: t.description,
              price: t.price,
              quantity: t.quantity,
            },
          });
        } else {
          await prisma.ticketType.create({
            data: {
              eventId: id,
              name: t.name,
              description: t.description || '',
              price: t.price,
              quantity: t.quantity,
            },
          });
        }
      }
    }

    return this.getEventById(id);
  }

  static async updateStatus(id: string, organizerId: string, status: EventStatus) {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      const error = new Error('Event not found');
      (error as any).status = 404;
      throw error;
    }

    if (event.organizerId !== organizerId) {
      const error = new Error('Unauthorized to modify this event');
      (error as any).status = 403;
      throw error;
    }

    await prisma.event.update({
      where: { id },
      data: { status },
    });

    return this.getEventById(id);
  }

  static async deleteEvent(id: string, organizerId: string) {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      const error = new Error('Event not found');
      (error as any).status = 404;
      throw error;
    }

    if (event.organizerId !== organizerId) {
      const error = new Error('Unauthorized to cancel/delete this event');
      (error as any).status = 403;
      throw error;
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.CANCELLED,
      },
    });

    return { message: 'Event cancelled successfully', event: updated };
  }
}
