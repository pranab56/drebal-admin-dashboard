"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useChangePasswordMutation } from '../../../features/settings/settingsApi';
import { BaseModalProps, PasswordForm, ShowPasswords } from '../settingsType';

interface ValidationErrors {
  old?: string;
  new?: string;
  confirm?: string;
}

export const ChangePasswordModal = ({ onClose }: BaseModalProps) => {
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    old: false,
    new: false,
    confirm: false
  });

  const [passwords, setPasswords] = useState<PasswordForm>({
    old: '',
    new: '',
    confirm: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const [changePassword, {
    isLoading: changePasswordLoading,
    isError: isChangePasswordError,
    error: changePasswordError
  }] = useChangePasswordMutation();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Old password validation
    if (!passwords.old.trim()) {
      newErrors.old = 'Old password is required';
    } else if (passwords.old.length < 6) {
      newErrors.old = 'Password must be at least 6 characters';
    }

    // New password validation
    if (!passwords.new.trim()) {
      newErrors.new = 'New password is required';
    } else if (passwords.new.length < 8) {
      newErrors.new = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.new)) {
      newErrors.new = 'Password must contain uppercase, lowercase and numbers';
    }

    // Confirm password validation
    if (!passwords.confirm.trim()) {
      newErrors.confirm = 'Please confirm your password';
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }

    // Check if new password is same as old
    if (passwords.old && passwords.new && passwords.old === passwords.new) {
      newErrors.new = 'New password must be different from old password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for API according to your backend requirements
      const requestData = {
        currentPassword: passwords.old,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm
      };

      // Call the mutation
      const response = await changePassword(requestData).unwrap();

      // Handle successful response
      toast.success(response.message || 'Password updated successfully!');

      // Reset form and close modal
      setPasswords({
        old: '',
        new: '',
        confirm: ''
      });

      onClose();

    } catch (error: any) {
      toast.error('Error changing password:', error);
      // Handle different types of errors
      if (error.data?.message) {
        // Server error message
        toast.error(error.data.message);
      } else if (error.data?.errors) {
        // Validation errors from server
        const serverErrors = error.data.errors;
        setErrors({
          old: serverErrors.currentPassword?.[0],
          new: serverErrors.newPassword?.[0],
          confirm: serverErrors.confirmPassword?.[0]
        });
      } else if (error.status === 401) {
        // Unauthorized - incorrect current password
        toast.error('Current password is incorrect');
        setErrors(prev => ({ ...prev, old: 'Current password is incorrect' }));
      } else if (error.status === 400) {
        // Bad request
        toast.error('Invalid request. Please check your input.');
      } else {
        // Generic error
        toast.error('Failed to change password. Please try again.');
      }
    }
  };

  const handleCloseAll = () => {
    // Reset form when closing
    setPasswords({
      old: '',
      new: '',
      confirm: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => {
      if (!open) handleCloseAll();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password Input */}
          <div className="space-y-2">
            <Label htmlFor="old">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="old"
                type={showPasswords.old ? 'text' : 'password'}
                placeholder="Enter current password"
                value={passwords.old}
                onChange={(e) => handleInputChange('old', e.target.value)}
                className={`pl-10 pr-10 ${errors.old ? 'border-destructive' : ''}`}
                disabled={changePasswordLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('old')}
                disabled={changePasswordLoading}
              >
                {showPasswords.old ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.old && (
              <p className="text-sm text-destructive">{errors.old}</p>
            )}
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="new"
                type={showPasswords.new ? 'text' : 'password'}
                placeholder="Enter new password"
                value={passwords.new}
                onChange={(e) => handleInputChange('new', e.target.value)}
                className={`pl-10 pr-10 ${errors.new ? 'border-destructive' : ''}`}
                disabled={changePasswordLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
                disabled={changePasswordLoading}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.new && (
              <p className="text-sm text-destructive">{errors.new}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirm"
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) => handleInputChange('confirm', e.target.value)}
                className={`pl-10 pr-10 ${errors.confirm ? 'border-destructive' : ''}`}
                disabled={changePasswordLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={changePasswordLoading}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirm && (
              <p className="text-sm text-destructive">{errors.confirm}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={changePasswordLoading}
          >
            {changePasswordLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </span>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};