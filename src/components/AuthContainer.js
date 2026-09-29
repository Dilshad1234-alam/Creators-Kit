'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthContainer({ initialMode = 'login' }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  
  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Register State
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);

  // We do NOT want to reset mode on initialMode change if they are animating back and forth
  // But if the user lands directly, it mounts with initialMode.

  const toggleMode = (newMode) => {
    setMode(newMode);
    // Use native history pushState to change the URL without causing Next.js to unmount the page component,
    // thereby allowing the CSS transition to perfectly execute over 1000ms.
    window.history.pushState(null, '', `/${newMode}`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      sessionStorage.setItem('userName', data.name || loginData.email.split('@')[0]);
      sessionStorage.setItem('userRole', data.role || 'user');
      const urlParams = new URLSearchParams(window.location.search);
      let redirectUrl = urlParams.get('redirect') || '/';
      if (data.role === 'admin' && redirectUrl === '/') redirectUrl = '/admin';
      window.location.href = redirectUrl;
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      router.push(`/verify-otp?email=${encodeURIComponent(registerData.email)}`);
    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Main Container */}
      <div className="relative w-full max-w-[1200px] h-[750px] bg-[#FDFBF7] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-100">
        
        {/* Sign In Form Panel */}
        <div 
          className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex items-center justify-center p-12 lg:p-16 transition-all duration-1000 ease-in-out transform
            ${isLogin ? 'translate-x-0 opacity-100 z-20' : 'translate-x-[100%] md:translate-x-[20%] opacity-0 z-0 pointer-events-none'}`}
        >
          <div className="w-full max-w-md">
            <Link href="/" className="inline-block mb-10">
              <span className="text-4xl font-black text-[#900606] tracking-tight hover:text-[#900606] transition-colors">
                Creators Kit.
              </span>
            </Link>
            
            <h2 className="text-4xl font-bold text-[#900606] mb-3">Sign in</h2>
            <p className="text-lg text-neutral-500 mb-10">Use your account to continue</p>
            
            {loginError && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-base border border-red-100">
                {loginError}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-6 py-5 text-lg bg-[#F9F6EE] border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] transition-all"
                  placeholder="Email Address"
                />
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-6 py-5 text-lg bg-[#F9F6EE] border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] transition-all"
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#900606] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.188-1.52c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                    )}
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between text-base">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-neutral-300 text-[#900606] focus:ring-[#900606]" />
                  <span className="text-neutral-600 group-hover:text-[#900606] transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="font-semibold text-[#900606] hover:text-[#900606] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <button 
                type="submit" 
                disabled={loginLoading}
                className="w-full py-5 mt-4 bg-[#900606] text-white rounded-2xl font-bold text-xl hover:bg-[#900606] shadow-lg shadow-[#900606]/20 hover:shadow-[#900606]/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            {/* Mobile Toggle Button */}
            <div className="mt-10 text-center md:hidden text-lg">
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <button onClick={() => toggleMode('register')} className="font-bold text-[#900606] hover:text-[#900606]">Sign Up</button>
              </p>
            </div>
          </div>
        </div>

        {/* Sign Up Form Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-full md:w-1/2 flex items-center justify-center p-12 lg:p-16 transition-all duration-1000 ease-in-out transform
            ${!isLogin ? 'translate-x-0 opacity-100 z-20' : 'translate-x-[100%] md:translate-x-[20%] opacity-0 z-0 pointer-events-none'}`}
        >
          <div className="w-full max-w-md">
            <Link href="/" className="inline-block mb-10">
              <span className="text-4xl font-black text-[#900606] tracking-tight hover:text-[#900606] transition-colors">
                Creators Kit.
              </span>
            </Link>
            
            <h2 className="text-4xl font-bold text-[#900606] mb-3">Create Account</h2>
            <p className="text-lg text-neutral-500 mb-10">Join us and start your journey</p>
            
            {registerError && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-base border border-red-100">
                {registerError}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleRegisterSubmit}>
              <div>
                <input
                  name="name"
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  className="w-full px-6 py-5 text-lg bg-[#F9F6EE] border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] transition-all"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="w-full px-6 py-5 text-lg bg-[#F9F6EE] border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] transition-all"
                  placeholder="Email Address"
                />
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="w-full px-6 py-5 text-lg bg-[#F9F6EE] border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#900606]/20 focus:border-[#900606] transition-all"
                  placeholder="Password"
                />
              </div>
              <button 
                type="submit" 
                disabled={registerLoading}
                className="w-full py-5 mt-4 bg-[#900606] text-white rounded-2xl font-bold text-xl hover:bg-[#900606] shadow-lg shadow-[#900606]/20 hover:shadow-[#900606]/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {registerLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
            
            {/* Mobile Toggle Button */}
            <div className="mt-10 text-center md:hidden text-lg">
              <p className="text-neutral-600">
                Already have an account?{' '}
                <button onClick={() => toggleMode('login')} className="font-bold text-[#900606] hover:text-[#900606]">Sign In</button>
              </p>
            </div>
          </div>
        </div>

        {/* Sliding Overlay Panel (Desktop Only) */}
        <div 
          className={`hidden md:flex absolute top-0 left-1/2 w-1/2 h-full bg-[#900606] text-white transition-transform duration-1000 ease-in-out z-30 flex-col items-center justify-center p-16 text-center overflow-hidden
            ${isLogin ? 'translate-x-0 rounded-l-[3rem]' : '-translate-x-full rounded-r-[3rem]'}`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#900606] rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#900606] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
          
          <div className={`transition-all duration-1000 ease-in-out absolute flex flex-col items-center justify-center w-full px-16 ${isLogin ? 'opacity-100 translate-x-0 delay-300' : 'opacity-0 translate-x-[20%] pointer-events-none'}`}>
            <h2 className="text-6xl font-black mb-8 tracking-tight text-white">Hello, Friend!</h2>
            <p className="text-emerald-100/80 text-xl mb-12 leading-relaxed max-w-md">
              Enter your personal details and start journey with us today. Create your own premium setup.
            </p>
            <button 
              onClick={() => toggleMode('register')}
              className="px-12 py-4 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-[#FDFBF7] hover:text-[#900606] transition-colors"
            >
              Sign Up
            </button>
          </div>

          <div className={`transition-all duration-1000 ease-in-out absolute flex flex-col items-center justify-center w-full px-16 ${!isLogin ? 'opacity-100 translate-x-0 delay-300' : 'opacity-0 -translate-x-[20%] pointer-events-none'}`}>
            <h2 className="text-6xl font-black mb-8 tracking-tight text-white">Welcome Back!</h2>
            <p className="text-emerald-100/80 text-xl mb-12 leading-relaxed max-w-md">
              To keep connected with us please login with your personal info. Your gear is waiting.
            </p>
            <button 
              onClick={() => toggleMode('login')}
              className="px-12 py-4 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-[#FDFBF7] hover:text-[#900606] transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
