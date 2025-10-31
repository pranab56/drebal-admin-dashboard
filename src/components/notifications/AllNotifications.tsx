"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { TbBellRinging2 } from "react-icons/tb";
import { HiOutlineBell } from "react-icons/hi";
import { Button } from "@/components/ui/button";

import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import { useAppSelector } from "@/redux/hooks";
function AllNotifications() {
  // Use real-time notifications from Socket.IO
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useSocketNotifications();
  const { isConnected } = useAppSelector((state) => state.notifications);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };
  return (
    <Card className="bg-transparent min-h-[calc(100vh-11.5rem)] ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TbBellRinging2 size={20} />
          All Notifications
        </CardTitle>
        <CardAction>
          <Button
            className=""
            onClick={handleMarkAllAsRead}
            disabled={
              notifications.length === 0 || notifications.every((n) => n.read)
            }
          >
            Mark all as read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Connection lost. Notifications may not be up to date.
            </p>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HiOutlineBell size={48} className="mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start md:items-center justify-between gap-2 border bg-white p-2 rounded-lg ${
                !notification.read
                  ? "border-l-4 border-l-blue-500 bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <HiOutlineBell size={20} className="mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className="text-xs text-gray-600">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>

              {!notification.read && (
                <Button
                  variant="outline"
                  className="bg-white"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default AllNotifications;

// <div className="flex items-center gap-2">
//   <div className="w-3 h-3 rounded-full bg-green-500"></div>
//   <p className="bg-white p-2 rounded-lg">You have a new notification</p>
// </div>;
