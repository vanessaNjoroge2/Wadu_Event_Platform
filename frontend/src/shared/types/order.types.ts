export type DeliveryMethod = 'EMAIL' | 'WHATSAPP' | 'BOTH';
export type PaymentMethod = 'CARD' | 'MPESA' | 'PAYPAL' | 'BANK';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  ticketTypeId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  eventId: string;
  items: OrderItem[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
}

export interface Order extends CreateOrderPayload {
  id: string;
  userId?: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  createdAt: string;
}
