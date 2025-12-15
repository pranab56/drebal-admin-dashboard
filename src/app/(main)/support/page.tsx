"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TipTapEditor from '../../../TipTapEditor/TipTapEditor';
import { useDeleteSupportMutation, useFeedbackAdminMutation, useGetAllSupportQuery } from '../../../features/support/supportApi';

interface SupportItem {
  _id: string;
  userId: string;
  email: string;
  message: string;
  status: 'pending' | 'solved';
  createdAt: string;
  adminMessage?: string;
}

interface ApiMeta {
  total: number;
  limit: number;
  totalPage: number;
}

interface ApiResponse {
  data: SupportItem[];
  meta: ApiMeta;
  message?: string;
}

interface FeedbackData {
  data: {
    adminMessage: string;
  };
  id: string;
}

export default function SupportManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [solveDialogOpen, setSolveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState<SupportItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use searchTerm in the query
  const { data: supportData, isLoading, isError, refetch } = useGetAllSupportQuery(searchTerm);
  const [sendFeedBack] = useFeedbackAdminMutation();
  const [deleteSupport] = useDeleteSupportMutation();

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);

  const handleSolve = (support: SupportItem) => {
    setSelectedSupport(support);
    setContent(support.adminMessage || ''); // Pre-fill with existing admin message if any
    setSolveDialogOpen(true);
  };

  const handleDelete = (support: SupportItem) => {
    setSelectedSupport(support);
    setDeleteDialogOpen(true);
  };

  const handleSubmitSolution = async () => {
    if (!selectedSupport || !content.trim()) {
      alert('Please enter a response');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData: FeedbackData = {
        data: {
          adminMessage: content
        },
        id: selectedSupport._id
      };

      const response = await sendFeedBack(feedbackData).unwrap();
      toast.success(response.message || 'Feedback sent successfully');
      setSolveDialogOpen(false);
      setContent('');
      refetch(); // Refresh the data
    } catch (error: unknown) {
      console.error('Failed to send feedback:', error);
      alert('Failed to send feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSupport) return;

    try {
      const response = await deleteSupport(selectedSupport._id).unwrap();
      toast.success(response.message || 'Support deleted successfully');
      setDeleteDialogOpen(false);
      refetch(); // Refresh the data
    } catch (error: unknown) {
      console.error('Failed to delete support:', error);
      toast.error('Failed to delete support');
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Calculate pagination
  const apiData = supportData as ApiResponse | undefined;
  const totalItems = apiData?.meta?.total || 0;
  const totalPages = apiData?.meta?.totalPage || 1;
  const supports = apiData?.data || [];

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Note: If your API supports pagination, you would need to pass page parameter here
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      endPage = Math.max(1, startPage + maxVisiblePages - 1);
    }

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-400"
      >
        Previous
      </Button>
    );

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 p-0 ${currentPage === i ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white'}`}
          variant={currentPage === i ? "default" : "outline"}
        >
          {i}
        </Button>
      );
    }

    // Ellipsis if needed
    if (endPage < totalPages) {
      buttons.push(
        <span key="ellipsis" className="px-2">...</span>
      );
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        className="bg-green-600 hover:bg-green-700 text-white"
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    );

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading support requests</h3>
          <p className="text-red-600 mt-1">Please try again later</p>
          <Button
            onClick={() => refetch()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-semibold">Support Management</h1>
          </div>
          <p className="text-gray-500">Review and solve the problem of users</p>
        </div>

        {/* Review List Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Support Requests ({totalItems})</h2>

          {/* Search Bar */}
          <div className="flex justify-end mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
              <Input
                placeholder="Search by email or message..."
                className="pl-10 border-green-600"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">User ID</th>
                  <th className="text-left p-4 font-medium text-gray-700">Email</th>
                  <th className="text-left p-4 font-medium text-gray-700">Message</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Created At</th>
                  <th className="text-left p-4 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {supports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No support requests found
                    </td>
                  </tr>
                ) : (
                  supports.map((support) => (
                    <tr key={support._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-4 text-sm font-mono text-gray-600 truncate max-w-[150px]">
                        {support.userId}
                      </td>
                      <td className="p-4 text-sm">{support.email}</td>
                      <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {support.message}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${support.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {support.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(support.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="link"
                            className="text-green-600 hover:text-green-700 p-0 h-auto font-medium"
                            onClick={() => handleSolve(support)}
                            disabled={support.status !== 'pending'}
                          >
                            {support.status === 'pending' ? 'Solve' : 'View'}
                          </Button>
                          <Button
                            variant="link"
                            className="text-red-600 hover:text-red-700 p-0 h-auto font-medium"
                            onClick={() => handleDelete(support)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              {renderPaginationButtons()}
            </div>
          )}
        </div>

        {/* Solve Review Dialog */}
        <Dialog open={solveDialogOpen} onOpenChange={setSolveDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {selectedSupport?.status === 'pending' ? 'Solve Support Request' : 'View Support Request'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">User Message</label>
                <Input
                  value={selectedSupport?.message || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              {selectedSupport?.adminMessage && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Previous Admin Response</label>
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-800">{selectedSupport.adminMessage}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Your Response</label>
                <div className="flex-1 overflow-hidden">
                  <TipTapEditor
                    content={content}
                    onChange={handleContentChange}
                    placeholder="Enter your response here..."
                  // editable={selectedSupport?.status === 'pending'}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSolveDialogOpen(false);
                  setContent('');
                }}
                className="bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </Button>
              {selectedSupport?.status === 'pending' && (
                <Button
                  onClick={handleSubmitSolution}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting || !content.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Support Request</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this support request? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setDeleteDialogOpen(false)}
                className="bg-gray-400 text-white hover:bg-gray-500 hover:text-white"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}