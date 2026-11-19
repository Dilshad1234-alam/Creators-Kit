'use client';

import { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  RefreshCw,
  Search,
  ShoppingCart,
  User as UserIcon,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function AuthContainer({
  initialEmail = '',
  redirectOverride = '',
  onCloseOverride = null,
  isModal = false,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const otpInputRef = useRef(null);
  const hasRedirectedRef = useRef(false);

  const urlEmail = searchParams?.get('email') || initialEmail || '';
  const urlRedirect =
    redirectOverride ||
    searchParams?.get('redirect') ||
    searchParams?.get('callbackUrl') ||
    '';
  const urlVerified = searchParams?.get('verified');
  const urlError = searchParams?.get('error');

  const getCleanRedirectUrl = (redirectParam) => {
    if (!redirectParam) return '';
    try {
      if (redirectParam.includes('redirect=') || redirectParam.includes('callbackUrl=')) {
        const dummyBase = 'https://creatorskithub.com';
        const parsed = new URL(
          redirectParam.startsWith('/') ? `${dummyBase}${redirectParam}` : redirectParam
        );
        const inner =
          parsed.searchParams.get('redirect') || parsed.searchParams.get('callbackUrl');
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

  const [step, setStep] = useState('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: urlEmail,
    password: '',
    otp: '',
  });

  const [loginError, setLoginError] = useState(
    urlError ? `Authentication error: ${urlError}` : ''
  );
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState(
    urlVerified ? 'Account verified successfully! Please sign in with your credentials.' : ''
  );

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Sync initialEmail when opened in modal
  useEffect(() => {
    if (initialEmail) {
      setLoginData((prev) => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  // Auto-forward already authenticated users (only on standalone /login page, not inside modal open)
  useEffect(() => {
    if (isModal || status === 'loading' || hasRedirectedRef.current) return;

    const loggedOutFlag =
      typeof window !== 'undefined' &&
      (sessionStorage.getItem('creatorskit_logged_out') === '1' ||
        localStorage.getItem('creatorskit_logged_out') === '1');
    if (loggedOutFlag) return;

    const activeEmail =
      session?.user?.email ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail')
        : null);

    if (activeEmail) {
      hasRedirectedRef.current = true;
      const cleanTarget = getCleanRedirectUrl(urlRedirect);
      const fallbackTarget = session?.user?.role === 'admin' ? '/admin' : '/';
      router.replace(cleanTarget || fallbackTarget);
    }
  }, [isModal, session, status, urlRedirect, router]);

  useEffect(() => {
    if (step === 'otp') {
      const timer = setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleClose = () => {
    if (typeof onCloseOverride === 'function') {
      onCloseOverride();
      return;
    }
    const cleanTarget = getCleanRedirectUrl(urlRedirect);
    if (cleanTarget && cleanTarget !== '/login' && cleanTarget !== '/register') {
      router.push(cleanTarget);
    } else {
      router.push('/');
    }
  };

  const handleAuthSuccess = (userData) => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;

    const isAdmin = userData?.role === 'admin';

    [
      'creatorsKitUserInfo',
      'userName',
      'userEmail',
      'userRole',
      'token',
      'adminName',
      'adminEmail',
      'adminRole',
      'adminToken',
    ].forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch (err) {}
    });

    if (isAdmin) {
      sessionStorage.setItem('adminName', userData.name || '');
      sessionStorage.setItem('adminEmail', userData.email || '');
      sessionStorage.setItem('adminRole', 'admin');
      sessionStorage.setItem('adminToken', 'admin_active');

      document.cookie = 'admin_role=admin; path=/; SameSite=Lax';
      document.cookie = `admin_email=${encodeURIComponent(userData.email || '')}; path=/; SameSite=Lax`;
      document.cookie = `admin_name=${encodeURIComponent(userData.name || '')}; path=/; SameSite=Lax`;
      document.cookie = 'admin_token=admin_active; path=/; SameSite=Lax';
      document.cookie = 'user_role=admin; path=/; SameSite=Lax';

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(
          new CustomEvent('creatorskit-auth-change', { detail: userData })
        );
      }

      if (typeof onCloseOverride === 'function') onCloseOverride();
      router.replace('/admin');
      return;
    }

    try {
      sessionStorage.removeItem('creatorskit_logged_out');
      localStorage.removeItem('creatorskit_logged_out');
    } catch (e) {}

    sessionStorage.setItem('userName', userData.name || '');
    sessionStorage.setItem('userEmail', userData.email || '');
    sessionStorage.setItem('userRole', 'user');
    sessionStorage.setItem('token', 'session_active');
    sessionStorage.setItem('creatorsKitUserInfo', JSON.stringify(userData));

    localStorage.setItem('userName', userData.name || '');
    localStorage.setItem('userEmail', userData.email || '');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('creatorsKitUserInfo', JSON.stringify(userData));

    document.cookie = 'user_role=user; path=/; SameSite=Lax';
    document.cookie = `user_email=${encodeURIComponent(userData.email || '')}; path=/; SameSite=Lax`;
    document.cookie = `user_name=${encodeURIComponent(userData.name || '')}; path=/; SameSite=Lax`;
    document.cookie = 'auth_token=session_active; path=/; SameSite=Lax';

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(
        new CustomEvent('creatorskit-auth-change', { detail: userData })
      );
    }

    if (typeof onCloseOverride === 'function') onCloseOverride();
    const cleanTarget = getCleanRedirectUrl(urlRedirect);
    router.replace(cleanTarget || '/');
  };

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
        setLoginSuccessNotice(
          data.message || `We sent a 6-digit code to ${loginData.email}`
        );
        return;
      }

      handleAuthSuccess(data);
    } catch (err) {
      setLoginError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

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

  const authCardContent = (
    <div
      className="w-full max-w-[440px] max-h-[90dvh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-6 sm:p-7 shadow-2xl border border-neutral-200/90 relative text-neutral-900 overscroll-contain mt-auto sm:my-auto"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all cursor-pointer z-20 shadow-xs active:scale-95 touch-manipulation"
        title="Close"
        aria-label="Close"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>

      {step === 'credentials' && (
        <div>
          <div className="mb-5 pr-10">
            <h2 className="text-2xl sm:text-[1.7rem] font-black text-neutral-900 tracking-tight leading-tight break-words">
              Welcome, <span className="text-[#900606]">Creator</span>
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1 leading-relaxed break-words">
              Enter your email and password to login to your account.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-snug break-words">{loginError}</div>
            </div>
          )}

          {loginSuccessNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-snug break-words">{loginSuccessNotice}</div>
            </div>
          )}

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
                  onChange={(e) =>
                    setLoginData((prev) => ({ ...prev, email: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setLoginData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full pl-10 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer p-1.5 touch-manipulation"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
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
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {step === 'otp' && (
        <div>
          <div className="mb-5 pr-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#900606] text-[11px] font-bold uppercase tracking-wider mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>2-Step Login Verification</span>
            </div>
            <h2 className="text-2xl sm:text-[1.7rem] font-black text-neutral-900 tracking-tight leading-tight break-words">
              Enter <span className="text-[#900606]">OTP</span>
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1 leading-relaxed break-words">
              We sent a 6-digit login code to{' '}
              <span className="font-semibold text-neutral-800 break-all">
                {loginData.email}
              </span>
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-snug break-words">{loginError}</div>
            </div>
          )}

          {loginSuccessNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-snug break-words">{loginSuccessNotice}</div>
            </div>
          )}

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  6-Digit Login Code
                </label>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Expires in 10m
                </span>
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
                  placeholder="• • • • • •"
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
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Login</span>
                </>
              )}
            </button>

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
  );

  if (isModal) {
    return authCardContent;
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#FAF7F2] font-sans selection:bg-[#900606] selection:text-white overflow-x-hidden">
      <div className="pointer-events-none select-none filter blur-[3px] opacity-75">
        <div className="w-full bg-[#FAF7F2] border-b border-neutral-200/80 py-1.5 text-center text-xs text-neutral-700 font-medium">
          <span className="text-[#900606] font-bold">Creator Sale</span> • Special prices on your next setup
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between border-b border-neutral-200/60 bg-white/80">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            Creators{' '}
            <span className="text-white bg-[#900606] px-2 py-0.5 rounded-lg text-lg font-black">
              kit
            </span>
          </span>
          <div className="flex items-center gap-3 text-neutral-500">
            <Search className="w-4 h-4" />
            <UserIcon className="w-5 h-5 text-neutral-700" />
            <ShoppingCart className="w-5 h-5 text-neutral-700" />
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {authCardContent}
      </div>
    </div>
  );
}