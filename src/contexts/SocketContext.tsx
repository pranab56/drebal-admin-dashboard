"use client";

import { socketUrl } from "@/redux/baseUrl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addNotification,
  setConnectionStatus,
  setError,
  setLoading,
} from "@/redux/slices/notificationSlice";
import getAuthIdFromToken from "@/utils/jwtDecode";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const authId = getAuthIdFromToken();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const disconnect = useCallback(() => {
    if (socket) {
      console.log("Socket: Manually disconnecting...");
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      dispatch(setConnectionStatus(false));

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    }
  }, [socket, dispatch]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.log("Socket: Max reconnection attempts reached");
      dispatch(setError("Connection lost. Please refresh the page."));
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const delay = Math.min(
      1000 * Math.pow(2, reconnectAttempts.current),
      30000
    );
    console.log(
      `Socket: Scheduling reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1
      })`
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttempts.current += 1;
      // We'll handle reconnection in the connect function
    }, delay);
  }, [dispatch]);

  const connect = useCallback(() => {
    if (!isAuthenticated || !accessToken || !authId) {
      console.log("Socket: Cannot connect - not authenticated");
      return;
    }

    if (socket?.connected) {
      console.log("Socket: Already connected");
      return;
    }

    console.log("Socket: Attempting to connect...");
    dispatch(setLoading(true));
    dispatch(setError(null));

    const newSocket = io(socketUrl, {
      auth: {
        token: accessToken,
        userId: authId,
      },
      transports: ["websocket", "polling"],
      timeout: 10000,
      forceNew: true,
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Socket: Connected successfully");
      setIsConnected(true);
      dispatch(setConnectionStatus(true));
      dispatch(setLoading(false));
      dispatch(setError(null));
      reconnectAttempts.current = 0;
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket: Disconnected -", reason);
      setIsConnected(false);
      dispatch(setConnectionStatus(false));
      dispatch(setLoading(false));

      // Attempt to reconnect if it wasn't a manual disconnect
      if (reason !== "io client disconnect" && isAuthenticated) {
        scheduleReconnect();
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket: Connection error -", error);
      dispatch(setError(`Connection failed: ${error.message}`));
      dispatch(setLoading(false));
      scheduleReconnect();
    });

    // Notification event handlers
    // Listen for personalized notification events (notification::adminId)
    const notificationEventName = `notification::${authId}`;
    console.log(
      "Socket: Listening for notification event:",
      notificationEventName
    );

    newSocket.on(notificationEventName, (notificationData) => {
      console.log(
        "Socket: Received personalized notification -",
        notificationData
      );

      // Create a unique ID for this notification
      const notificationId =
        notificationData._id ||
        notificationData.id ||
        `socket_${Date.now()}_${Math.random()}`;

      const notification = {
        id: notificationId,
        _id: notificationData._id, // Store MongoDB ID
        title: notificationData.title || "New Notification",
        message:
          notificationData.message ||
          notificationData.body ||
          notificationData.content ||
          "",
        body: notificationData.body,
        type: notificationData.type || "info",
        time: new Date().toLocaleTimeString(),
        read: notificationData.isRead || notificationData.read || false,
        isRead: notificationData.isRead,
        createdAt: notificationData.createdAt || new Date().toISOString(),
      };

      console.log("Socket: Dispatching notification with ID:", notificationId);
      dispatch(addNotification(notification));
    });

    // Note: Removed general "notification" event listener to prevent duplicates
    // Only using personalized notification events (notification::adminId)

    newSocket.on("notification_update", (data) => {
      console.log("Socket: Notification update -", data);
      // Handle notification updates from server (if needed)
    });

    newSocket.on("notification_count", (count) => {
      console.log("Socket: Notification count update -", count);
      // Handle notification count updates
    });

    setSocket(newSocket);
  }, [isAuthenticated, accessToken, authId, socket?.connected, dispatch, scheduleReconnect]);

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken && authId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, accessToken, authId, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};