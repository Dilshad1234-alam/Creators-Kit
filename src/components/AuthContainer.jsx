'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

export default function AuthContainer({ initialMode = 'login', initialEmail = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlEmail = searchParams?.get('email') || initialEmail || '';
  const urlStep = searchParams?.get('step');
  const urlVerified = searchParams?.get('verified');
  const urlError = searchParams?.get('error');

  const startMode = urlStep === 'otp' || initialMode === 'otp' ? 'otp' : initialMode;

  const [mode, setMode] = useState(startMode); // 'login' | 'register' | 'otp'

  const getUrlErrorMessage = (err) => {
    if (!err) return '';
    if (err === 'OAuthSignin' || err === 'OAuthCallback') {
      return 'Google authentication encountered an issue. Please verify Google OAuth credentials and redirect URIs in Google Cloud Console.';
    }
    if (err === 'AccessDenied') {
      return 'Access was denied by Google. Please allow permissions to complete sign-in.';
    }
    return `Authentication error: ${err}`;
  };

  // Form states
  const [loginData, setLoginData] = useState({ email: urlEmail, password: '' });
  const [loginError, setLoginError] = useState(urlError ? getUrlErrorMessage(urlError) : '');
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

  // OTP Verification states
  const [otpEmail, setOtpEmail] = useState(urlEmail);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [socialNotice, setSocialNotice] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isOtp = mode === 'otp';

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Listen for browser Back/Forward navigation without reloading background image
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path === '/login') {
          setMode('login');
        } else if (path === '/register') {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('step') === 'otp') {
            setMode('otp');
          } else {
            setMode('register');
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleMode = (newMode) => {
    setMode(newMode);
    setLoginError('');
    setRegisterError('');
    setOtpError('');
    setOtpSuccess('');
    setSocialNotice('');

    // Smooth URL update without unmounting or reloading background image
    if (typeof window !== 'undefined') {
      const redirectParam = searchParams?.get('redirect');
      const suffix = redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : '';
      let targetUrl = '/login' + suffix;

      if (newMode === 'register') {
        targetUrl = '/register' + suffix;
      } else if (newMode === 'otp') {
        targetUrl = `/register?step=otp${otpEmail ? `&email=${encodeURIComponent(otpEmail)}` : ''}${redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : ''}`;
      }

      window.history.pushState(null, '', targetUrl);
    }
  };

  // -------------------------------------------------------------
  // GOOGLE OAUTH AUTHENTICATION (Step 1, 2 & 3)
  // -------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setSocialNotice('');
      setLoginError('');
      setRegisterError('');

      const redirectParam = searchParams?.get('redirect');
      const callbackUrl = `/auth/callback${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`;

      // Initiate Google OAuth via NextAuth
      const result = await signIn('google', {
        callbackUrl,
        redirect: true,
      });

      if (result?.error) {
        setSocialNotice(
          'Google authentication could not be completed. Please try again or sign in with email.'
        );
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error('Google Sign-In initialization failed:', err);
      setSocialNotice(
        'Could not initialize Google Sign-In. Please check your connection.'
      );
      setGoogleLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 1. CREDENTIALS LOGIN SUBMIT HANDLER (UNIFIED LOGIN)
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccessNotice('');
    setSocialNotice('');

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
        // If unverified, guide user to complete OTP
        if (res.status === 403 && data.isPending) {
          const target = data.email || loginData.email.trim();
          setOtpEmail(target);
          setOtpError('Please verify your email address before logging in.');
          setResendCooldown(60);
          setMode('otp');
          if (typeof window !== 'undefined') {
            window.history.pushState(null, '', `/register?step=otp&email=${encodeURIComponent(target)}`);
          }
          return;
        }

        throw new Error(data.error || 'Invalid email or password');
      }

      const userData = {
        name: data.name || loginData.email.split('@')[0],
        email: data.email || loginData.email,
        role: data.role || 'user',
      };

      const isAdmin = userData.role === 'admin';

      // Always clear persistent localStorage auth keys to enforce session-only lifetime
      ['creatorsKitUserInfo', 'userName', 'userEmail', 'userRole', 'token', 'adminName', 'adminEmail', 'adminRole', 'adminToken'].forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      if (isAdmin) {
        // Clear conflicting user session data
        ['userName', 'userEmail', 'userRole', 'token', 'creatorsKitUserInfo'].forEach(k => {
          try { sessionStorage.removeItem(k); } catch (e) {}
        });
        ['user_role', 'user_email', 'user_name', 'auth_token'].forEach(c => {
          document.cookie = `${c}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });

        // Dedicated admin session in sessionStorage
        sessionStorage.setItem('adminName', userData.name);
        sessionStorage.setItem('adminEmail', userData.email);
        sessionStorage.setItem('adminRole', 'admin');
        sessionStorage.setItem('adminToken', 'admin_active');

        // Session-only cookies (omitting max-age/expires so closing the browser/tab ends session)
        document.cookie = `admin_role=admin; path=/; SameSite=Lax`;
        document.cookie = `admin_email=${encodeURIComponent(userData.email)}; path=/; SameSite=Lax`;
        document.cookie = `admin_name=${encodeURIComponent(userData.name)}; path=/; SameSite=Lax`;
        document.cookie = `admin_token=admin_active; path=/; SameSite=Lax`;
        document.cookie = `user_role=admin; path=/; SameSite=Lax`;

        window.location.href = '/admin';
        return;
      }

      // Customer session:
      // Clear conflicting admin session data
      ['adminName', 'adminEmail', 'adminRole', 'adminToken'].forEach(k => {
        try { sessionStorage.removeItem(k); } catch (e) {}
      });
      ['admin_role', 'admin_email', 'admin_name', 'admin_token'].forEach(c => {
        document.cookie = `${c}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });

      // Save customer session exclusively to sessionStorage
      sessionStorage.setItem('userName', userData.name);
      sessionStorage.setItem('userEmail', userData.email);
      sessionStorage.setItem('userRole', 'user');
      sessionStorage.setItem('token', 'session_active');
      sessionStorage.setItem('creatorsKitUserInfo', JSON.stringify(userData));

      // Session-only customer cookies (omitting max-age/expires)
      document.cookie = `user_role=user; path=/; SameSite=Lax`;
      document.cookie = `user_email=${encodeURIComponent(userData.email)}; path=/; SameSite=Lax`;
      document.cookie = `user_name=${encodeURIComponent(userData.name)}; path=/; SameSite=Lax`;
      document.cookie = 'auth_token=session_active; path=/; SameSite=Lax';

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: userData }));

      const redirectParam = searchParams?.get('redirect');
      const target = redirectParam && !redirectParam.startsWith('/admin') ? redirectParam : '/account';
      window.location.href = target;
    } catch (err) {
      setLoginError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 2. REGISTRATION SUBMIT HANDLER
  // -------------------------------------------------------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');
    setSocialNotice('');

    if (!registerData.agreeTerms) {
      setRegisterError('Please accept the Terms of Service to create an account.');
      setRegisterLoading(false);
      return;
    }

    const cleanEmail = registerData.email.trim().toLowerCase();
    const cleanName = registerData.name.trim();

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

      const verifiedEmail = data.email || cleanEmail;
      setOtpEmail(verifiedEmail);
      setOtp('');
      setOtpError('');
      setOtpSuccess('Verification code sent to your email. Please enter it below.');
      setResendCooldown(60);
      setMode('otp');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `/register?step=otp&email=${encodeURIComponent(verifiedEmail)}`);
      }
    } catch (err) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. OTP VERIFICATION HANDLER
  // -------------------------------------------------------------
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    const targetEmail = otpEmail.trim().toLowerCase();

    if (!targetEmail) {
      setOtpError('Missing email address. Please go back to registration.');
      setOtpLoading(false);
      return;
    }

    if (otp.trim().length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      setOtpLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify code');

      setOtpSuccess(data.message || 'Account verified successfully! Redirecting to sign in...');

      // Pre-fill login data and guide user to sign in
      setLoginData((prev) => ({ ...prev, email: targetEmail }));
      setLoginSuccessNotice('✓ Your account has been verified! Sign in with your password to access your dashboard.');

      setTimeout(() => {
        const redirectParam = searchParams?.get('redirect');
        setMode('login');
        const loginUrl = redirectParam
          ? `/login?verified=true&redirect=${encodeURIComponent(redirectParam)}`
          : '/login?verified=true';
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', loginUrl);
        }
      }, 1400);
    } catch (err) {
      setOtpError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 4. RESEND OTP HANDLER
  // -------------------------------------------------------------
  const handleResendOtp = async () => {
    const targetEmail = otpEmail.trim().toLowerCase();
    if (!targetEmail) {
      setOtpError('Missing email address.');
      return;
    }

    setResendLoading(true);
    setOtpError('');

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend code');

      setOtpSuccess(data.message || 'A new verification code has been sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      setOtpError(err.message || 'Failed to resend verification code.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="h-[100svh] max-h-[100svh] w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#FAF7F2] font-sans selection:bg-[#900606] selection:text-white">
      {/* ========================================================================= */}
      {/* LEFT PANEL (7-8 COLS): IMMERSIVE CREATOR STUDIO / OFFICE IMAGE              */}
      {/* ========================================================================= */}
      <div className="hidden lg:block lg:col-span-7 xl:col-span-8 2xl:col-span-8 relative overflow-hidden h-full max-h-[100svh] border-r border-neutral-200/80 bg-neutral-900 select-none">
        {/* Clean Office Background Image - FULLY VISIBLE & VIBRANT COVER */}
        <Image
          src="/office-bg.jpg"
          alt="CreatorsKit Office Studio"
          fill
          sizes="(max-width: 1024px) 100vw, 68vw"
          priority
          quality={95}
          className="object-cover object-center"
        />
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL (4-5 COLS): SOLID AUTHENTICATION CARD                           */}
      {/* ========================================================================= */}
      <div className="w-full lg:col-span-5 xl:col-span-4 2xl:col-span-4 relative bg-[#FAF7F2] text-neutral-900 px-3 sm:px-5 lg:px-5 xl:px-6 py-4 flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden h-full max-h-[100svh]">
        {/* Soft Background Accent (no overflow-x) */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

        {/* Solid Card Wrapper - Reduced side and vertical gaps */}
        <div className="w-full max-w-[480px] xl:max-w-[500px] relative z-10 my-auto py-2 sm:py-3">
          <div className="w-full bg-white rounded-3xl sm:rounded-[2.25rem] p-6 sm:p-8 xl:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-200/80 flex flex-col space-y-4 sm:space-y-4.5 text-neutral-900">
            {/* Top Brand Logo replacing "Back to main site" */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer"
                title="Go to main website"
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
                  Creators <span className="text-white bg-[#900606] px-2 py-0.5 rounded-lg text-lg sm:text-xl font-black shadow-sm">kit</span>
                </span>
              </Link>

              {isOtp && (
                <button
                  type="button"
                  onClick={() => toggleMode('register')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Registration
                </button>
              )}
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {isLogin ? (
                  <>
                    Welcome Back, <span className="text-[#900606]">Creator</span>
                  </>
                ) : isOtp ? (
                  <>
                    Verify Your <span className="text-[#900606]">Email</span>
                  </>
                ) : (
                  <>
                    Create Account, <span className="text-[#900606]">Creator</span>
                  </>
                )}
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {isLogin
                  ? 'Access your studio dashboard and manage your creator gear bookings.'
                  : isOtp
                  ? `Enter the 6-digit code sent to ${otpEmail || 'your email'} to verify your account.`
                  : 'Join the ecosystem and equip your studio with premium tools.'}
              </p>
            </div>

            {/* Status / Notice Alerts */}
            {(loginError || registerError || otpError) && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{loginError || registerError || otpError}</div>
              </div>
            )}

            {(loginSuccessNotice || otpSuccess) && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{loginSuccessNotice || otpSuccess}</div>
              </div>
            )}

            {socialNotice && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{socialNotice}</div>
              </div>
            )}

            {/* DYNAMIC FORMS */}
            {isLogin ? (
              // -------------------------------------------------------------------
              // FORM A: LOGIN FORM
              // -------------------------------------------------------------------
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="creator@studio.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] shadow-sm placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-bold text-[#900606] hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] shadow-sm placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-neutral-300 text-[#900606] focus:ring-[#900606]"
                  />
                  <label htmlFor="remember" className="text-xs text-neutral-600 font-medium cursor-pointer">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="relative w-full py-3.5 sm:py-4 mt-2 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60 hover:border-[#900606]"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {loginLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Creator Dashboard</span>
                        <span>➔</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            ) : isRegister ? (
              // -------------------------------------------------------------------
              // FORM B: REGISTRATION FORM
              // -------------------------------------------------------------------
              <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] shadow-sm placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="creator@studio.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] shadow-sm placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] shadow-sm placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-0.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={registerData.agreeTerms}
                      onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                      className="w-3.5 h-3.5 mt-0.5 rounded border-neutral-300 text-[#900606] focus:ring-[#900606]"
                    />
                    <span className="text-[11px] text-neutral-600 leading-snug">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#900606] hover:underline font-semibold">
                        Terms
                      </Link>{' '}
                      &{' '}
                      <Link href="/privacy" className="text-[#900606] hover:underline font-semibold">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={registerLoading}
                  className="relative w-full py-3.5 sm:py-4 mt-2 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60 hover:border-[#900606]"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {registerLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account & Verify</span>
                        <span>➔</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            ) : (
              // -------------------------------------------------------------------
              // FORM C: OTP VERIFICATION FORM
              // -------------------------------------------------------------------
              <form className="space-y-4" onSubmit={handleVerifyOtpSubmit}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleMode('register')}
                      className="text-xs font-bold text-[#900606] hover:underline cursor-pointer"
                    >
                      Edit details
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                        setOtp(val);
                        setOtpError('');
                      }}
                      className="w-full text-center text-3xl font-mono font-bold tracking-[0.45em] py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] shadow-inner transition-all placeholder:text-neutral-300"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1.5 text-center">
                    Check your inbox or spam folder for code sent to{' '}
                    <strong className="text-neutral-700">{otpEmail}</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otp.length !== 6}
                  className="relative w-full py-3.5 mt-2 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:border-[#900606]"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {otpLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        <span>Verifying & Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Code & Finalize Account</span>
                        <span>➔</span>
                      </>
                    )}
                  </span>
                </button>

                {/* Resend Code Section */}
                <div className="pt-1 text-center">
                  <p className="text-xs text-neutral-500">
                    Didn&apos;t receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading || resendCooldown > 0}
                      className="font-bold text-[#900606] hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      {resendLoading ? (
                        'Sending...'
                      ) : resendCooldown > 0 ? (
                        `Resend code in 00:${resendCooldown.toString().padStart(2, '0')}`
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 inline" /> Resend Code
                        </>
                      )}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Social Logins: "Continue with Google" button */}
            {!isOtp && (
              <div className="pt-0.5">
                <div className="relative flex items-center justify-center my-2.5">
                  <div className="border-t border-neutral-200 w-full" />
                  <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest shrink-0 bg-white">
                    Or continue with
                  </span>
                  <div className="border-t border-neutral-200 w-full" />
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    id="google-signin-btn"
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 font-bold text-sm shadow-sm cursor-pointer transition-all duration-200 hover:border-neutral-300 hover:shadow disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {googleLoading ? (
                      <div className="w-4 h-4 border-2 border-neutral-400 border-t-[#900606] rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
                    <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Footer Switch */}
            <div className="pt-2 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-600">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => toggleMode('register')}
                      className="font-bold text-[#900606] hover:underline cursor-pointer ml-1"
                    >
                      Create an Account
                    </button>
                  </>
                ) : isOtp ? (
                  <>
                    Already completed verification?{' '}
                    <button
                      type="button"
                      onClick={() => toggleMode('login')}
                      className="font-bold text-[#900606] hover:underline cursor-pointer ml-1"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => toggleMode('login')}
                      className="font-bold text-[#900606] hover:underline cursor-pointer ml-1"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
