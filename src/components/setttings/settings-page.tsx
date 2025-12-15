"use client";

import { ChevronRight } from 'lucide-react';
import { AboutUsModal } from './modals/about-us-modal';
import { ChangePasswordModal } from './modals/change-password-modal';
import { PersonalInfoModal } from './modals/personal-info-modal';
import { PrivacyPolicyModal } from './modals/privacy-policy-modal';
import { TermsConditionModal } from './modals/terms-condition-modal';
import { MenuItem, ModalType, PageType } from './settingsType';

interface SettingsPageProps {
  onNavigate: (page: PageType) => void;
  onOpenModal: (modal: ModalType) => void;
  showModal: ModalType;
  onCloseModal: () => void;
}

export const SettingsPage = ({
  onNavigate,
  onOpenModal,
  showModal,
  onCloseModal
}: SettingsPageProps) => {
  const menuItems: MenuItem[] = [
    { id: 'personal', label: 'Personal Information', highlighted: true },
    { id: 'password', label: 'Change Password' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms and Condition' },
    { id: 'about', label: 'About us' },
    { id: 'faqs', label: 'FAQs' }
  ];

  const handleMenuClick = (id: string) => {
    if (id === 'faqs') {
      onNavigate('faq-management');
    } else {
      onOpenModal(id as ModalType);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-semibold">Setting</h1>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`w-full flex items-center justify-between cursor-pointer p-4 rounded-lg transition-colors ${item.highlighted
              ? 'bg-green-50 border-2 border-green-500'
              : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            <span className="text-gray-800">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        ))}
      </div>

      {/* Modals */}
      {showModal === 'personal' && <PersonalInfoModal onClose={onCloseModal} />}
      {showModal === 'password' && <ChangePasswordModal onClose={onCloseModal} />}
      {showModal === 'privacy' && <PrivacyPolicyModal onClose={onCloseModal} />}
      {showModal === 'terms' && <TermsConditionModal onClose={onCloseModal} />}
      {showModal === 'about' && <AboutUsModal onClose={onCloseModal} />}

      {/* Remove the forgot and verify modals from here - they're handled inside ChangePasswordModal */}
    </div>
  );
};