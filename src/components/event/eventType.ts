export interface Organizer {
  name: string;
  email: string;
  status: string;
}

export interface PurchasedTicket {
  id: number;
  accountId: number;
  displayName: string;
  email: string;
  phone: string;
  appliedTime: string;
}

export interface ResoldTicket {
  id: number;
  accountId: number;
  displayName: string;
  updateTime: string;
}

export interface Event {
  id: number;
  name: string;
  location: string;
  category: string;
  earned: string;
  deadline: string;
  status: 'pending' | 'approved' | 'rejected';
  image: string;
  creator: string;
  publishedDate: string;
  registrationStatus: string;
  totalReviews: string;
  revenue: string;
  organizer: Organizer;
  ticketTypes: string[];
  description: string;
  purchasedTickets: PurchasedTicket[];
  resoldTickets: ResoldTicket[];
}

export interface AllEventsPageProps {
  onEventClick: (event: Event) => void;
}

export interface EventDetailsPageProps {
  event: Event;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export interface InfoCardProps {
  label: string;
  value: string;
}

export interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface TicketModalProps {
  ticket: ResoldTicket;
  onClose: () => void;
}

export interface DetailRowProps {
  label: string;
  value: string;
}