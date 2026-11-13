import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const email = body?.email ? body.email.toLowerCase().trim() : '';

    if (email) {
      // Safety rule: Never delete administrator account!
      const user = await User.findOne({ email });
      if (user && user.role !== 'admin' && email !== 'dmd68699@gmail.com') {
        await User.deleteOne({ _id: user._id });
        console.log(`[AUTH] User deleted from database on logout: ${email}`);
      }

      // Also clean up any pending records for this email
      try {
        await PendingUser.deleteMany({ email });
      } catch (cleanErr) {
        // ignore
      }
    }

    const response = NextResponse.json(
      { success: true, message: 'User logged out and removed from database.' },
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
