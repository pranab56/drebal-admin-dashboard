export type PageType = 'settings' | 'faq-management' | 'settings-main';
export type ModalType =
  | 'personal'
  | 'password'
  | 'privacy'
  | 'terms'
  | 'about'
  | 'forgot'
  | 'verify'
  | null;

export interface MenuItem {
  id: string;
  label: string;
  highlighted?: boolean;
}

export interface PersonalInfoForm {
  fullName: string;
  email: string;
  contact: string;
}

export interface PasswordForm {
  old: string;
  new: string;
  confirm: string;
}

export interface ShowPasswords {
  old: boolean;
  new: boolean;
  confirm: boolean;
}

// Single FAQ interface definition
export interface FAQ {
  _id: string;
  type: 'faq';
  faqType: 'user' | 'vanue' | string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  // Optional fields from your API response
  title?: string;
  content?: string;
}

export interface FAQApiResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: FAQ[];
}

export interface FAQFormData {
  question: string;
  answer: string;
  type?: 'faq';
  faqType?: 'user' | 'vanue' | string;
}

export interface FAQCreateData {
  type: 'faq';
  faqType: 'user' | 'vanue';
  question: string;
  answer: string;
}

export interface FAQUpdateData {
  data: {
    type: 'faq';
    faqType: 'user' | 'vanue';
    question: string;
    answer: string;
  };
  id: string;
}

export interface BaseModalProps {
  onClose: () => void;
}

// For pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

// For search
export interface SearchParams {
  type: 'user' | 'vanue';
  searchTerm?: string;
  page?: number;
  limit?: number;
}

// For FAQ Query
export interface FAQQueryParams {
  type: 'user' | 'vanue';
  searchTerm?: string;
}

// For API response
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta: ApiMeta;
  data: T[];
}