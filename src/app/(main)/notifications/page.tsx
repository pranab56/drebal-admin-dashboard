"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CheckCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  date: string;
  time: string;
  read: boolean;
}

interface FormData {
  title: string;
  message: string;
  audience: string;
  date: string;
  time: string;
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
    {
      id: 2,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
    {
      id: 3,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
    {
      id: 4,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
    {
      id: 5,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
    {
      id: 6,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
    {
      id: 7,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
    {
      id: 8,
      title: 'RSVP Reminder',
      date: '12/09/2025',
      time: '10:38 pm',
      read: true,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    message: '',
    audience: 'All Users',
    date: '',
    time: '',
  });

  const handleDelete = (id: number): void => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendNotification = (): void => {
    if (formData.title && formData.message && formData.date && formData.time) {
      const newNotification: Notification = {
        id: notifications.length + 1,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        read: true,
      };
      setNotifications([newNotification, ...notifications]);
      setFormData({
        title: '',
        message: '',
        audience: 'All Users',
        date: '',
        time: '',
      });
      setIsDialogOpen(false);
    }
  };

  const handleCancel = (): void => {
    setFormData({
      title: '',
      message: '',
      audience: 'All Users',
      date: '',
      time: '',
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="">
      <div className="">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2"
            >
              Create New Notification
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {notification.date} / {notification.time}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Notification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-0">
          <div className="p-6">
            <DialogHeader className="flex flex-row items-center justify-between mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Notifications
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              {/* Notification Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Notification Title
                </label>
                <Input
                  placeholder="Enter Notification Title here..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 placeholder:text-gray-400"
                />
              </div>

              {/* Notification Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Notification Message
                </label>
                <Textarea
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 min-h-[120px] placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Target Audience
                </label>
                <Select
                  value={formData.audience}
                  onValueChange={(value) => handleInputChange('audience', value)}
                >
                  <SelectTrigger className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Users">All Users</SelectItem>
                    <SelectItem value="Premium Users">Premium Users</SelectItem>
                    <SelectItem value="Free Users">Free Users</SelectItem>
                    <SelectItem value="New Users">New Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 pr-10 placeholder:text-gray-400"
                    />
                    <Calendar className="w-5 h-5 text-indigo-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="--:--"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full bg-indigo-50 border-0 rounded-lg px-4 py-3 pr-10 placeholder:text-gray-400"
                    />
                    <Clock className="w-5 h-5 text-indigo-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-0 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendNotification}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold"
                >
                  Send Notification
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationSystem;