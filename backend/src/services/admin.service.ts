import prisma from '../models/prisma';
import { Role, EventStatus } from '@prisma/client';

export class AdminService {
  static async getPlatformStats() {
    const totalUsers = await prisma.user.count();
    const organizerCount = await prisma.user.count({ where: { role: Role.ORGANIZER } });
    const attendeeCount = await prisma.user.count({ where: { role: Role.ATTENDEE } });

    const totalEvents = await prisma.event.count();
    const publishedEventsCount = await prisma.event.count({ where: { status: EventStatus.PUBLISHED } });

    const totalOrders = await prisma.order.count();
    const ordersPaid = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      select: { total: true }
    });
    const totalRevenue = ordersPaid.reduce((acc, curr) => acc + curr.total, 0);

    const ticketTypes = await prisma.ticketType.findMany({
      select: { sold: true }
    });
    const totalTicketsSold = ticketTypes.reduce((acc, curr) => acc + curr.sold, 0);

    // Recent events, users, and orders
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    const recentEvents = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true
      }
    });

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        event: { select: { title: true } }
      }
    });

    return {
      totalUsers,
      organizerCount,
      attendeeCount,
      totalEvents,
      publishedEventsCount,
      totalTicketsSold,
      totalRevenue,
      totalOrders,
      recentUsers,
      recentEvents,
      recentOrders
    };
  }

  static async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });
  }

  static async updateUserRole(userId: string, role: Role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
  }

  static async deleteUser(userId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Get all events created by this user
      const userEvents = await tx.event.findMany({
        where: { organizerId: userId },
        select: { id: true }
      });
      const eventIds = userEvents.map(e => e.id);

      // Get all ticket types for those events
      const ticketTypes = await tx.ticketType.findMany({
        where: { eventId: { in: eventIds } },
        select: { id: true }
      });
      const ticketTypeIds = ticketTypes.map(t => t.id);

      // Get all orders placed by this user OR orders placed for this user's events
      const userOrders = await tx.order.findMany({
        where: {
          OR: [
            { userId: userId },
            { eventId: { in: eventIds } }
          ]
        },
        select: { id: true }
      });
      const orderIds = userOrders.map(o => o.id);

      // 2. Delete OrderItems for those orders OR for those ticket types
      await tx.orderItem.deleteMany({
        where: {
          OR: [
            { orderId: { in: orderIds } },
            { ticketTypeId: { in: ticketTypeIds } }
          ]
        }
      });

      // 3. Delete MpesaTransactions for those orders
      await tx.mpesaTransaction.deleteMany({
        where: { orderId: { in: orderIds } }
      });

      // 4. Delete Orders
      await tx.order.deleteMany({
        where: { id: { in: orderIds } }
      });

      // 5. Delete TicketTypes
      await tx.ticketType.deleteMany({
        where: { eventId: { in: eventIds } }
      });

      // 6. Delete Events
      await tx.event.deleteMany({
        where: { organizerId: userId }
      });

      // 7. Delete User
      return tx.user.delete({
        where: { id: userId }
      });
    });
  }

  static async getEvents() {
    return prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        tickets: true
      }
    });
  }

  static async updateEventStatus(eventId: string, status: EventStatus) {
    return prisma.event.update({
      where: { id: eventId },
      data: { status }
    });
  }

  static async getOrders() {
    return prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true
          }
        },
        items: {
          include: {
            ticketType: true
          }
        }
      }
    });
  }
}
