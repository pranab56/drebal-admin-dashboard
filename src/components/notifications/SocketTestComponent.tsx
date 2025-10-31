"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSocket } from "@/contexts/SocketContext";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import { useAppSelector } from "@/redux/hooks";
import getAuthIdFromToken from "@/utils/jwtDecode";

export const SocketTestComponent: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const { notifications, unreadCount } = useSocketNotifications();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [testTitle, setTestTitle] = useState("Test Notification");
  const [testMessage, setTestMessage] = useState(
    "This is a test notification message"
  );

  const sendTestNotification = () => {
    if (socket && isConnected) {
      const authId = getAuthIdFromToken();
      const testNotification = {
        id: `test_${Date.now()}`,
        title: testTitle,
        message: testMessage,
        type: "info",
        timestamp: new Date().toISOString(),
      };

      // Emit a test notification event to personalized channel
      const personalizedEventName = `notification::${authId}`;
      socket.emit("test_notification", {
        ...testNotification,
        targetEvent: personalizedEventName,
      });
      console.log(
        "Test notification sent to:",
        personalizedEventName,
        testNotification
      );
    }
  };

  const requestNotificationHistory = () => {
    if (socket && isConnected) {
      socket.emit("get_notification_history");
      console.log("Requested notification history");
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Socket.IO Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Please log in to test Socket.IO functionality
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Socket.IO Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <p>Total notifications: {notifications.length}</p>
          <p>Unread count: {unreadCount}</p>
          <p className="text-xs text-gray-500">
            Listening for: notification::{getAuthIdFromToken()}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-title">Test Title</Label>
          <Input
            id="test-title"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            placeholder="Notification title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-message">Test Message</Label>
          <Input
            id="test-message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Notification message"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={sendTestNotification}
            disabled={!isConnected}
            className="flex-1"
          >
            Send Test Notification
          </Button>
          <Button
            onClick={requestNotificationHistory}
            disabled={!isConnected}
            variant="outline"
          >
            Request History
          </Button>
        </div>

        {!isConnected && (
          <p className="text-sm text-yellow-600">
            ⚠️ Socket connection is not available
          </p>
        )}
      </CardContent>
    </Card>
  );
};
