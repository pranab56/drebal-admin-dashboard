"use client";

import { Suspense } from 'react';
import ResetPassword from '../../../../components/auth/ResetPassword';


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPassword />
    </Suspense>
  );
}