export type UserRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
