"use client";

import { useState } from 'react';
import { FAQManagement } from './faq-management';
import { SettingsPage } from './settings-page';
import { ModalType, PageType } from './settingsType';


export const SettingsApp = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('settings');
  const [showModal, setShowModal] = useState<ModalType>(null);

  return (
    <div className="">
      {currentPage === 'settings' ? (
        <SettingsPage
          onNavigate={setCurrentPage}
          onOpenModal={setShowModal}
          showModal={showModal}
          onCloseModal={() => setShowModal(null)}
        />
      ) : (
        <FAQManagement onNavigate={setCurrentPage} />
      )}
    </div>
  );
};