"use client";

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { saveToken } from '../../../../../utils/storage';
import { useLoginMutation } from '../../../../features/auth/authApi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });
  const [Login, { isLoading }] = useLoginMutation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }



    try {
      const response = await Login({ email: email, password: password }).unwrap();
      toast.success(response.message || 'Successfully logged in.');
      saveToken(response?.data?.Token);
      router.push('/');
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: { message?: string };
      };

      toast.error(
        err?.data?.message || 'Failed to log in. Please try again.'
      );
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={"/images/auth/cuate.png"}
              height={1000}
              width={1000}
              alt='Login Image'
              className='w-full h-full'
            />
          </div>

          {/* Right side - Login Form */}
          <div className="flex-1 w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-3">
              <Image
                src={"/images/auth/loginLogo.png"}
                height={1000}
                width={1000}
                alt='Login Image'
                className='w-52 h-52'
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-1">Hello, Welcome!</h2>
            <p className="text-xs text-gray-600 mb-6">Please Enter Your Details Below to Continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Enter Email"
                    className={`w-full pl-10 pr-4 py-2.5 border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter password"
                    className={`w-full pl-10 pr-10 py-2.5 border-2 ${errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 rounded ${rememberMe ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      } flex items-center justify-center`}>
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-xs text-gray-700">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-gray-600 hover:text-green-600 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}