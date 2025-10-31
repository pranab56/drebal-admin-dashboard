"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function MainlandHeader() {
  const unreadCount = 5; // Example unread count
  const userName = "Alax tom";
  const userRole = "Admin";
  const userImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alax";
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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
    router.push("/auth/login");
  };

  // Sample notification data
  const notifications = [
    {
      id: 1,
      message: "You have a new message from New Event",
      time: "5 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Event1",
    },
    {
      id: 2,
      message: "You have a new message from New Event",
      time: "5 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Event2",
    },
    {
      id: 3,
      message: "You have a new message from New Event",
      time: "5 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Event3",
    },
    {
      id: 4,
      message: "You have a new message from New Event",
      time: "5 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Event4",
    },
    {
      id: 5,
      message: "You have a new message from New Event",
      time: "5 min ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Event5",
    },
  ];

  return (
    <div className="w-full border-b bg-white">
      <header className="flex h-16 items-center justify-end px-6 gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="relative flex cursor-pointer items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
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
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-[#00a651]">
                      <AvatarImage src={notification.avatar} alt="Event" />
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                        NE
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-200">
                <button className="w-full text-xs text-[#00a651] hover:text-[#008f45] font-medium py-2 text-center transition-colors">
                  View All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Avatar className="h-9 w-9 ring-2 ring-gray-200">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">
                {userName}
              </span>
              <span className="text-[11px] text-gray-500">{userRole}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
              <button
                onClick={handleMyProfile}
                className="flex w-full px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                My Profile
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex w-full px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-gray-50 transition-colors text-left"
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