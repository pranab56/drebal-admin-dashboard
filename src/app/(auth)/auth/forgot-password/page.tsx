"use client";

import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (): void => {
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      alert(`Verification code has been sent to ${email}`);
      router.push('/auth/verify-email');
    }, 1500);
  };

  const handleBack = (): void => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-8 md:p-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 cursor-pointer text-green-600 hover:text-green-700 font-medium mb-8 border-2 border-green-600 rounded-full px-5 py-2 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={"/images/auth/bro.png"}
              height={1000}
              width={1000}
              alt='Login Image'
              className='w-full h-full'
            />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Forgot Password</h1>
            <p className="text-gray-600 text-sm mb-8">
              Enter the email address associated with your account. We&apos;ll send you an verification code to your email.
            </p>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter Email"
                    className={`w-full pl-11 pr-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:border-green-500 transition-colors`}
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || isSuccess}
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : isSuccess ? 'Code Sent!' : 'Send verification code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}