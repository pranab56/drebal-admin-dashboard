"use client";

import { useSocket } from "@/contexts/SocketContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  markAllAsRead,
  markAsRead,
  removeNotification,
} from "@/redux/slices/notificationSlice";
import { useCallback, useEffect } from "react"; // 👈 Import useCallback

import {
  useReadAllNotificationsMutation,
  useReadSingleNotificationMutation,
} from "@/redux/Apis/notificationApi";

export const useSocketNotifications = () => {
  const dispatch = useAppDispatch();
  const { socket, isConnected } = useSocket();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [readSingleNotification] = useReadSingleNotificationMutation();
  const [readAllNotifications] = useReadAllNotificationsMutation();

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notification = notifications.find((n) => n.id === notificationId);
      const realId = notification?._id || notificationId;

      console.log("Marking notification as read:", { notificationId, realId });

      await readSingleNotification({ id: realId }).unwrap();
      dispatch(markAsRead(notificationId));
    } catch (error) {
      console.log(error);
      dispatch(markAsRead(notificationId));
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await readAllNotifications({}).unwrap();
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      dispatch(markAllAsRead());
    }
  };

  const removeNotificationById = (notificationId: string) => {
    if (socket && isConnected) {
      socket.emit("remove_notification", { notificationId });
      dispatch(removeNotification(notificationId));
    }
  };

  // ✅ Wrap in useCallback to stabilize reference
  const requestNotificationHistory = useCallback(() => {
    if (socket && isConnected) {
      socket.emit("get_notification_history");
    }
  }, [socket, isConnected]); // Dependencies: socket and isConnected

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      requestNotificationHistory();
    }
  }, [isConnected, isAuthenticated, requestNotificationHistory]); // Now safe!

  return {
    notifications,
    unreadCount,
    isConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotificationById,
    requestNotificationHistory,
  };
};