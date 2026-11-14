import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully.' },
      { status: 200 }
    );

    // Expire and clear all auth cookies from server response
    const cookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.csrf-token',
      '__Secure-next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'next-auth.pkce.code_verifier',
      '__Secure-next-auth.pkce.code_verifier',
      'next-auth.state',
      '__Secure-next-auth.state',
      'user_role',
      'user_email',
      'user_name',
      'auth_token',
      'admin_role',
      'admin_email',
      'admin_name',
      'admin_token',
    ];

    cookieNames.forEach((name) => {
      response.cookies.set(name, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        sameSite: 'lax',
      });
    });

    return response;
  } catch (error) {
    console.error('[AUTH_ERROR] Logout API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process logout', details: error.message },
      { status: 500 }
    );
  }
}
