'use client';

import { useSession, signOut } from 'next-auth/react';
import { useMemo, useCallback } from 'react';

/**
 * Production-Grade Client Hook for Role & Session Isolation
 * 
 * Safely inspects session state across tabs without causing accidental
 * cross-tab session contamination or cascading global logouts.
 */
export function useAuthRole() {
  const { data: session, status } = useSession();

  // Inspect client-side cookies/storage safely
  const clientAdminRole = typeof window !== 'undefined'
    ? sessionStorage.getItem('adminRole') || (document.cookie.includes('admin_role=admin') ? 'admin' : null)
    : null;

  const clientUserRole = typeof window !== 'undefined'
    ? sessionStorage.getItem('userRole') || (document.cookie.includes('user_role=user') ? 'user' : null)
    : null;

  const role = useMemo(() => {
    if (session?.user?.role === 'admin' || clientAdminRole === 'admin') {
      return 'admin';
    }
    if (session?.user?.role === 'user' || clientUserRole === 'user' || status === 'authenticated') {
      return 'user';
    }
    return 'guest';
  }, [session, status, clientAdminRole, clientUserRole]);

  const isAdmin = role === 'admin';
  const isUser = role === 'user' || isAdmin;
  const isAuthenticated = status === 'authenticated' || isAdmin || Boolean(clientUserRole);

  /**
   * Safe Admin Logout:
   * Only cleans admin credentials and cookies. Does NOT purge user credentials
   * or kill active customer sessions in storefront tabs.
   */
  const safeAdminLogout = useCallback(async () => {
    if (typeof window !== 'undefined') {
      ['adminName', 'adminEmail', 'adminRole', 'adminToken'].forEach((k) => {
        try {
          sessionStorage.removeItem(k);
          localStorage.removeItem(k);
        } catch (e) {}
      });

      // Clear admin-specific cookies
      document.cookie = 'admin_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'admin_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'admin_email=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'admin_name=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

      window.location.href = '/login?redirect=/admin';
    }
  }, []);

  /**
   * Safe User Logout:
   * Only cleans customer session data. Preserves active admin panel session in another tab.
   */
  const safeUserLogout = useCallback(async () => {
    if (typeof window !== 'undefined') {
      ['userName', 'userEmail', 'userRole', 'token', 'creatorsKitUserInfo'].forEach((k) => {
        try {
          sessionStorage.removeItem(k);
          localStorage.removeItem(k);
        } catch (e) {}
      });

      document.cookie = 'user_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'user_email=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'user_name=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

      await signOut({ redirect: false }).catch(() => {});
      window.location.href = '/';
    }
  }, []);

  return {
    session,
    status,
    role,
    isAdmin,
    isUser,
    isAuthenticated,
    user: session?.user || null,
    safeAdminLogout,
    safeUserLogout,
  };
}

export default useAuthRole;

