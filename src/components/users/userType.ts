export interface User {
  _id: string;
  accountNumber: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'ORGANIZER' | 'Attendee' | 'Organizer';
  email: string;
  dob: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
  status: string;
  verified: boolean;
  // Additional fields from API
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
  // Attendee specific fields
  totalTicketsSold?: number;
  totalSpend?: string;
  totalEarn?: string;
  totalTicketsPurchased?: number;
  // Organizer specific fields
  totalEvents?: number;
  activeEvents?: string;
  totalTicketsSoldOrg?: number;
  totalRevenue?: string;
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