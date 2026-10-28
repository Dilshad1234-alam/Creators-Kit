'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  GraduationCap,
  Heart,
  Settings,
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

  const toggleMode = (newMode) => {
    setMode(newMode);
    setLoginError('');
    setRegisterError('');
    setOtpError('');
    setOtpSuccess('');
    setSocialNotice('');

    if (newMode === 'login') {
      router.push('/login');
    } else if (newMode === 'register') {
      router.push('/register');
    } else if (newMode === 'otp') {
      router.push(`/register?step=otp${otpEmail ? `&email=${encodeURIComponent(otpEmail)}` : ''}`);
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
          router.push(`/register?step=otp&email=${encodeURIComponent(target)}`);
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
      router.push(`/register?step=otp&email=${encodeURIComponent(verifiedEmail)}`);
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
        if (redirectParam) {
          router.push(`/login?verified=true&redirect=${encodeURIComponent(redirectParam)}`);
        } else {
          router.push('/login?verified=true');
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

  const featureCards = [
    { title: 'Track Your Orders', desc: 'Get real-time updates on your purchases', icon: Package },
    { title: 'Access Free Courses', desc: 'Learn Instagram, YouTube & more', icon: GraduationCap },
    { title: 'Manage Wishlist', desc: 'Save your favorite creator products', icon: Heart },
    { title: 'Update Your Profile', desc: 'Keep your information up to date', icon: Settings },
  ];

  return (
    <div className="h-[100svh] max-h-[100svh] w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden font-sans selection:bg-[#FF1F2D] selection:text-white">
      {/* ========================================================================= */}
      {/* LEFT PANEL (6 COLS): IMMERSIVE DARK CREATOR STUDIO                         */}
      {/* ========================================================================= */}
      <div className="lg:col-span-6 relative bg-neutral-950 text-white p-5 sm:p-7 lg:p-8 xl:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800/80 overflow-hidden h-full max-h-[100svh]">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#FF1F2D]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF1F2D]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* 1. Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-red-100 transition-colors">
              Creators <span className="text-[#FF1F2D]">kit</span>
            </span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/[0.06] border border-white/10 text-neutral-300 backdrop-blur-md">
            Creator Hub
          </span>
        </div>

        {/* 2. Main Content Area */}
        <div className="relative z-10 my-auto py-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-[#FF1F2D]" />
              <span className="text-[11px] font-bold text-[#FF1F2D] uppercase tracking-wider">
                {isLogin ? 'WELCOME BACK' : isOtp ? 'VERIFY EMAIL' : 'JOIN THE COMMUNITY'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-black text-white tracking-tight leading-[1.15]">
              {isOtp ? (
                <>
                  Verify Your <span className="text-[#FF1F2D]">Account</span>
                </>
              ) : (
                <>
                  Continue Your Creator <span className="text-[#FF1F2D]">Journey</span>
                </>
              )}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
              {isOtp
                ? 'Enter the 6-digit verification code sent to your email to finalize your account and access your creator tools.'
                : isLogin
                ? 'Log in to access your orders, courses, wishlist and exclusive creator benefits.'
                : 'Join the ecosystem and equip your studio with premium creator gear.'}
            </p>
          </div>

          {/* Studio Equipment Preview Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl group my-3 lg:my-4">
            <div className="relative h-50 sm:h-70 lg:h-90 w-full">
              <Image
                src="/creator-studio.jpg"
                alt="Creator Studio Setup"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                <span className="font-semibold tracking-wide drop-shadow-md">
                  Lighting • Audio • Carbon Tripods
                </span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {featureCards.map((b, idx) => {
              const IconComponent = b.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-2.5 sm:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#FF1F2D]/50 transition-all duration-300 backdrop-blur-sm flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full border border-white/20 bg-white/[0.06] flex items-center justify-center shrink-0 text-white group-hover:border-[#FF1F2D] group-hover:text-[#FF1F2D] group-hover:bg-[#FF1F2D]/10 transition-all duration-300 mt-0.5">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white tracking-tight group-hover:text-red-100 transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bottom Brand Script Quote */}
        <div className="relative z-10 pt-3 border-t border-neutral-800/80 flex items-end justify-between">
          <div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-white/90 leading-tight">
              Same People, More Creators
            </div>
            <div className="w-12 h-[2px] bg-[#FF1F2D] rounded-full mt-1.5" />
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
            <span className="text-[10px] font-medium text-neutral-300">Verified Hub</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL (6 COLS): VERTICAL FLOATING CARD LAYOUT                         */}
      {/* ========================================================================= */}
      <div className="lg:col-span-6 relative bg-[#FAF7F2] text-neutral-900 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center overflow-hidden h-full max-h-[100svh]">
        {/* Soft Background Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/30 rounded-full blur-2xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200/20 rounded-full blur-2xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

        {/* Vertical Card Wrapper */}
        <div className="w-full max-w-[480px] relative z-10 my-auto">
          <div className="w-full bg-white rounded-[2.75rem] p-7 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.07)] border border-neutral-100 flex flex-col justify-between space-y-4 sm:space-y-5">
            {/* Top Back Link */}
            <div>
              {isOtp ? (
                <button
                  type="button"
                  onClick={() => toggleMode('register')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Registration
                </button>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <span>←</span> Back to main site
                </Link>
              )}
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {isLogin ? (
                  <>
                    Welcome Back, <span className="text-[#FF1F2D]">Creator</span>
                  </>
                ) : isOtp ? (
                  <>
                    Verify Your <span className="text-[#FF1F2D]">Email</span>
                  </>
                ) : (
                  <>
                    Create Account, <span className="text-[#FF1F2D]">Creator</span>
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
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1F2D]/20 focus:border-[#FF1F2D] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-bold text-[#FF1F2D] hover:underline">
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
                      className="w-full pl-10 pr-10 py-3.5 bg-white border border-neutral-200 rounded-2xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1F2D]/20 focus:border-[#FF1F2D] shadow-sm"
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

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-neutral-300 text-[#FF1F2D] focus:ring-[#FF1F2D]"
                  />
                  <label htmlFor="remember" className="text-xs text-neutral-600 font-medium cursor-pointer">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="relative w-full py-3.5 mt-2 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {loginLoading ? 'Signing In...' : 'Sign In to Creator Dashboard ➔'}
                  </span>
                </button>
              </form>
            ) : isRegister ? (
              // -------------------------------------------------------------------
              // FORM B: REGISTRATION FORM
              // -------------------------------------------------------------------
              <form className="space-y-3 sm:space-y-3.5" onSubmit={handleRegisterSubmit}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
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
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1F2D]/20 focus:border-[#FF1F2D] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
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
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1F2D]/20 focus:border-[#FF1F2D] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
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
                      className="w-full pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-2xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF1F2D]/20 focus:border-[#FF1F2D] shadow-sm"
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

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={registerData.agreeTerms}
                      onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                      className="w-3.5 h-3.5 mt-0.5 rounded border-neutral-300 text-[#FF1F2D] focus:ring-[#FF1F2D]"
                    />
                    <span className="text-[11px] text-neutral-600 leading-snug">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#FF1F2D] hover:underline font-semibold">
                        Terms
                      </Link>{' '}
                      &{' '}
                      <Link href="/privacy" className="text-[#FF1F2D] hover:underline font-semibold">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={registerLoading}
                  className="relative w-full py-3.5 mt-2 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {registerLoading ? 'Sending Verification Code...' : 'Create Account & Verify ➔'}
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
                      className="text-xs font-bold text-[#FF1F2D] hover:underline cursor-pointer"
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
                      className="w-full text-center text-3xl font-mono font-bold tracking-[0.45em] py-3.5 bg-white border border-neutral-200 rounded-2xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF1F2D]/20 focus:border-[#FF1F2D] shadow-sm transition-all placeholder:text-neutral-300"
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
                  className="relative w-full py-3.5 mt-2 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {otpLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        Verifying & Saving...
                      </>
                    ) : (
                      'Confirm Code & Finalize Account ➔'
                    )}
                  </span>
                </button>

                {/* Resend Code Section */}
                <div className="pt-2 text-center">
                  <p className="text-xs text-neutral-500">
                    Didn&apos;t receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendLoading || resendCooldown > 0}
                      className="font-bold text-[#FF1F2D] hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed inline-flex items-center gap-1"
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
              <div className="pt-1">
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-neutral-200 w-full" />
                  <span className="bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest shrink-0">
                    Or continue with
                  </span>
                  <div className="border-t border-neutral-200 w-full" />
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    id="google-signin-btn"
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 font-bold text-sm shadow-sm cursor-pointer transition-all duration-200 hover:border-neutral-300 hover:shadow disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {googleLoading ? (
                      <div className="w-4 h-4 border-2 border-neutral-400 border-t-[#FF1F2D] rounded-full animate-spin" />
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
                      className="font-bold text-[#FF1F2D] hover:underline cursor-pointer ml-1"
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
                      className="font-bold text-[#FF1F2D] hover:underline cursor-pointer ml-1"
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
                      className="font-bold text-[#FF1F2D] hover:underline cursor-pointer ml-1"
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
