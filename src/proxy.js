import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const adminRole = request.cookies.get('admin_role')?.value || request.cookies.get('user_role')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isProtectedCustomerRoute =
    pathname === '/checkout' ||
    pathname.startsWith('/checkout/') ||
    pathname === '/account' ||
    pathname.startsWith('/account/') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/');

  // 0. Unified Login: Route any /admin/login directly to the single unified /login
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  // 1. Dedicated Admin Workspace (/admin/*):
  // The admin panel is strictly restricted. Only users with role: 'admin' can access /admin.
  // If a non-admin or unauthenticated visitor tries to access /admin, redirect to /login.
  if (isAdminRoute) {
    if (adminRole !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Protected Checkout & Customer Account Routes:
  // Authenticated visitors (both users and admins accessing customer profile) are allowed.
  // Unauthenticated guests are redirected to login.
  if (isProtectedCustomerRoute) {
    const hasAuth =
      userRole === 'user' ||
      adminRole === 'admin' ||
      Boolean(request.cookies.get('auth_token')?.value) ||
      Boolean(request.cookies.get('admin_token')?.value);

    if (!hasAuth) {
      const authPath = (pathname === '/checkout' || pathname.startsWith('/checkout/')) ? '/register' : '/login';
      const redirectUrl = new URL(authPath, request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // 3. Public Website & Auth Pages (Home '/', '/login', '/register', '/product', '/cart', etc.):
  // Operates completely independently and always renders cleanly without automatic redirects.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset extensions (e.g. .svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
