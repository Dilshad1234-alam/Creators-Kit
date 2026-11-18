'use client';

import { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  RefreshCw,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function AuthModal({
  isOpen = false,
  onClose = () => { },
  redirectUrl = null,
  initialEmail = '',
}) {
  const router = useRouter();
  const otpInputRef = useRef(null);
  const openTimeRef = useRef(0);
  const isBackdropPointerDownRef = useRef(false);

  // 2-Step Authentication State ('credentials' vs 'otp')
  const [step, setStep] = useState('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: initialEmail || '',
    password: '',
    otp: '',
  });

  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState('');

  // Resend OTP cooldown timer (seconds)
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Synchronize state when modal opens
  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now();
      setStep('credentials');
      setLoginError('');
      setLoginSuccessNotice('');
      setLoginData((prev) => ({
        ...prev,
        email: initialEmail || prev.email || '',
        password: '',
        otp: '',
      }));
    }
  }, [isOpen, initialEmail]);

  // Focus OTP input when transitioning to OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle ESC key to dismiss modal cleanly
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (Date.now() - openTimeRef.current < 500) return;
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  // Finalize authentication, set cookies & storage, broadcast event, and route
  const handleAuthSuccess = (userData) => {
    const isAdmin = userData?.role === 'admin';

    // Clear old cached keys
    ['creatorsKitUserInfo', 'userName', 'userEmail', 'userRole', 'token', 'adminName', 'adminEmail', 'adminRole', 'adminToken'].forEach((k) => {
      try { localStorage.removeItem(k); } catch (err) { }
    });

    if (isAdmin) {
      sessionStorage.setItem('adminName', userData.name);
      sessionStorage.setItem('adminEmail', userData.email);
      sessionStorage.setItem('adminRole', 'admin');
      sessionStorage.setItem('adminToken', 'admin_active');

      document.cookie = 'admin_role=admin; path=/; SameSite=Lax';
      document.cookie = `admin_email=${encodeURIComponent(userData.email)}; path=/; SameSite=Lax`;
      document.cookie = `admin_name=${encodeURIComponent(userData.name)}; path=/; SameSite=Lax`;
      document.cookie = 'admin_token=admin_active; path=/; SameSite=Lax';
      document.cookie = 'user_role=admin; path=/; SameSite=Lax';

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: userData }));
      }

      onClose();
      window.location.href = '/admin';
      return;
    }

    try {
      sessionStorage.removeItem('creatorskit_logged_out');
      localStorage.removeItem('creatorskit_logged_out');
    } catch (e) { }

    sessionStorage.setItem('userName', userData.name);
    sessionStorage.setItem('userEmail', userData.email);
    sessionStorage.setItem('userRole', 'user');
    sessionStorage.setItem('token', 'session_active');
    sessionStorage.setItem('creatorsKitUserInfo', JSON.stringify(userData));

    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('creatorsKitUserInfo', JSON.stringify(userData));

    document.cookie = 'user_role=user; path=/; SameSite=Lax';
    document.cookie = `user_email=${encodeURIComponent(userData.email)}; path=/; SameSite=Lax`;
    document.cookie = `user_name=${encodeURIComponent(userData.name)}; path=/; SameSite=Lax`;
    document.cookie = 'auth_token=session_active; path=/; SameSite=Lax';

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: userData }));
    }

    onClose();

    const cleanTarget = getCleanRedirectUrl(redirectUrl);
    if (cleanTarget) {
      window.location.href = cleanTarget;
    } else {
      window.location.href = '/';
    }
  };

  // -------------------------------------------------------------
  // STEP 1: SUBMIT CREDENTIALS (EMAIL & PASSWORD)
  // -------------------------------------------------------------
  const handleCredentialsSubmit = async (e) => {
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

      if (data.requiresOtp) {
        setStep('otp');
        setResendCooldown(60);
        setLoginSuccessNotice(data.message || `We sent a 6-digit code to ${loginData.email}`);
        return;
      }

      // If server returned user directly
      handleAuthSuccess(data);
    } catch (err) {
      setLoginError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STEP 2: SUBMIT 6-DIGIT OTP
  // -------------------------------------------------------------
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const cleanOtp = loginData.otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setLoginError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');
    setLoginSuccessNotice('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email.trim(),
          otp: cleanOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired verification code');
      }

      handleAuthSuccess(data);
    } catch (err) {
      setLoginError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ACTION: RESEND OTP CODE
  // -------------------------------------------------------------
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setLoginError('');
    setLoginSuccessNotice('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email.trim(),
          resend: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setResendCooldown(60);
      setLoginSuccessNotice(data.message || 'A fresh code has been sent to your email.');
    } catch (err) {
      setLoginError(err.message || 'Failed to resend verification code.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setLoginData((prev) => ({ ...prev, otp: '' }));
    setLoginError('');
    setLoginSuccessNotice('');
  };

  const handleBackdropPointerDown = (e) => {
    // On mobile (< 640px), backdrop taps are disabled to prevent accidental dismissal while scrolling or typing.
    // Mobile users can close intentionally using the top (X) button.
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    // Prevent accidental tap bleed-through immediately after opening
    if (Date.now() - openTimeRef.current < 600) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    // Only mark true if the user pressed down directly on the backdrop (NOT on the card)
    if (e.target === e.currentTarget) {
      isBackdropPointerDownRef.current = true;
    }
  };

  const handleBackdropClick = (e) => {
    // On mobile (< 640px), modal is dismissed via the explicit (X) button.
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    // Prevent accidental tap bleed-through immediately after opening
    if (Date.now() - openTimeRef.current < 600) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    // Only close if BOTH pointerdown AND click happened directly on the backdrop
    if (e.target === e.currentTarget && isBackdropPointerDownRef.current) {
      isBackdropPointerDownRef.current = false;
      onClose();
    } else {
      isBackdropPointerDownRef.current = false;
    }
  };

  const handleCloseButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Prevent close button from getting triggered by opening tap on mobile
    if (Date.now() - openTimeRef.current < 600) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onPointerDown={handleBackdropPointerDown}
      onClick={handleBackdropClick}
    >
      {/* Fully Responsive, Centered & Scrollable Auth Modal Card */}
      <div
        className="w-full max-w-[440px] max-h-[92dvh] overflow-y-auto my-auto bg-white rounded-2xl p-5 sm:p-7 shadow-2xl border border-neutral-200/90 relative text-neutral-900 overscroll-contain animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Top Close Button with Touch-Friendly Hit Target */}
        <button
          type="button"
          onClick={handleCloseButtonClick}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer z-20 shadow-xs active:scale-95 touch-manipulation"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* ========================================================= */}
        {/* VIEW 1: CREDENTIALS (EMAIL & PASSWORD) */}
        {/* ========================================================= */}
        {step === 'credentials' && (
          <div>
            {/* Title & Subtitle with right padding to prevent close button collision */}
            <div className="mb-5 pr-10">
              <h2 className="text-2xl sm:text-[1.7rem] font-black text-neutral-900 tracking-tight leading-tight break-words">
                Welcome, <span className="text-[#900606]">Creator</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1 leading-relaxed break-words">
                Enter your email and password to sign in or get started.
              </p>
            </div>

            {/* Error Feedback Banner */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-snug break-words">{loginError}</div>
              </div>
            )}

            {/* Success Notice Banner */}
            {loginSuccessNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-snug break-words">{loginSuccessNotice}</div>
              </div>
            )}

            {/* Credentials Login Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
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
                    className="w-full pl-10 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer p-1.5 touch-manipulation"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3 sm:py-3.5 bg-[#900606] hover:bg-[#7a0505] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 touch-manipulation"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: 2-STEP OTP VERIFICATION CODE */}
        {/* ========================================================= */}
        {step === 'otp' && (
          <div>
            {/* Title & Subtitle with right padding */}
            <div className="mb-5 pr-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#900606] text-[11px] font-bold uppercase tracking-wider mb-2">
                <KeyRound className="w-3.5 h-3.5" />
                <span>2-Step Verification</span>
              </div>
              <h2 className="text-2xl sm:text-[1.7rem] font-black text-neutral-900 tracking-tight leading-tight break-words">
                Enter <span className="text-[#900606]">OTP</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1 leading-relaxed break-words">
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-neutral-800 break-all">{loginData.email}</span>
              </p>
            </div>

            {/* Error Feedback Banner */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-snug break-words">{loginError}</div>
              </div>
            )}

            {/* Success Notice Banner */}
            {loginSuccessNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-snug break-words">{loginSuccessNotice}</div>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    6-Digit Verification Code
                  </label>
                  <span className="text-[11px] text-neutral-400 font-medium">Expires in 10m</span>
                </div>
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    placeholder="&bull; &bull; &bull; &bull; &bull; &bull;"
                    value={loginData.otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setLoginData((prev) => ({ ...prev, otp: val }));
                    }}
                    className="w-full text-center tracking-[0.45em] sm:tracking-[0.6em] text-2xl sm:text-3xl font-mono font-bold py-3 sm:py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading || loginData.otp.length !== 6}
                className="w-full py-3 sm:py-3.5 bg-[#900606] hover:bg-[#7a0505] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>

              {/* Bottom Navigation & Resend Actions */}
              <div className="pt-2 flex items-center justify-between gap-2 text-xs border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="text-neutral-500 hover:text-neutral-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer py-2.5 px-2 touch-manipulation"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resendLoading}
                  className="text-[#900606] hover:text-[#7a0505] font-bold disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors cursor-pointer py-2.5 px-2 flex items-center gap-1 touch-manipulation"
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : resendCooldown > 0 ? (
                    <span>Resend in {resendCooldown}s</span>
                  ) : (
                    <span>Resend Code</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
