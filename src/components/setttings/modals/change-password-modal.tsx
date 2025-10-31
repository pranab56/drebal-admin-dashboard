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
import { BaseModalProps, PasswordForm, ShowPasswords } from '../settingsType';
import { ForgotPasswordModal } from './forgot-password-modal';
import { VerifyCodeModal } from './verify-code-modal';

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
  const [isLoading, setIsLoading] = useState(false);
  const [currentModal, setCurrentModal] = useState<'change' | 'forgot' | 'verify'>('change');
  const [userEmail, setUserEmail] = useState('');

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
    if (errors[field]) {
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

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would typically send the data to your backend
      console.log('Password change data:', passwords);

      // Show success message
      alert('Password updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setCurrentModal('forgot');
  };

  const handleForgotPasswordSubmit = (email: string) => {
    setUserEmail(email);
    setCurrentModal('verify');
  };

  const handleVerifySuccess = () => {
    // When verification is successful, return to change password modal
    setCurrentModal('change');
  };

  const handleCloseAll = () => {
    onClose();
  };

  const PasswordInput = ({
    field,
    label,
    placeholder
  }: {
    field: keyof PasswordForm;
    label: string;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id={field}
          type={showPasswords[field] ? 'text' : 'password'}
          placeholder={placeholder}
          value={passwords[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`pl-10 pr-10 ${errors[field] ? 'border-destructive' : ''}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => togglePasswordVisibility(field)}
        >
          {showPasswords[field] ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {errors[field] && (
        <p className="text-sm text-destructive">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <>
      {/* Change Password Modal */}
      <Dialog open={currentModal === 'change'} onOpenChange={(open) => {
        if (!open) handleCloseAll();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              field="old"
              label="Enter old password"
              placeholder="Enter old password"
            />

            <PasswordInput
              field="new"
              label="New Password"
              placeholder="Enter new password"
            />

            <PasswordInput
              field="confirm"
              label="Confirm Password"
              placeholder="Confirm new password"
            />

            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm text-muted-foreground"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Button>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      {currentModal === 'forgot' && (
        <ForgotPasswordModal
          onClose={handleCloseAll}
          onVerify={handleForgotPasswordSubmit}
        />
      )}

      {/* Verify Code Modal */}
      {currentModal === 'verify' && (
        <VerifyCodeModal 
          onClose={handleCloseAll}
          onVerifySuccess={handleVerifySuccess}
          email={userEmail}
        />
      )}
    </>
  );
};