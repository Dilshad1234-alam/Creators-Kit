'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import {
  Mail,
  Lock,
  User,
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

export default function AuthContainer({ initialMode = 'login', initialEmail = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlEmail = searchParams?.get('email') || initialEmail || '';
  const urlRedirect = searchParams?.get('redirect') || searchParams?.get('callbackUrl') || '';
  const urlVerified = searchParams?.get('verified');
  const urlError = searchParams?.get('error');

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({ email: urlEmail, password: '' });
  const [loginError, setLoginError] = useState(urlError ? `Authentication error: ${urlError}` : '');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState(
    urlVerified ? 'Account verified successfully! Please sign in with your password.' : ''
  );

  const [registerData, setRegisterData] = useState({
    name: '',
    email: urlEmail,
    password: '',
    agreeTerms: true,
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  // Keep mode in sync with props or browser route
  useEffect(() => {
    setMode(initialMode || 'login');
  }, [initialMode]);

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';

  // Toggle mode & update URL path cleanly without full reload
  const toggleMode = (targetMode) => {
    setMode(targetMode);
    setLoginError('');
    setRegisterError('');
    setLoginSuccessNotice('');
    const redirectParam = urlRedirect ? `?redirect=${encodeURIComponent(urlRedirect)}` : '';
    if (targetMode === 'register') {
      window.history.pushState(null, '', `/register${redirectParam}`);
    } else {
      window.history.pushState(null, '', `/login${redirectParam}`);
    }
  };

  // Close cut icon returns to previous page or home
  const handleClose = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Finalize authentication & route user
  const handleAuthSuccess = (userData) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: userData }));
    }

    if (urlRedirect && urlRedirect !== '/login' && urlRedirect !== '/register') {
      if (urlRedirect.startsWith('http')) {
        window.location.href = urlRedirect;
      } else {
        router.push(urlRedirect);
      }
    } else if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      window.location.href = '/';
    }
  };

  // -------------------------------------------------------------
  // 1. CREDENTIALS LOGIN HANDLER
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
      if (!res.ok) throw new Error(data.error || 'Invalid email or password');

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

  // -------------------------------------------------------------
  // 2. REGISTRATION SUBMIT HANDLER (Saves directly to MongoDB Compass 'users' collection)
  // -------------------------------------------------------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');

    const cleanName = registerData.name.trim();
    const cleanEmail = registerData.email.trim().toLowerCase();

    if (!cleanName) {
      setRegisterError('Please enter your full name.');
      setRegisterLoading(false);
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setRegisterError('Please enter a valid email address.');
      setRegisterLoading(false);
      return;
    }

    if (!registerData.password || registerData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      setRegisterLoading(false);
      return;
    }

    if (!registerData.agreeTerms) {
      setRegisterError('You must agree to the Terms & Privacy Policy to continue.');
      setRegisterLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password: registerData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create account');

      const userData = {
        name: data.user?.name || cleanName,
        email: data.user?.email || cleanEmail,
        role: data.user?.role || 'user',
      };

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
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. GOOGLE OAUTH HANDLER
  // -------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      try {
        sessionStorage.removeItem('creatorskit_logged_out');
        localStorage.removeItem('creatorskit_logged_out');
      } catch (e) {}
      const callback = (urlRedirect && urlRedirect !== '/login' && urlRedirect !== '/register') ? urlRedirect : '/';
      await signIn('google', { callbackUrl: callback });
    } catch (err) {
      setLoginError('Google sign in error. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] w-full bg-[#FAF7F2] font-sans selection:bg-[#900606] selection:text-white overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. BLURRED WEBSITE BACKDROP (matching images 1 & 2)                       */}
      {/* ========================================================================= */}
      <div className="pointer-events-none select-none filter blur-[3px] scale-102 opacity-75 transform-gpu transition-all">
        {/* Mock Top Ticker */}
        <div className="w-full bg-[#FAF7F2] border-b border-neutral-200/80 py-1.5 text-center text-xs text-neutral-700 font-medium">
          <span className="text-[#900606] font-bold">Creator Sale</span> &bull; Special prices on your next setup
        </div>

        {/* Mock Storefront Header */}
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

        {/* Mock Hero Banner Background */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-r from-[#2b0808] via-[#1a0505] to-[#2b0808] relative overflow-hidden flex items-center justify-center">
            <div className="text-center text-white px-4">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-400">CREATOR KITS</span>
              <h1 className="text-3xl sm:text-5xl font-black mt-2">SHINE BRIGHT. SOUND CLEAR.</h1>
            </div>
          </div>

          {/* Mock Product Grid cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-3" />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DARK OVERLAY & CENTERED AUTH CARD (ONLY CLOSES ON 'X' CUT BUTTON)      */}
      {/* ========================================================================= */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      >
        <div
          className="w-full max-w-[450px] sm:max-w-[470px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200/90 relative text-neutral-900 my-auto transform transition-all animate-in zoom-in-95 duration-200 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Close Cut Button - ONLY ACTION THAT CLOSES / NAVIGATES BACK */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer z-20 shadow-xs"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Title & Subtitle (Top brand logo intentionally removed per request) */}
          <div className="mb-5 pr-8">
            <h2 className="text-2xl sm:text-[1.75rem] font-black text-neutral-900 tracking-tight leading-tight">
              {isLogin ? (
                <>
                  Welcome Back, <span className="text-[#900606]">Creator</span>
                </>
              ) : (
                <>
                  Create Account, <span className="text-[#900606]">Creator</span>
                </>
              )}
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1 leading-relaxed">
              {isLogin
                ? 'Access your creator gear, orders, and dashboard.'
                : 'Join the ecosystem and equip your studio with premium tools.'}
            </p>
          </div>

          {/* Alerts / Feedback Banners */}
          {(loginError || registerError) && (
            <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{loginError || registerError}</div>
            </div>
          )}

          {loginSuccessNotice && (
            <div className="mb-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{loginSuccessNotice}</div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* A. REGISTER FORM                                                          */}
          {/* ========================================================================= */}
          {isRegister && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={registerData.name}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

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
                    value={registerData.email}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
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

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  id="page-terms"
                  type="checkbox"
                  checked={registerData.agreeTerms}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#900606] focus:ring-[#900606] border-neutral-300 cursor-pointer accent-[#900606]"
                />
                <label htmlFor="page-terms" className="text-xs text-neutral-600 cursor-pointer select-none">
                  I agree to the{' '}
                  <span className="text-[#900606] font-semibold hover:underline">Terms</span> &{' '}
                  <span className="text-[#900606] font-semibold hover:underline">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full mt-2 py-3 bg-[#900606] hover:bg-[#7a0505] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {registerLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* B. LOGIN FORM                                                             */}
          {/* ========================================================================= */}
          {isLogin && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
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
          )}

          {/* ========================================================================= */}
          {/* SOCIAL AUTH DIVIDER & GOOGLE BUTTON                                       */}
          {/* ========================================================================= */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-neutral-200" />
            <span className="absolute bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              OR CONTINUE WITH
            </span>
          </div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-neutral-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* ========================================================================= */}
          {/* BOTTOM TOGGLE: SWITCH BETWEEN LOGIN & REGISTER                           */}
          {/* ========================================================================= */}
          <div className="mt-4 pt-3 border-t border-neutral-100 text-center text-xs text-neutral-600">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode('login')}
                  className="font-bold text-[#900606] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => toggleMode('register')}
                  className="font-bold text-[#900606] hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
