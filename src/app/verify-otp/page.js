'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!email) {
      setError('Invalid or missing email address.');
    }
  }, [email]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Invalid or missing email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage('Account verified successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Invalid or missing email address.');
      setResending(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage('A new OTP has been sent to your email.');
      setTimeLeft(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto backdrop-blur-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-[#FF3B14] mb-2 hover:scale-105 transition-transform">
            Creators Kit.
          </Link>
          <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight mt-4">
            Verify Your Email
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            We've sent a 6-digit code to <span className="font-bold text-white">{email}</span>. Please enter it below.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-zinc-300 text-center"
            >
              6-Digit Code
            </label>
            <div className="mt-2 flex justify-center">
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="appearance-none block w-1/2 text-center text-3xl tracking-widest px-3 py-3 bg-[#0B0D0E] border border-zinc-700 rounded-lg shadow-sm placeholder-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#FF3B14] focus:border-[#FF3B14] transition-colors"
                placeholder="000000"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#FF3B14] hover:bg-[#E01900] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF3B14] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Verify Account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || timeLeft > 0}
              className="font-bold text-[#FF3B14] hover:text-[#FF6B4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Sending...' : timeLeft > 0 ? `Resend OTP in 00:${timeLeft.toString().padStart(2, '0')}` : 'Resend OTP'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-[#0B0D0E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF3B14]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Suspense fallback={<div className="text-white text-center z-10 relative">Loading...</div>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
