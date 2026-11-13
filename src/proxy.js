import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  '9569bbd37859d9e4d925e16947b6f9a794afe5d929f473be9d21195f690a94ee';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Dynamic secure flag detection for Hostinger reverse proxy
  const isSecure =
    process.env.NODE_ENV === 'production' ||
    request.url.startsWith('https://') ||
    request.headers.get('x-forwarded-proto') === 'https';

  // 2. Resilient token decoding (tries isSecure, falls back to inverted if reverse proxy stripped HTTPS header)
  let token = await getToken({
    req: request,
    secret: NEXTAUTH_SECRET,
    secureCookie: isSecure,
  });

  if (!token) {
    token = await getToken({
      req: request,
      secret: NEXTAUTH_SECRET,
      secureCookie: !isSecure,
    });
  }

  // 3. Read isolated cookie roles (ensuring multi-tab Admin/User independence)
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

  // 0. Unified Login: Route any /admin/login, /register, or legacy auth routes directly to /login
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname === '/register' ||
    pathname.startsWith('/register/') ||
    pathname === '/verify-otp' ||
    pathname.startsWith('/verify-otp/') ||
    pathname === '/reset-password' ||
    pathname.startsWith('/reset-password/') ||
    pathname.startsWith('/auth/callback')
  ) {
    const loginUrl = new URL('/login', request.url);
    if (request.nextUrl.search) {
      loginUrl.search = request.nextUrl.search;
    }
    return NextResponse.redirect(loginUrl);
  }

  // 1. Dedicated Admin Workspace (/admin/*):
  // Strictly restricted to users with role 'admin'.
  // Preserves existing sessions without destructive session wipes.
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
  // Requires authenticated user or admin.
  if (isProtectedCustomerRoute) {
    if (!isUserAuthenticated && !isAdminAuthenticated) {
      const authPath = '/login';
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
