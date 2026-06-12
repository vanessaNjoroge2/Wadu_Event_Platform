import prisma from '../models/prisma';

export class TicketsService {
  static async getTicketsByEvent(eventId: string) {
    const tickets = await prisma.ticketType.findMany({
      where: { eventId },
    });

    return tickets.map((t) => ({
      id: t.id,
      eventId: t.eventId,
      name: t.name,
      description: t.description,
      price: t.price,
      quantity: t.quantity,
      sold: t.sold,
      available: t.quantity - t.sold,
    }));
  }

  static async addTicketType(eventId: string, organizerId: string, data: any) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      const error = new Error('Event not found');
      (error as any).status = 404;
      throw error;
    }

    if (event.organizerId !== organizerId) {
      const error = new Error('Unauthorized to add ticket types to this event');
      (error as any).status = 403;
      throw error;
    }

    const ticket = await prisma.ticketType.create({
      data: {
        eventId,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
      },
    });

    return {
      ...ticket,
      available: ticket.quantity - ticket.sold,
    };
  }

  static async updateTicketType(id: string, organizerId: string, data: any) {
    const ticket = await prisma.ticketType.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      const error = new Error('Ticket type not found');
      (error as any).status = 404;
      throw error;
    }

    if (ticket.event.organizerId !== organizerId) {
      const error = new Error('Unauthorized to modify this ticket type');
      (error as any).status = 403;
      throw error;
    }

    const updated = await prisma.ticketType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
      },
    });

    return {
      id: updated.id,
      eventId: updated.eventId,
      name: updated.name,
      description: updated.description,
      price: updated.price,
      quantity: updated.quantity,
      sold: updated.sold,
      available: updated.quantity - updated.sold,
    };
  }
}
