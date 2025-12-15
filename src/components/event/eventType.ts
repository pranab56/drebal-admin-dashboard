// =====================
// Category & Ticket
// =====================

export interface Category {
  categoryId: {
    _id: string;
    title: string;
  };
  subCategory: SubCategory[];
  _id: string;
}

export interface SubCategory {
  _id: string;
  title: string;
}

export interface Ticket {
  type: string;
  price: number;
  availableUnits: number;
  outstandingUnits: number;
  earnedAmount: number;
  ticketBuyerId: string[];
  _id: string;
  perticipentCount: number;
}

// =====================
// Discount & Review
// =====================

export interface DiscountCode {
  _id: string;
  code: string;
  percentage: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// =====================
// Main Event Type
// =====================

export interface EventData {
  _id: string;
  userId: string;
  eventName: string;
  image: string;
  category: Category[];
  tags: string[];
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;

  EventStatus:
  | 'UnderReview'
  | 'Live'
  | 'Rejected'
  | 'Completed'
  | 'Cancelled';

  notification: string;
  notificationStatus: 'sent' | 'pending' | 'failed';
  eventCode: string;

  tickets: Ticket[];

  ticketSaleStart: string;
  preSaleStart: string;
  preSaleEnd: string;

  isFreeEvent: boolean;
  discountCodes: DiscountCode[];

  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  locationName: string;

  totalEarned: number;
  totalReview: Review[];

  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

// =====================
// List View (Lightweight)
// =====================

export interface EventListItem {
  _id: string;
  eventName: string;
  image: string;
  eventDate: string;
  startTime: string;
  streetAddress: string;
  streetAddress2: string;

  EventStatus:
  | 'UnderReview'
  | 'Live'
  | 'Rejected'
  | 'Completed'
  | 'Cancelled';

  eventCode: string;
  ticketSaleStart: string;
  preSaleStart: string;
  isFreeEvent: boolean;
}

// =====================
// UI-Specific Types
// =====================

export interface UIEvent {
  id: string;
  name: string;
  location: string;
  category: string;
  earned: string;
  deadline: string;

  status:
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'live'
  | 'completed'
  | 'cancelled';

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

export interface Organizer {
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'blocked';
}

// =====================
// Ticket Activity
// =====================

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

// =====================
// Component Props
// =====================

export interface AllEventsPageProps {
  onEventClick: (eventId: string) => void;
}

export interface EventDetailsPageProps {
  eventId: string;
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

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
}
