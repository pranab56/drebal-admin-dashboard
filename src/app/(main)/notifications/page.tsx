"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAdminRejectedMutation,
  useAdminSendToboardCastMutation,
  useGetAllNotificationQuery
} from '../../../features/notification/notifications';

// Updated interface to match actual API response
interface Notification {
  _id: string;
  eventName: string;  // Changed from eventTitle
  eventDate: string;
  notification: string;
}

// Updated response structure to match API
interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
    data: Notification[];
  };
}

export default function EventNotificationManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Track loading states for each notification individually
  const [broadcastingIds, setBroadcastingIds] = useState<Set<string>>(new Set());
  const [rejectingIds, setRejectingIds] = useState<Set<string>>(new Set());

  const { data: notificationsData, isLoading, refetch } = useGetAllNotificationQuery({}) as {
    data: NotificationsResponse;
    isLoading: boolean;
    refetch: () => void;
  };

  console.log("notificationsData", notificationsData);

  const [adminSendToBroadcast] = useAdminSendToboardCastMutation();
  const [adminRejected] = useAdminRejectedMutation();

  const handleBroadcast = async (notificationId: string) => {
    // Add this notification ID to broadcasting set
    setBroadcastingIds(prev => new Set(prev).add(notificationId));

    try {
      const response = await adminSendToBroadcast(notificationId).unwrap();
      toast.success(response.message || 'Notification broadcasted successfully');
      refetch(); // Refresh the notifications list
    } catch (error: unknown) {
      console.log('Broadcast error:', error);
      toast.error('Failed to broadcast notification');

      // Type-safe error handling
      if (error instanceof Error) {
        console.log('Error message:', error.message);
      }
    } finally {
      // Remove this notification ID from broadcasting set
      setBroadcastingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleReject = async (notificationId: string) => {
    // Add this notification ID to rejecting set
    setRejectingIds(prev => new Set(prev).add(notificationId));

    try {
      const response = await adminRejected(notificationId).unwrap();
      toast.success(response.message || 'Notification rejected successfully');
      refetch(); // Refresh the notifications list
    } catch (error: unknown) {
      console.log('Reject error:', error);
      toast.error('Failed to reject notification');

      // Type-safe error handling
      if (error instanceof Error) {
        console.log('Error message:', error.message);
      }
    } finally {
      // Remove this notification ID from rejecting set
      setRejectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  // Format date from ISO string to DD-MM-YYYY
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Filter notifications based on search query - Updated to use correct field names
  const filteredNotifications = notificationsData?.data?.data?.filter(notification =>
    notification.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.notification.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil((filteredNotifications.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <h1 className="text-2xl font-semibold">Event Notification Management</h1>
          </div>
          {notificationsData?.data?.meta && (
            <p className="text-gray-600 mt-2">
              Total Notifications: {notificationsData.data.meta.total} |
              Page {notificationsData.data.meta.page} of {notificationsData.data.meta.totalPage}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
            <Input
              placeholder="Search by event name or message..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10 border-green-600 focus-visible:ring-green-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden border">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Event Name</th>
                    <th className="text-left p-4 font-medium text-gray-700">Event Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">Notification Message</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNotifications.map((notification, index) => {
                    const isBroadcasting = broadcastingIds.has(notification._id);
                    const isRejecting = rejectingIds.has(notification._id);

                    return (
                      <tr
                        key={notification._id}
                        className={`border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">{notification.eventName}</div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          {formatDate(notification.eventDate)}
                        </td>
                        <td className="p-4 text-sm text-gray-600 max-w-md">
                          <div>{notification.notification}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleBroadcast(notification._id)}
                              disabled={isBroadcasting || isRejecting}
                              className="text-sm cursor-pointer font-medium text-gray-700 hover:text-gray-900 underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {isBroadcasting && <Loader2 className="w-3 h-3 animate-spin" />}
                              Broadcast
                            </button>
                            <button
                              onClick={() => handleReject(notification._id)}
                              disabled={isRejecting || isBroadcasting}
                              className="text-sm font-medium cursor-pointer text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {isRejecting && <Loader2 className="w-3 h-3 animate-spin" />}
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Pagination */}
        {filteredNotifications.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-400 bg-gray-300 disabled:opacity-50"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 p-0 ${currentPage === page
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {page}
              </Button>
            ))}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}