export type PageType = 'settings' | 'faq';
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

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface BaseModalProps {
  onClose: () => void;
}