"use client";

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '../../features/auth/authApi';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ newPassword: string; confirmPassword: string }>({
    newPassword: '',
    confirmPassword: ''
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();
  const [resetPassword, { isLoading: isLoadingReset }] = useResetPasswordMutation();

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors = { newPassword: '', confirmPassword: '' };

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    console.log("new password", newPassword)
    console.log("confrim password", confirmPassword)
    try {
      const data = { newPassword: newPassword, confirmPassword: confirmPassword, token: token };
      const response = await resetPassword(data).unwrap();
      console.log(response)
      toast.success(response.message || 'Successfully logged in.');
      router.push('/auth/login');
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: { message?: string };
      };

      toast.error(
        err?.data?.message || 'Failed to verify OTP. Please try again.'
      );
    }


  }


  const handleBack = (): void => {
    router.push('/auth/verify-email');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-8 md:p-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-8 border-2 border-green-600 rounded-full px-5 py-2 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={"/images/auth/rafiki.png"}
              height={1000}
              width={1000}
              alt='Login Image'
              className='w-full h-full'
            />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Password</h1>

            <div className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                    }}
                    placeholder="Enter new Password"
                    className={`w-full pl-11 pr-12 py-3 border-2 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:border-green-500 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Confirm New Password"
                    className={`w-full pl-11 pr-12 py-3 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:border-green-500 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Reset Password Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoadingReset}
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingReset ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}