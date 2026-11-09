'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AuthCallbackClient({ initialUser, redirectParam }) {
  const { data: session } = useSession();
  const [errorMsg, setErrorMsg] = useState('');
  const handledRef = useRef(false);

  const destination =
    initialUser?.role === 'admin'
      ? '/admin'
      : redirectParam &&
        !redirectParam.startsWith('/login') &&
        !redirectParam.startsWith('/register') &&
        !redirectParam.startsWith('/auth')
      ? redirectParam
      : '/';

  useEffect(() => {
    if (handledRef.current) return;

    const user = initialUser || session?.user;
    if (user) {
      handledRef.current = true;
      try {
        const isAdmin = user.role === 'admin';
        sessionStorage.setItem('userName', user.name || '');
        sessionStorage.setItem('userEmail', user.email || '');
        sessionStorage.setItem('userRole', isAdmin ? 'admin' : 'user');
        sessionStorage.setItem('token', 'session_active');

        document.cookie = `user_role=${isAdmin ? 'admin' : 'user'}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `user_email=${encodeURIComponent(user.email || '')}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `user_name=${encodeURIComponent(user.name || '')}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = 'auth_token=session_active; path=/; max-age=2592000; SameSite=Lax';

        if (isAdmin) {
          sessionStorage.setItem('adminName', user.name || '');
          sessionStorage.setItem('adminEmail', user.email || '');
          sessionStorage.setItem('adminRole', 'admin');
          sessionStorage.setItem('adminToken', 'admin_active');
          localStorage.setItem('adminName', user.name || '');
          localStorage.setItem('adminEmail', user.email || '');
          localStorage.setItem('adminRole', 'admin');
          localStorage.setItem('adminToken', 'admin_active');

          document.cookie = `admin_role=admin; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `admin_email=${encodeURIComponent(user.email || '')}; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `admin_name=${encodeURIComponent(user.name || '')}; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `admin_token=admin_active; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `user_role=admin; path=/; max-age=2592000; SameSite=Lax`;

          window.location.replace('/admin');
          return;
        }

        sessionStorage.removeItem('creatorskit_logged_out');
        localStorage.removeItem('creatorskit_logged_out');

        const userInfo = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: 'user',
          profileImage: user.image || user.profileImage || '',
          authProvider: 'google',
        };
        sessionStorage.setItem('creatorsKitUserInfo', JSON.stringify(userInfo));
        sessionStorage.setItem('userName', user.name || '');
        sessionStorage.setItem('userEmail', user.email || '');
        sessionStorage.setItem('userRole', 'user');
        sessionStorage.setItem('token', 'session_active');

        localStorage.setItem('creatorsKitUserInfo', JSON.stringify(userInfo));
        localStorage.setItem('userName', user.name || '');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('token', 'session_active');

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: userInfo }));

        const target =
          redirectParam &&
          !redirectParam.startsWith('/login') &&
          !redirectParam.startsWith('/register') &&
          !redirectParam.startsWith('/auth')
            ? redirectParam
            : '/';

        window.location.replace(target);
      } catch (err) {
        console.error('Session sync error:', err);
        window.location.replace(destination);
      }
      return;
    }

    // Fallback: If initialUser was not available, fetch sync endpoint immediately
    async function fallbackSync() {
      try {
        const res = await fetch('/api/auth/google/sync', { cache: 'no-store' });
        const data = await res.json();
        if (data.authenticated && data.user) {
          handledRef.current = true;
          const u = data.user;
          sessionStorage.setItem('userName', u.name);
          sessionStorage.setItem('userEmail', u.email);
          sessionStorage.setItem('userRole', u.role || 'user');
          sessionStorage.setItem('token', 'session_active');

          const info = {
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role || 'user',
            profileImage: u.profileImage || '',
            authProvider: 'google',
          };
          localStorage.setItem('creatorsKitUserInfo', JSON.stringify(info));
          localStorage.setItem('userName', u.name);
          localStorage.setItem('userEmail', u.email);
          localStorage.setItem('userRole', u.role || 'user');
          localStorage.setItem('token', 'session_active');

          const target = u.role === 'admin' ? '/admin' : redirectParam || '/';
          window.location.replace(target);
        } else {
          setErrorMsg('Authentication session could not be established. Please try logging in again.');
        }
      } catch (err) {
        setErrorMsg('Authentication failed. Please sign in again.');
      }
    }

    fallbackSync();
  }, [initialUser, session, destination, redirectParam]);

  return (
    <div className="h-[100svh] w-full flex flex-col items-center justify-center bg-neutral-950 text-white p-6 relative overflow-hidden font-sans">
      {/* Synchronous inline script for instant zero-lag redirect before React hydration */}
      {initialUser && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var u = ${JSON.stringify({
                  id: initialUser.id,
                  name: initialUser.name,
                  email: initialUser.email,
                  role: initialUser.role || 'user',
                  profileImage: initialUser.image || '',
                  authProvider: 'google',
                })};
                var isAdmin = u.role === 'admin';
                sessionStorage.setItem('userName', u.name || '');
                sessionStorage.setItem('userEmail', u.email || '');
                sessionStorage.setItem('userRole', isAdmin ? 'admin' : 'user');
                sessionStorage.setItem('token', 'session_active');
                document.cookie = 'user_role=' + (isAdmin ? 'admin' : 'user') + '; path=/; max-age=2592000; SameSite=Lax';
                document.cookie = 'user_email=' + encodeURIComponent(u.email || '') + '; path=/; max-age=2592000; SameSite=Lax';
                document.cookie = 'user_name=' + encodeURIComponent(u.name || '') + '; path=/; max-age=2592000; SameSite=Lax';
                document.cookie = 'auth_token=session_active; path=/; max-age=2592000; SameSite=Lax';
                if (isAdmin) {
                  localStorage.removeItem('creatorsKitUserInfo');
                  localStorage.setItem('userName', u.name || '');
                  localStorage.setItem('userEmail', u.email || '');
                  localStorage.setItem('userRole', 'admin');
                  localStorage.setItem('token', 'session_active');
                  window.location.replace('/admin');
                } else {
                  localStorage.setItem('creatorsKitUserInfo', JSON.stringify(u));
                  localStorage.setItem('userName', u.name || '');
                  localStorage.setItem('userEmail', u.email || '');
                  localStorage.setItem('userRole', 'user');
                  localStorage.setItem('token', 'session_active');
                  window.location.replace(${JSON.stringify(destination)});
                }
              } catch(e) {}
            `,
          }}
        />
      )}

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF1F2D]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl">
        <div className="mb-6">
          <span className="text-2xl font-black tracking-tight text-white">
            Creators <span className="text-[#FF1F2D]">kit</span>
          </span>
        </div>

        {errorMsg ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
              {errorMsg}
            </div>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-[#FF1F2D] hover:bg-[#E01623] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 rounded-full border-3 border-white/20 border-t-[#FF1F2D] animate-spin" />
            <h3 className="text-lg font-bold text-white tracking-tight">Redirecting...</h3>
          </div>
        )}
      </div>
    </div>
  );
}
