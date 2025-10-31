export interface User {
  id: string;
  accountNumber: string;
  name: string;
  role: 'Attendee' | 'Organizer';
  email: string;
  dob: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
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