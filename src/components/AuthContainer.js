'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  Search,
  ShoppingCart,
  User as UserIcon,
} from 'lucide-react';

export default function AuthContainer({ initialEmail = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const urlEmail = searchParams?.get('email') || initialEmail || '';
  const urlRedirect = searchParams?.get('redirect') || searchParams?.get('callbackUrl') || '';
  const urlVerified = searchParams?.get('verified');
  const urlError = searchParams?.get('error');

  const getCleanRedirectUrl = (redirectParam) => {
    if (!redirectParam) return '';
    try {
      if (redirectParam.includes('redirect=') || redirectParam.includes('callbackUrl=')) {
        const dummyBase = 'https://creatorskithub.com';
        const parsed = new URL(redirectParam.startsWith('/') ? `${dummyBase}${redirectParam}` : redirectParam);
        const inner = parsed.searchParams.get('redirect') || parsed.searchParams.get('callbackUrl');
        if (inner && inner !== '/login' && inner !== '/register') {
          return inner;
        }
      }
      if (redirectParam === '/login' || redirectParam === '/register') {
        return '';
      }
      return redirectParam;
    } catch (e) {
      return redirectParam;
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  // Auto-forward already authenticated users
  useEffect(() => {
    if (status === 'loading') return;
    const activeEmail =
      session?.user?.email ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail')
        : null);

    if (activeEmail) {
      const cleanTarget = getCleanRedirectUrl(urlRedirect);
      const fallbackTarget = session?.user?.role === 'admin' ? '/admin' : '/';
      window.location.href = cleanTarget || fallbackTarget;
    }
  }, [session, status, urlRedirect]);

  // Form states
  const [loginData, setLoginData] = useState({ email: urlEmail, password: '' });
  const [loginError, setLoginError] = useState(urlError ? `Authentication error: ${urlError}` : '');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState(
    urlVerified ? 'Account verified successfully! Please sign in with your password.' : ''
  );

  const handleClose = () => {
    const cleanTarget = getCleanRedirectUrl(urlRedirect);
    if (cleanTarget && cleanTarget !== '/login' && cleanTarget !== '/register') {
      window.location.href = cleanTarget;
    } else {
      window.location.href = '/';
    }
  };

  const handleAuthSuccess = (userData) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: userData }));
    }

    const cleanTarget = getCleanRedirectUrl(urlRedirect);
    if (cleanTarget) {
      window.location.href = cleanTarget;
    } else if (userData?.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/';
    }
  };

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
    <div className="relative min-h-[100svh] w-full bg-[#FAF7F2] font-sans selection:bg-[#900606] selection:text-white overflow-hidden">
      {/* Blurred Website Backdrop */}
      <div className="pointer-events-none select-none filter blur-[3px] scale-102 opacity-75 transform-gpu transition-all">
        <div className="w-full bg-[#FAF7F2] border-b border-neutral-200/80 py-1.5 text-center text-xs text-neutral-700 font-medium">
          <span className="text-[#900606] font-bold">Creator Sale</span> &bull; Special prices on your next setup
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between border-b border-neutral-200/60 bg-white/80">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
              Creators <span className="text-white bg-[#900606] px-2 py-0.5 rounded-lg text-lg font-black">kit</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-700">
            <span>Home</span>
            <span>Products</span>
            <span className="bg-[#900606] text-white px-3 py-1 rounded-full text-xs font-bold">Live Sale</span>
            <span>Contact</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-500">
            <div className="hidden sm:flex items-center gap-2 bg-neutral-100 rounded-full px-3 py-1.5 text-xs text-neutral-400 w-52">
              <Search className="w-3.5 h-3.5" />
              <span>Search products...</span>
            </div>
            <UserIcon className="w-5 h-5 text-neutral-700" />
            <ShoppingCart className="w-5 h-5 text-neutral-700" />
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-r from-[#2b0808] via-[#1a0505] to-[#2b0808] relative overflow-hidden flex items-center justify-center">
            <div className="text-center text-white px-4">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-400">CREATOR KITS</span>
              <h1 className="text-3xl sm:text-5xl font-black mt-2">SHINE BRIGHT. SOUND CLEAR.</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Auth Card */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      >
        <div
          className="w-full max-w-[450px] sm:max-w-[470px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200/90 relative text-neutral-900 my-auto transform transition-all animate-in zoom-in-95 duration-200 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Close Cut Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer z-20 shadow-xs"
            title="Close"
            aria-label="Close"
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

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{loginError}</div>
            </div>
          )}

          {loginSuccessNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{loginSuccessNotice}</div>
            </div>
          )}

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
    </div>
  );
}
