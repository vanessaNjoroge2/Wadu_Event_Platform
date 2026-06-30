import prisma from '../models/prisma';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { sendTicketEmail } from '../utils/email';

export class OrdersService {
  static async createOrder(userId: string | null, data: any) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get the event
      const event = await tx.event.findUnique({
        where: { id: data.eventId },
        include: { tickets: true },
      });

      if (!event) {
        const error = new Error('Event not found');
        (error as any).status = 404;
        throw error;
      }

      let subtotal = 0;
      const itemsToCreate = [];

      // 2. Validate ticket types and availability
      for (const item of data.items) {
        const ticketType = event.tickets.find((t) => t.id === item.ticketTypeId);
        if (!ticketType) {
          const error = new Error(`Ticket type ${item.ticketTypeId} not found`);
          (error as any).status = 400;
          throw error;
        }

        const available = ticketType.quantity - ticketType.sold;
        if (available < item.quantity) {
          const error = new Error(`Insufficient tickets available for ${ticketType.name}. Requested ${item.quantity}, available ${available}`);
          (error as any).status = 400;
          throw error;
        }

        subtotal += ticketType.price * item.quantity;
        itemsToCreate.push({
          ticketTypeId: ticketType.id,
          quantity: item.quantity,
          unitPrice: ticketType.price,
        });
      }

      const serviceFee = Math.floor(subtotal * 0.1);
      const total = subtotal + serviceFee;

      // CARD, PAYPAL, BANK are auto-paid stubs. MPESA is PENDING.
      let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
      if (data.paymentMethod === PaymentMethod.CARD ||
          data.paymentMethod === PaymentMethod.PAYPAL ||
          data.paymentMethod === PaymentMethod.BANK) {
        paymentStatus = PaymentStatus.PAID;
      }

      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          eventId: data.eventId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          deliveryMethod: data.deliveryMethod,
          paymentMethod: data.paymentMethod,
          paymentStatus,
          paymentRef: paymentStatus === PaymentStatus.PAID ? `MOCK-REF-${Date.now()}` : null,
          subtotal,
          serviceFee,
          total,
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: {
            include: {
              ticketType: true,
            },
          },
        },
      });

      // If paid, increment sold count
      if (paymentStatus === PaymentStatus.PAID) {
        for (const item of itemsToCreate) {
          await tx.ticketType.update({
            where: { id: item.ticketTypeId },
            data: {
              sold: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      // Trigger email asynchronously only if order is paid
      if (paymentStatus === PaymentStatus.PAID && (data.deliveryMethod === 'EMAIL' || data.deliveryMethod === 'BOTH')) {
        setTimeout(() => {
          sendTicketEmail(data.email, {
            firstName: data.firstName,
            lastName: data.lastName,
            eventTitle: event.title,
            orderId: order.id,
            total,
          }).catch(err => console.error('Email error:', err));
        }, 0);
      }

      return order;
    });
  }

  static async listOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        event: true,
        items: {
          include: {
            ticketType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getOrderDetails(id: string, userId: string, userRole: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        event: true,
        items: {
          include: {
            ticketType: true,
          },
        },
      },
    });

    if (!order) {
      const error = new Error('Order not found');
      (error as any).status = 404;
      throw error;
    }

    const isOwner = order.userId === userId;
    const isOrganizer = userRole === 'ORGANIZER' && order.event.organizerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isOrganizer && !isAdmin) {
      const error = new Error('Unauthorized to view this order');
      (error as any).status = 403;
      throw error;
    }

    return order;
  }

  static async deleteOrder(id: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!order) {
      const error = new Error('Order not found');
      (error as any).status = 404;
      throw error;
    }

    if (order.userId !== userId) {
      const error = new Error('Unauthorized to delete this order');
      (error as any).status = 403;
      throw error;
    }

    const now = new Date();
    const eventEndDate = order.event.endDate ? new Date(order.event.endDate) : new Date(order.event.startDate);

    if (eventEndDate > now) {
      const error = new Error('Cannot delete a ticket for an upcoming event.');
      (error as any).status = 400;
      throw error;
    }

    await prisma.$transaction([
      prisma.mpesaTransaction.deleteMany({
        where: { orderId: id },
      }),
      prisma.orderItem.deleteMany({
        where: { orderId: id },
      }),
      prisma.order.delete({
        where: { id },
      }),
    ]);

    return { success: true };
  }
}
