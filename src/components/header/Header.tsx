"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ChevronDown } from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { baseURL } from '../../../utils/BaseURL';
import { useGetAllNotificationQuery } from '../../features/notification/notifications';
import { useGetPersonalInformationQuery } from '../../features/settings/settingsApi';

// Updated notification interface to match actual API response
interface Notification {
  _id: string;
  eventName: string;
  eventDate: string;
  notification: string;
}

// Updated response structure to match API
interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: Notification[];
  };
}

// Define personal information interface
interface PersonalInfo {
  name?: string;
  role?: string;
  image?: string;
}

interface PersonalInfoResponse {
  data?: PersonalInfo;
  message?: string;
}

export default function MainlandHeader() {
  const router = useRouter();

  const {
    data: personalInformation,
    isLoading: personalInformationLoading,
  } = useGetPersonalInformationQuery({});

  const { data: notificationsData, isLoading: notificationsLoading } = useGetAllNotificationQuery({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Get notifications from the nested data structure
  const notificationsResponse = notificationsData as NotificationsResponse | undefined;
  const notifications = notificationsResponse?.data?.data || [];
  const totalNotifications = notificationsResponse?.data?.meta?.total || 0;

  // Since API doesn't have 'read' field, we'll show total count
  // You may want to implement read tracking separately
  const unreadCount = totalNotifications;

  // Format time ago function
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week${Math.floor(diffInSeconds / 604800) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInSeconds / 31536000)} year${Math.floor(diffInSeconds / 31536000) > 1 ? 's' : ''} ago`;
  };

  // Get avatar fallback text
  const getAvatarFallback = (eventName?: string): string => {
    if (!eventName) return 'EV';
    const words = eventName.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return eventName.substring(0, 2).toUpperCase();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
  };

  const handleMyProfile = () => {
    router.push("/settings");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsDropdownOpen(false);
    // Clear any authentication tokens here if needed
    router.push("/auth/login");
  };

  const handleViewAllClick = () => {
    setIsNotificationOpen(false);
    router.push("/notifications");
  };

  const handleNotificationItemClick = (notification: Notification) => {
    console.log(notification)
    setIsNotificationOpen(false);
    // Navigate based on notification - you can customize this
    // For example: router.push(`/events/${notification._id}`);
  };

  // Loading state
  if (personalInformationLoading) {
    return (
      <div className="w-full border-b bg-white">
        <header className="flex h-16 items-center justify-end px-6 gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </header>
      </div>
    );
  }

  const personalInfoResponse = personalInformation as PersonalInfoResponse | undefined;
  const personalInfo = personalInfoResponse?.data;

  return (
    <div className="w-full border-b bg-white">
      <header className="flex h-16 items-center justify-end px-6 gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="relative flex cursor-pointer items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-[#00a651] hover:bg-[#00a651] border-2 border-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {totalNotifications} total notification{totalNotifications !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {notificationsLoading ? (
                  // Loading skeleton for notifications
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border-b border-gray-100">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                  ))
                ) : notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification: Notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationItemClick(notification)}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleNotificationItemClick(notification);
                        }
                      }}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-[#00a651]">
                        <AvatarFallback className="font-medium bg-green-100 text-green-800 border-green-200">
                          {getAvatarFallback(notification.eventName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {notification.eventName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                          {notification.notification}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[10px] text-gray-500">
                            {formatTimeAgo(notification.eventDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-gray-500">Event Date:</span>
                          <span className="text-[10px] text-gray-700 font-medium">
                            {new Date(notification.eventDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty state
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Bell className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No notifications yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      We&apos;ll notify you when something arrives
                    </p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={handleViewAllClick}
                    className="w-full cursor-pointer text-xs text-[#00a651] hover:text-[#008f45] font-medium py-2 text-center transition-colors"
                    type="button"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            disabled={personalInformationLoading}
            type="button"
            aria-label="User profile menu"
          >
            <Avatar className="h-9 w-9 ring-2 ring-gray-200">
              {personalInfo?.image ? (
                <Image
                  src={baseURL + personalInfo.image}
                  alt={`${personalInfo?.name || 'User'} profile`}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-cover"
                  onError={(e) => {
                    // Fallback to avatar on error
                    const imgElement = e.currentTarget;
                    imgElement.style.display = 'none';
                  }}
                />
              ) : null}
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[120px]">
                {personalInfo?.name || 'User'}
              </span>
              <span className="text-[11px] text-gray-500 capitalize">
                {personalInfo?.role?.toLowerCase() || 'user'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
              <button
                onClick={handleMyProfile}
                className="flex w-full px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors text-left"
                type="button"
              >
                My Profile
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex w-full px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-gray-50 transition-colors text-left"
                type="button"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}