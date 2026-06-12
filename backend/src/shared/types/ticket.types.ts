export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;      // KES
  quantity: number;
  sold: number;
  available: number;  // computed: quantity - sold
}
