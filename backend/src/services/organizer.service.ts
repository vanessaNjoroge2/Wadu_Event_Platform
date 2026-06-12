import prisma from '../models/prisma';
import { PaymentStatus, EventStatus } from '@prisma/client';

export class OrganizerService {
  static async getDashboardStats(organizerId: string) {
    const events = await prisma.event.findMany({
      where: { organizerId },
      select: { id: true, startDate: true, status: true },
    });

    const eventIds = events.map((e) => e.id);

    // Total tickets sold
    const ticketTypes = await prisma.ticketType.findMany({
      where: { eventId: { in: eventIds } },
      select: { sold: true },
    });
    const totalTicketsSold = ticketTypes.reduce((sum, t) => sum + t.sold, 0);

    // Total Revenue (only paid orders)
    const paidOrders = await prisma.order.aggregate({
      where: {
        eventId: { in: eventIds },
        paymentStatus: PaymentStatus.PAID,
      },
      _sum: {
        subtotal: true,
      },
    });
    const totalRevenue = paidOrders._sum.subtotal || 0;

    // Upcoming events count
    const now = new Date();
    const upcomingEventsCount = events.filter(
      (e) => e.startDate > now && e.status === EventStatus.PUBLISHED
    ).length;

    return {
      totalEvents: events.length,
      totalTicketsSold,
      totalRevenue,
      upcomingEventsCount,
    };
  }

  static async getOrganizerEvents(organizerId: string) {
    const events = await prisma.event.findMany({
      where: { organizerId },
      include: {
        tickets: true,
        orders: {
          where: { paymentStatus: PaymentStatus.PAID },
          select: { subtotal: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return events.map((event) => {
      const totalCapacity = event.tickets.reduce((sum, t) => sum + t.quantity, 0);
      const ticketsSold = event.tickets.reduce((sum, t) => sum + t.sold, 0);
      const revenue = event.orders.reduce((sum, o) => sum + o.subtotal, 0);

      return {
        id: event.id,
        title: event.title,
        status: event.status,
        startDate: event.startDate,
        ticketsSold,
        totalCapacity,
        revenue,
      };
    });
  }

  static async getEventAttendees(eventId: string, organizerId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      const error = new Error('Event not found');
      (error as any).status = 404;
      throw error;
    }

    if (event.organizerId !== organizerId) {
      const error = new Error('Unauthorized to access attendee list for this event');
      (error as any).status = 403;
      throw error;
    }

    const orders = await prisma.order.findMany({
      where: {
        eventId,
        paymentStatus: PaymentStatus.PAID,
      },
      include: {
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

    const attendees = [];
    for (const order of orders) {
      for (const item of order.items) {
        attendees.push({
          orderId: order.id,
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
          phone: order.phone,
          ticketType: item.ticketType.name,
          quantity: item.quantity,
          purchaseDate: order.createdAt,
        });
      }
    }

    return attendees;
  }

  static async getRevenueAnalytics(organizerId: string) {
    const events = await prisma.event.findMany({
      where: { organizerId },
      select: { id: true },
    });
    const eventIds = events.map((e) => e.id);

    const paidOrders = await prisma.order.findMany({
      where: {
        eventId: { in: eventIds },
        paymentStatus: PaymentStatus.PAID,
      },
      select: {
        subtotal: true,
        createdAt: true,
      },
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue: Record<string, number> = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthlyRevenue[label] = 0;
    }

    for (const order of paidOrders) {
      const orderDate = new Date(order.createdAt);
      const label = `${months[orderDate.getMonth()]} ${orderDate.getFullYear()}`;
      if (monthlyRevenue[label] !== undefined) {
        monthlyRevenue[label] += order.subtotal;
      }
    }

    return Object.keys(monthlyRevenue).map((month) => ({
      month,
      revenue: monthlyRevenue[month],
    }));
  }

  static async getDailySalesAnalytics(organizerId: string) {
    const events = await prisma.event.findMany({
      where: { organizerId },
      select: { id: true },
    });
    const eventIds = events.map((e) => e.id);

    const paidOrders = await prisma.order.findMany({
      where: {
        eventId: { in: eventIds },
        paymentStatus: PaymentStatus.PAID,
      },
      select: {
        createdAt: true,
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });

    const dailySales: Record<string, number> = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
      dailySales[label] = 0;
    }

    for (const order of paidOrders) {
      const orderDate = new Date(order.createdAt);
      const label = `${days[orderDate.getDay()]} ${orderDate.getDate()}/${orderDate.getMonth() + 1}`;
      const ticketsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
      if (dailySales[label] !== undefined) {
        dailySales[label] += ticketsCount;
      }
    }

    return Object.keys(dailySales).map((date) => ({
      date,
      ticketsSold: dailySales[date],
    }));
  }

  static async getTicketCategoriesAnalytics(organizerId: string) {
    const events = await prisma.event.findMany({
      where: { organizerId },
      select: { id: true },
    });
    const eventIds = events.map((e) => e.id);

    const ticketTypes = await prisma.ticketType.findMany({
      where: { eventId: { in: eventIds } },
      select: {
        name: true,
        sold: true,
      },
    });

    const breakdown: Record<string, number> = {};
    for (const t of ticketTypes) {
      breakdown[t.name] = (breakdown[t.name] || 0) + t.sold;
    }

    return Object.keys(breakdown).map((name) => ({
      name,
      value: breakdown[name],
    }));
  }

  static async getPayouts(organizerId: string) {
    const events = await prisma.event.findMany({
      where: { organizerId },
      select: { id: true },
    });
    const eventIds = events.map((e) => e.id);

    const paidOrders = await prisma.order.aggregate({
      where: {
        eventId: { in: eventIds },
        paymentStatus: PaymentStatus.PAID,
      },
      _sum: {
        subtotal: true,
      },
    });

    const totalRevenue = paidOrders._sum.subtotal || 0;
    const paidPayouts = Math.floor(totalRevenue * 0.7);
    const pendingPayout = totalRevenue - paidPayouts;

    return {
      pendingPayout,
      payoutHistory: [
        {
          id: 'pay_1',
          amount: Math.floor(paidPayouts * 0.6),
          status: 'PAID',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          bankName: 'Equity Bank',
          accountNumber: '******1234',
        },
        {
          id: 'pay_2',
          amount: Math.floor(paidPayouts * 0.4),
          status: 'PAID',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          bankName: 'Equity Bank',
          accountNumber: '******1234',
        },
      ],
    };
  }
}
