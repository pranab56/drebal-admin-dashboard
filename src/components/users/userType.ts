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
  status: 'Active' | 'Blocked' | 'Inactive' | 'Pending'; // More specific status types
  verified?: boolean;
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
  totalTicketsPurchased?: number;
  totalSpend?: string;
  totalEarn?: string;
  // Organizer specific fields
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