export interface Ticket {
  id: number;
  sl: string;
  userName: string;
  accountId: string;
  amount: string;
  reSoldUserId: string;
  reSoldTicketUser: string;
}

export interface UserDetails {
  userName: string;
  eventName: string;
  eventCategories: string;
  userAccountId: string;
  ticketNumber: string;
  time: string;
}

export interface EventDetails {
  eventName: string;
  eventCreator: string;
  location: string;
  publishedDate: string;
  finalDeadline: string;
  eventCategories: string;
  registrationStatus: string;
  totalReviews: string;
  earned: string;
  myRevenue: string;
  description: string;
  previousUser: UserDetails;
  updatedUser: UserDetails;
}