"use client";

import { ChevronLeft, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';
import { AddFAQModal } from './modals/add-faq-modal';

import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { EditFAQModal } from './modals/edit-faq-modal';
import { FAQ, PageType } from './settingsType';

interface FAQManagementProps {
  onNavigate: (page: PageType) => void;
}

export const FAQManagement = ({ onNavigate }: FAQManagementProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: 'How do I reset my password?',
      answer: 'To reset your password, navigate to the login page and click on "Forgot Password". Follow the instructions sent to your email.'
    },
    {
      id: 2,
      question: 'How can I update my profile information?',
      answer: 'You can update your profile by going to Settings > Personal Information. Make your changes and click Save.'
    },
    {
      id: 3,
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, debit cards, PayPal, and bank transfers for all transactions.'
    },
    {
      id: 4,
      question: 'How do I contact customer support?',
      answer: 'You can contact our support team through the contact form on our website or email us at support@example.com.'
    },
    {
      id: 5,
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. No cancellation fees apply.'
    },
    {
      id: 6,
      question: 'How do I download my invoices?',
      answer: 'Invoices can be downloaded from your account dashboard under the Billing section.'
    },
    {
      id: 7,
      question: 'Is my data secure?',
      answer: 'We use industry-standard encryption and security measures to protect your data. Your privacy is our top priority.'
    },
    {
      id: 8,
      question: 'What is your refund policy?',
      answer: 'We offer a 30-day money-back guarantee for all our subscription plans. Contact support for refund requests.'
    },
    {
      id: 9,
      question: 'How do I upgrade my plan?',
      answer: 'You can upgrade your plan from your account dashboard. Go to Billing > Upgrade Plan and select your desired plan.'
    }
  ]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(faqs.length / itemsPerPage);

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate FAQs
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddFAQ = (newFAQ: Omit<FAQ, 'id'>) => {
    const id = Math.max(...faqs.map(f => f.id), 0) + 1;
    setFaqs(prev => [...prev, { ...newFAQ, id }]);
    setShowAddModal(false);
  };

  const handleEditFAQ = (updatedFAQ: Omit<FAQ, 'id'>) => {
    if (selectedFAQ) {
      setFaqs(prev => prev.map(faq =>
        faq.id === selectedFAQ.id ? { ...updatedFAQ, id: selectedFAQ.id } : faq
      ));
      setShowEditModal(false);
      setSelectedFAQ(null);
    }
  };

  const handleDelete = () => {
    if (selectedFAQ) {
      setFaqs(prev => prev.filter(faq => faq.id !== selectedFAQ.id));
      setShowDeleteModal(false);
      setSelectedFAQ(null);
    }
  };

  const openEditModal = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setShowEditModal(true);
  };

  const openDeleteModal = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setShowDeleteModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getAnswerSnippet = (answer: string) => {
    // Remove HTML tags and get plain text
    const text = answer.replace(/<[^>]*>/g, '');
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 8;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 3 pages
      for (let i = 1; i <= 3; i++) {
        pages.push(i);
      }

      // Show ellipsis if needed
      if (currentPage > 5) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Show current page and neighbors
      const start = Math.max(4, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 3) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('settings')}
          className="cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-semibold">FAQ Management</h1>
      </div>

      <p className="text-gray-600 mb-6">View, search, and manage Frequently Asked Questions.</p>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">FAQ List</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>

      <div className="flex justify-end mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {paginatedFaqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No FAQs found. {searchQuery && 'Try adjusting your search query.'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Answer Snippet</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedFaqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{faq.question}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{getAnswerSnippet(faq.answer)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(faq)}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(faq)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredFaqs.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {getPageNumbers().map((page, index) => (
            page === -1 || page === -2 ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1">...</span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            )
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showAddModal && (
        <AddFAQModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddFAQ}
        />
      )}

      {/* Edit FAQ Modal */}
      {showEditModal && selectedFAQ && (
        <EditFAQModal
          faq={selectedFAQ}
          onClose={() => {
            setShowEditModal(false);
            setSelectedFAQ(null);
          }}
          onEdit={handleEditFAQ}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFAQ && (
        <DeleteConfirmationModal
          title="Delete FAQ"
          message={`Are you sure you want to delete the FAQ "${selectedFAQ.question}"? This action cannot be undone.`}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedFAQ(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};