import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Decrypt NextAuth JWT Token securely from cookies
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  // 2. Read isolated cookie roles (ensuring multi-tab Admin/User independence)
  const adminCookieRole = request.cookies.get('admin_role')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;
  const userCookieRole = request.cookies.get('user_role')?.value;
  const authToken = request.cookies.get('auth_token')?.value;

  const isAdminAuthenticated =
    (token && token.role === 'admin') ||
    (adminCookieRole === 'admin' && Boolean(adminToken));

  const isUserAuthenticated =
    Boolean(token) ||
    Boolean(authToken) ||
    Boolean(userCookieRole);

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isProtectedCustomerRoute =
    pathname === '/checkout' ||
    pathname.startsWith('/checkout/') ||
    pathname === '/account' ||
    pathname.startsWith('/account/') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/');

  // 0. Unified Login: Route any /admin/login directly to /login
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  // 1. Dedicated Admin Workspace (/admin/*):
  // Strictly restricted to users with role 'admin'.
  // Crucially: Redirects without purging or clearing customer cookies,
  // preventing accidental session destruction in user tabs.
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'AdminAccessRequired');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Protected Customer Checkout & Account Routes:
  // Requires authenticated user or admin. Redirects unauthenticated visitors without destroying session state.
  if (isProtectedCustomerRoute) {
    if (!isUserAuthenticated && !isAdminAuthenticated) {
      const authPath = pathname.startsWith('/checkout') ? '/register' : '/login';
      const redirectUrl = new URL(authPath, request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // 3. Public Storefront Routes: Always render freely
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
