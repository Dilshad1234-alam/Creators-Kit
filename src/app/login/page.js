'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      sessionStorage.setItem('userName', data.name || formData.email.split('@')[0]);
      sessionStorage.setItem('userRole', data.role || 'user');
      const urlParams = new URLSearchParams(window.location.search);
      let redirectUrl = urlParams.get('redirect') || '/';
      if (data.role === 'admin' && redirectUrl === '/') redirectUrl = '/admin';
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden transition-colors duration-300">
      {/* Background Image Container */}
      <Image 
        src="/background 4.jpg" 
        alt="Creators Kit Background" 
        fill
        quality={100}
        priority
        className="object-cover z-0"
      />
      {/* Dark Overlay - Adapted for Light/Dark mode */}
      <div className="absolute inset-0 bg-white/40 dark:bg-neutral-950/60 transition-colors duration-300 z-0 backdrop-blur-[2px]"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-2xl dark:shadow-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-black text-amber-500 tracking-tight hover:text-amber-400 transition-colors">
              Creators Kit.
            </span>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Welcome Back</h2>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
            <div className="mt-1 relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-3 pr-10 bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-amber-500 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.52c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">Remember me</label>
            </div>
            <Link href="/forgot-password" className="text-sm font-medium text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">Forgot your password?</Link>
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-neutral-950 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900 focus:ring-amber-500 transition-all disabled:opacity-50">
            {loading ? 'Processing...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don't have an account? <Link href="/register" className="font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">Create one now</Link>
        </p>
      </div>
    </div>
  );
}
