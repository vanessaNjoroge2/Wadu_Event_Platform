/**
 * Shared type definitions between client and server
 */

export interface DemoResponse {
  message: string;
}

export interface SharedEvent {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  price: string;
  gradient?: string;
  status?: string;
  tag?: string;
}

export interface EventsResponse {
  events: SharedEvent[];
  total: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}
