'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
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

      setMessage(data.message || 'If an account with that email exists, we have sent a password reset link.');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto backdrop-blur-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-primary mb-2 hover:scale-105 transition-transform">
              Creators Kit.
            </Link>
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight mt-4">
              Reset Password
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Enter your email address and we'll send you a link to reset your password.
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
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 bg-white dark:bg-background border border-neutral-700 rounded-lg shadow-sm placeholder-zinc-500 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-900 dark:text-neutral-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="font-bold text-primary hover:text-#FF6B4A transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
