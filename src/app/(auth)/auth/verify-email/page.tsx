"use client";

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const handleChange = (index: number, value: string): void => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (): void => {
    setError('');

    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Verification code ${otpValue} has been verified successfully!`);
      router.push('/auth/reset-password');
    }, 1500);
  };

  const handleResend = (): void => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    alert('A new verification code has been sent to your email');
  };

  const handleBack = (): void => {
    router.push('/auth/forgot-password');
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
              src={"/images/auth/pana.png"}
              height={1000}
              width={1000}
              alt='Login Image'
              className='w-full h-full'
            />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Verify</h1>
            <p className="text-gray-600 text-sm mb-8">
              We&apos;ll send to verification code to your email. Check your inbox and enter the code here.
            </p>

            <div className="space-y-6">
              {/* OTP Input Fields */}
              <div>
                <div className="flex justify-center gap-3 mb-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={setInputRef(index)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-16 h-16 text-center text-2xl font-semibold border-b-4 ${error ? 'border-red-500' : digit ? 'border-green-500' : 'border-gray-300'
                        } focus:outline-none focus:border-green-500 transition-all bg-transparent`}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>

              {/* Resend Link */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Didn&apos;t receive code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-gray-800 cursor-pointer hover:text-green-600 font-medium transition-colors"
                >
                  Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}