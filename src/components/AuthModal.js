'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function AuthModal({
  isOpen = false,
  onClose = () => {},
  redirectUrl = null,
  initialEmail = '',
}) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: initialEmail || '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState('');

  // Synchronize initial email when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoginError('');
      setLoginSuccessNotice('');
      if (initialEmail) {
        setLoginData((prev) => ({ ...prev, email: initialEmail }));
      }
    }
  }, [isOpen, initialEmail]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Extracts and sanitizes clean target redirect URL
  const getCleanRedirectUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('redirect=') || url.includes('callbackUrl=')) {
        const dummyBase = 'https://creatorskithub.com';
        const parsed = new URL(url.startsWith('/') ? `${dummyBase}${url}` : url);
        const inner = parsed.searchParams.get('redirect') || parsed.searchParams.get('callbackUrl');
        if (inner && inner !== '/login' && inner !== '/register') {
          return inner;
        }
      }
      if (url === '/login' || url === '/register') return '';
      return url;
    } catch (e) {
      return url;
    }
  };

  // Finalize authentication, broadcast event to update Navbar/UI, and route or close modal
  const handleAuthSuccess = (userData) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: userData }));
    }

    onClose();

    const cleanTarget = getCleanRedirectUrl(redirectUrl);

    if (cleanTarget) {
      window.location.href = cleanTarget;
    } else if (userData?.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/';
    }
  };

  // -------------------------------------------------------------
  // CREDENTIALS LOGIN HANDLER
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccessNotice('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      const userData = {
        name: data.name || loginData.email.split('@')[0],
        email: data.email || loginData.email,
        role: data.role || 'user',
      };

      const isAdmin = userData.role === 'admin';

      // Clear old cached keys
      ['creatorsKitUserInfo', 'userName', 'userEmail', 'userRole', 'token', 'adminName', 'adminEmail', 'adminRole', 'adminToken'].forEach((k) => {
        try { localStorage.removeItem(k); } catch (err) {}
      });

      if (isAdmin) {
        sessionStorage.setItem('adminName', userData.name);
        sessionStorage.setItem('adminEmail', userData.email);
        sessionStorage.setItem('adminRole', 'admin');
        sessionStorage.setItem('adminToken', 'admin_active');

        document.cookie = `admin_role=admin; path=/; SameSite=Lax`;
        document.cookie = `admin_email=${encodeURIComponent(userData.email)}; path=/; SameSite=Lax`;
        document.cookie = `admin_name=${encodeURIComponent(userData.name)}; path=/; SameSite=Lax`;
        document.cookie = `admin_token=admin_active; path=/; SameSite=Lax`;
        document.cookie = `user_role=admin; path=/; SameSite=Lax`;

        window.location.href = '/admin';
        return;
      }

      try {
        sessionStorage.removeItem('creatorskit_logged_out');
        localStorage.removeItem('creatorskit_logged_out');
      } catch (e) {}

      sessionStorage.setItem('userName', userData.name);
      sessionStorage.setItem('userEmail', userData.email);
      sessionStorage.setItem('userRole', 'user');
      sessionStorage.setItem('token', 'session_active');
      sessionStorage.setItem('creatorsKitUserInfo', JSON.stringify(userData));

      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('creatorsKitUserInfo', JSON.stringify(userData));

      document.cookie = `user_role=user; path=/; SameSite=Lax`;
      document.cookie = `user_email=${encodeURIComponent(userData.email)}; path=/; SameSite=Lax`;
      document.cookie = `user_name=${encodeURIComponent(userData.name)}; path=/; SameSite=Lax`;
      document.cookie = 'auth_token=session_active; path=/; SameSite=Lax';

      handleAuthSuccess(userData);
    } catch (err) {
      setLoginError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Modal Auth Card */}
      <div
        className="w-full max-w-[450px] sm:max-w-[470px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200/90 relative text-neutral-900 my-auto transform transition-all animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Cut Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer z-20 shadow-xs"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Title & Subtitle */}
        <div className="mb-6 pr-8">
          <h2 className="text-2xl sm:text-[1.75rem] font-black text-neutral-900 tracking-tight leading-tight">
            Welcome Back, <span className="text-[#900606]">Creator</span>
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 leading-relaxed">
            Access your creator gear, orders, and dashboard.
          </p>
        </div>

        {/* Error Feedback Banner */}
        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{loginError}</div>
          </div>
        )}

        {/* Success Notice Banner */}
        {loginSuccessNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{loginSuccessNotice}</div>
          </div>
        )}

        {/* Streamlined Credentials Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="creator@studio.com"
                value={loginData.email}
                onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Password
              </label>
              <a
                href="/forgot-password"
                onClick={() => onClose()}
                className="text-xs font-semibold text-[#900606] hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full mt-2 py-3 bg-[#900606] hover:bg-[#7a0505] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loginLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
