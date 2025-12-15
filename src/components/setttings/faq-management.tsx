"use client";

import { ChevronLeft, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useCreateFAQMutation,
  useDeleteFAQMutation,
  useGetFAQQuery,
  useUpdateFAQMutation
} from '../../features/settings/settingsApi';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
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
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'vanue'>('user');

  // Use debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setIsSearching(false);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const {
    data: faqResponse,
    isLoading,
    isError,
    refetch
  } = useGetFAQQuery({
    type: activeTab,
    searchTerm: debouncedSearch || undefined
  });

  const [createFaq] = useCreateFAQMutation();
  const [updateFaq] = useUpdateFAQMutation();
  const [deleteFaq, { isLoading: deleteFaqLoading }] = useDeleteFAQMutation();

  // Extract FAQs from response
  const faqs = faqResponse?.data || [];
  const meta = faqResponse?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };
  const totalPages = meta.totalPage || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
  };

  const handleAddFAQ = async (newFAQ: Omit<FAQ, '_id' | 'createdAt' | 'updatedAt' | 'type'>, faqType: 'user' | 'vanue') => {
    try {
      const faqData = {
        type: 'faq' as const,
        ...newFAQ,
        faqType
      };

      const response = await createFaq(faqData).unwrap();
      console.log(response);
      refetch();
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create FAQ:', error);
    }
  };

  const handleEditFAQ = async (updatedFAQ: Omit<FAQ, '_id' | 'createdAt' | 'updatedAt' | 'type' | 'faqType'>) => {
    if (selectedFAQ) {
      try {
        const updateData = {
          id: selectedFAQ._id,
          data: {
            question: updatedFAQ.question,
            answer: updatedFAQ.answer,
            type: 'faq' as const,
            faqType: selectedFAQ.faqType,
          }
        };

        await updateFaq(updateData).unwrap();
        refetch();
        setShowEditModal(false);
        setSelectedFAQ(null);
      } catch (error) {
        console.error('Failed to update FAQ:', error);
        alert('Failed to update FAQ. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedFAQ) {
      try {
        await deleteFaq(selectedFAQ._id).unwrap();
        refetch();
        setShowDeleteModal(false);
        setSelectedFAQ(null);
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
        alert('Failed to delete FAQ. Please try again.');
      }
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
    console.log('Page change requested:', page);
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

  const renderFAQTable = (faqList: FAQ[], type: 'user' | 'vanue') => {
    const filteredFaqs = faqList.filter((faq: FAQ) => faq.faqType === type);

    if (filteredFaqs.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {searchQuery
            ? `No ${type === 'user' ? 'User' : 'Venue'} FAQs found matching your search.`
            : `No ${type === 'user' ? 'User' : 'Venue'} FAQs found.`
          }
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Answer Snippet</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredFaqs.map((faq: FAQ) => (
            <tr key={faq._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">{faq.question}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{getAnswerSnippet(faq.answer)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(faq.createdAt).toLocaleDateString()}
              </td>
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
    );
  };

  if (isLoading && !isSearching) {
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
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading FAQs</p>
          <p className="text-sm mt-1">Failed to load FAQ data. Please try again.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Calculate filtered FAQs count
  const filteredFaqsCount = faqs.filter((faq: FAQ) => faq.faqType === activeTab).length;

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

      {/* Tabs for User and Venue FAQs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'user' | 'vanue')} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger className='cursor-pointer' value="user">User FAQs</TabsTrigger>
          <TabsTrigger className='cursor-pointer' value="vanue">Venue FAQs</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {filteredFaqsCount} of {meta.total} {activeTab === 'user' ? 'User' : 'Venue'} FAQs
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'user' ? 'User' : 'Venue'} Questions...`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {renderFAQTable(faqs, activeTab)}
      </div>

      {/* Pagination */}
      {filteredFaqsCount > 0 && (
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
          currentTab={activeTab}
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
          message={`Are you sure you want to delete the ${selectedFAQ.faqType} FAQ "${selectedFAQ.question}"? This action cannot be undone.`}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedFAQ(null);
          }}
          onConfirm={handleDelete}
          isLoading={deleteFaqLoading}
        />
      )}
    </div>
  );
};