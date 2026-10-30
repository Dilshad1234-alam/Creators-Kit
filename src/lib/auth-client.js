'use client';

/**
 * Client-side authentication helpers for customer / storefront users.
 */

export function getStoredCustomer() {
  if (typeof window === 'undefined') return null;

  const rawUser =
    sessionStorage.getItem('creatorsKitUserInfo') ||
    localStorage.getItem('creatorsKitUserInfo');
  const sessionEmail =
    sessionStorage.getItem('userEmail') ||
    localStorage.getItem('userEmail');
  const userRole =
    sessionStorage.getItem('userRole') ||
    localStorage.getItem('userRole');

  // Strictly exclude admin sessions from customer context
  if (userRole === 'admin') return null;

  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser);
      if (parsed?.role === 'admin') return null;
      if (parsed?.email) return parsed;
    } catch (e) {}
  }

  if (sessionEmail && userRole === 'user') {
    const name = sessionStorage.getItem('userName') || localStorage.getItem('userName') || '';
    return { email: sessionEmail, name, role: 'user' };
  }

  // Check document cookie as secondary fallback
  if (typeof document !== 'undefined' && document.cookie) {
    const hasAuthToken = document.cookie.includes('auth_token=');
    const isCustomerRole = document.cookie.includes('user_role=user');
    if (hasAuthToken && isCustomerRole && sessionEmail) {
      return { email: sessionEmail, role: 'user' };
    }
  }

  return null;
}

export function isCustomerAuthenticated() {
  return Boolean(getStoredCustomer());
}
