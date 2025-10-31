import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  _id?: string; // MongoDB ID from API
  title: string;
  message: string;
  body?: string; // Alternative field name from API
  type: "info" | "success" | "warning" | "error";
  time: string;
  read: boolean;
  isRead?: boolean; // Alternative field name from API
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      const notification = action.payload;
      // Check if notification already exists to avoid duplicates
      // Check by both id and _id to prevent duplicates
      const exists = state.notifications.some(
        (n) =>
          n.id === notification.id ||
          (n._id && notification._id && n._id === notification._id)
      );
      if (!exists) {
        state.notifications.unshift(notification); // Add to beginning
        if (!notification.read) {
          state.unreadCount += 1;
        }
        console.log(
          "Added notification:",
          notification.id,
          "Total:",
          state.notifications.length
        );
      } else {
        console.log("Duplicate notification prevented:", notification.id);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n.id !== notificationId
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    updateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter((n) => !n.read).length;
    },
  },
});

export const {
  setLoading,
  setError,
  setConnectionStatus,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setNotifications,
  updateUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
