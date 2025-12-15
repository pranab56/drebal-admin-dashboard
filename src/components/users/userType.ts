export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'ORGANIZER';
  status: string;
  createdAt: string;
  personalInfo?: {
    phone?: string;
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
  };
  address?: {
    city?: string;
    street?: string;
    country?: string;
    postalCode?: string;
  };
  image?: string;
  totalEvent?: number;
  activeEvents?: number;
  totalSold?: number;
  totalRevenue?: number;
  totalTicketSold?: number;
  purchaseQuantity?: number;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    personalInfo?: {
      phone?: string;
      dateOfBirth?: string;
      firstName?: string;
      lastName?: string;
    };
    address?: {
      city?: string;
      street?: string;
      country?: string;
      postalCode?: string;
    };
  };
}

export interface User {
  _id: string;
  accountNumber?: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'ORGANIZER' | 'Attendee' | 'Organizer';
  email: string;
  dob: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
  status: 'Active' | 'Blocked' | 'Inactive' | 'Pending';
  verified?: boolean;
  personalInfo?: {
    phone?: string;
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
  };
  address?: {
    city?: string;
    street?: string;
    country?: string;
    postalCode?: string;
  };
  sellAmount?: number;
  withDrawAmount?: number;
  totalTicketsPurchased?: number;
  totalSpend?: string;
  totalEarn?: string;
  totalEvents?: number;
  activeEvents?: number;
  totalTicketsSoldOrg?: number;
  totalRevenue?: string;
  totalSold?: number;
}

export interface TicketActivity {
  eventName: string;
  category: string;
  ticketId: string;
  quantity: number;
  purchaseDate: string;
  payment: 'Paid' | 'Pending' | 'Refunded';
  eventDate: string;
  attended: 'Attended' | 'Cancelled' | 'Missed' | 'Upcoming';
}

export interface EventActivity {
  eventName: string;
  venue: string;
  ticketSold: string;
  saleDate: string;
  amount: string;
}

export type UserRole = 'USER' | 'ADMIN' | 'ORGANIZER' | 'Attendee' | 'Organizer';