'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = New Password
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setMessage(data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      setMessage('OTP verified! Please enter your new password.');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#900606]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#FDFBF7] border border-neutral-200 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto backdrop-blur-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-[#900606] mb-2 hover:scale-105 transition-transform">
              Creators Kit.
            </Link>
            <h2 className="text-2xl font-extrabold text-[#900606] tracking-tight mt-4">
              {step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'New Password'}
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              {step === 1 && "Enter your email address to receive a 6-digit OTP."}
              {step === 2 && "Enter the 6-digit code sent to your email."}
              {step === 3 && "Create a secure new password for your account."}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={step === 1 ? handleRequestOtp : step === 2 ? handleVerifyOtp : handleResetPassword}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                <p className="text-sm text-[#900606]">{message}</p>
              </div>
            )}

            {step === 1 && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email address</label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 bg-[#FDFBF7] border border-neutral-700 rounded-lg shadow-sm placeholder-zinc-500 text-[#900606] focus:outline-none focus:ring-2 focus:ring-[#900606] focus:border-[#900606] sm:text-sm transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-neutral-700">6-Digit OTP</label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 bg-[#FDFBF7] border border-neutral-700 rounded-lg shadow-sm placeholder-zinc-500 text-[#900606] focus:outline-none focus:ring-2 focus:ring-[#900606] focus:border-[#900606] sm:text-sm transition-colors text-center tracking-widest text-lg font-bold"
                    placeholder="000000"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700">New Password</label>
                  <div className="mt-1 relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2.5 bg-[#FDFBF7] border border-neutral-700 rounded-lg shadow-sm placeholder-zinc-500 text-[#900606] focus:outline-none focus:ring-2 focus:ring-[#900606] focus:border-[#900606] sm:text-sm transition-colors pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-700 focus:outline-none"
                    >
                      {showNewPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.343-2.585c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">Confirm Password</label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2.5 bg-[#FDFBF7] border border-neutral-700 rounded-lg shadow-sm placeholder-zinc-500 text-[#900606] focus:outline-none focus:ring-2 focus:ring-[#900606] focus:border-[#900606] sm:text-sm transition-colors pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.343-2.585c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'
                  )}
                </span>
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="font-bold text-[#900606] hover:text-#FF6B4A transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
