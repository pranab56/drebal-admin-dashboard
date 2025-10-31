"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { BaseModalProps } from '../settingsType';

interface VerifyCodeModalProps extends BaseModalProps {
  onVerifySuccess: () => void;
  email: string;
}

export const VerifyCodeModal = ({ onClose, onVerifySuccess, email }: VerifyCodeModalProps) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all digits are filled
    if (code.some(digit => digit === '')) {
      setError('Please enter the complete verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));

      const verificationCode = code.join('');
      console.log('Verifying code:', verificationCode, 'for email:', email);

      // Here you would typically verify the code with your backend
      // For demo purposes, we'll assume it's always successful

      // If verification is successful, call onVerifySuccess
      onVerifySuccess();
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to resend code
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Resending code to:', email);

      // Clear the current code
      setCode(['', '', '', '', '', '']);

      // Focus on first input
      const firstInput = document.getElementById('code-0');
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }

      alert('Verification code sent successfully!');
    } catch (error) {
      console.error('Error resending code:', error);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Code</DialogTitle>
          <DialogDescription>
            We&apos;ve sent a verification code to {email || 'your email'}. Check your inbox and enter the code here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Didn&apos;t receive code?</span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Resend
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};