"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Eye, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetAllHistoryQuery } from '../../../features/history/historyApi';

export default function UserAccountDeleteHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<DeleteHistoryItem[]>([]);

  const { data, isLoading } = useGetAllHistoryQuery();

  // Format date from ISO string to DD-MM-YYYY
  const formatDate = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Truncate long text with ellipsis
  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Handle search filter
  useEffect(() => {
    if (data?.data) {
      if (!searchQuery.trim()) {
        setFilteredData(data.data);
      } else {
        const filtered = data.data.filter(item =>
          item.deleteReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          formatDate(item.createdAt).toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
      }
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [data, searchQuery]);

  const handleViewReason = (reason: string) => {
    setSelectedReason(reason);
    setIsDialogOpen(true);
  };

  // Pagination calculations
  const itemsPerPage = 10;
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">User Account Delete History</h1>
          </div>
          {data && (
            <p className="text-gray-600 mt-2">
              Total Deletion Records: {totalItems}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
            <Input
              placeholder="Search by reason or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-green-600 focus-visible:ring-green-600 rounded-lg"
            />
          </div>
        </div>

        {/* Table Card */}
        {currentItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              {searchQuery ? 'No deletion history found for your search' : 'No deletion history available'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="text-left p-5 font-semibold text-gray-700 text-sm">
                    User ID
                  </th>
                  <th className="text-left p-5 font-semibold text-gray-700 text-sm">
                    Deletion Reason
                  </th>
                  <th className="text-left p-5 font-semibold text-gray-700 text-sm">
                    Delete Date
                  </th>
                  <th className="text-left p-5 font-semibold text-gray-700 text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b last:border-b-0 border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="p-5 text-sm text-gray-700 font-mono">
                      {truncateText(item.userId, 10)}
                    </td>
                    <td className="p-5 text-sm text-gray-700">
                      {truncateText(item.deleteReason, 60)}
                    </td>
                    <td className="p-5 text-sm text-gray-700">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => handleViewReason(item.deleteReason)}
                        className="text-green-600 cursor-pointer hover:text-green-700 transition-colors"
                        title="View full reason"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalItems > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`${currentPage === 1 ? 'text-gray-400 bg-gray-100 hover:bg-gray-100 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {/* First page */}
            <Button
              onClick={() => handlePageChange(1)}
              className={`w-10 h-10 p-0 ${currentPage === 1 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              1
            </Button>

            {/* Ellipsis if needed */}
            {currentPage > 3 && (
              <Button variant="outline" className="w-10 h-10 p-0" disabled>
                ...
              </Button>
            )}

            {/* Middle pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page > 1 && page < totalPages && Math.abs(page - currentPage) <= 1)
              .map(page => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 p-0 ${currentPage === page ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {page}
                </Button>
              ))}

            {/* Ellipsis if needed */}
            {currentPage < totalPages - 2 && totalPages > 5 && (
              <Button variant="outline" className="w-10 h-10 p-0" disabled>
                ...
              </Button>
            )}

            {/* Last page (if not already shown) */}
            {totalPages > 1 && (
              <Button
                onClick={() => handlePageChange(totalPages)}
                className={`w-10 h-10 p-0 ${currentPage === totalPages ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {totalPages}
              </Button>
            )}

            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`${currentPage === totalPages ? 'bg-green-600 hover:bg-green-700 text-white opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {totalItems > 0 && (
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </div>
        )}

        {/* Reason Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">
                Account Deletion Reason
              </DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedReason}
                </p>
              </div>
            </div>
            <div className="flex justify-center pb-2">
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}