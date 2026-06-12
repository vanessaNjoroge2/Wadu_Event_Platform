export interface Event {
  id: string | number;
  title: string;
  category: string;
  location: string;
  date: string;
  price: string;
  gradient?: string;
  status?: string;
  tag?: string;
  imageUrl?: string | null;
}
