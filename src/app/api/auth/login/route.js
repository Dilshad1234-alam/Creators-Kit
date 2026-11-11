import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check for user
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      // Check if they are in the pending collection (unverified registration)
      const pendingUser = await PendingUser.findOne({ email: cleanEmail });
      if (pendingUser) {
        return NextResponse.json(
          {
            error: 'Please verify your email address before logging in.',
            email: pendingUser.email,
            isPending: true,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: 'No account found with this email. Please click Sign Up below to create an account.',
          notFound: true,
        },
        { status: 401 }
      );
    }

    // Check if account was created via Google and has no password
    if (!user.password && user.authProvider === 'google') {
      return NextResponse.json(
        { error: 'This account was registered with Google. Please click "Continue with Google" below.' },
        { status: 401 }
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again or use Forgot Password.' },
        { status: 401 }
      );
    }

    // Auto-verify user upon successful credentials match if not already verified
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save().catch(() => {});
    }

    const userRole = user.role || 'user';
    const isAdmin = userRole === 'admin';
    const redirectTo = isAdmin ? '/admin' : '/';

    const response = NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        redirectTo,
      },
      { status: 200 }
    );

    // Session-only cookies: omitting maxAge and expires ensures the browser
    // terminates the session when the browser tab/window is closed.
    const sessionCookieOptions = {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    };

    const clearCookieOptions = {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    };

    if (isAdmin) {
      // Dedicated admin session cookies (isolated from storefront visitor session)
      response.cookies.set('admin_role', 'admin', sessionCookieOptions);
      response.cookies.set('admin_email', user.email, sessionCookieOptions);
      response.cookies.set('admin_name', user.name, sessionCookieOptions);
      response.cookies.set('admin_token', 'admin_active', sessionCookieOptions);
    } else {
      // Dedicated customer session cookies (isolated from admin workspace)
      response.cookies.set('user_role', 'user', sessionCookieOptions);
      response.cookies.set('user_email', user.email, sessionCookieOptions);
      response.cookies.set('user_name', user.name, sessionCookieOptions);
      response.cookies.set('auth_token', 'session_active', sessionCookieOptions);
    }

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Failed to login user', details: error.message },
      { status: 500 }
    );
  }
}
