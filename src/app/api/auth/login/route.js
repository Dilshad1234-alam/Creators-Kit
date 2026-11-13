import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user already exists in MongoDB 'users' collection
    let user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      // 2. Auto-Signup: Automatically register/create user if email does not exist
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Generate a user-friendly default name from the email (e.g. "alex.morgan" -> "Alex Morgan")
      const localPart = cleanEmail.split('@')[0] || 'Creator';
      const formattedName = localPart
        .replace(/[._-]+/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Creator';

      user = new User({
        name: formattedName,
        email: cleanEmail,
        password: password, // Pre-save hook hashes with bcrypt automatically
        role: 'user',
        isVerified: true,
        authProvider: 'credentials',
      });

      await user.save();
      console.log(`[AUTH] Auto-created new user in 'users' collection: ${user.email} (ID: ${user._id})`);
    } else {
      // 3. Existing User: Securely validate password with bcrypt
      if (!user.password) {
        // If an existing legacy record had no password, set this as their password
        user.password = password;
        await user.save();
      } else {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return NextResponse.json(
            { error: 'Incorrect password. Please try again or use Forgot Password.' },
            { status: 401 }
          );
        }
      }
    }

    // Auto-verify user upon successful login if needed
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

    // Session cookie options
    const isProd = process.env.NODE_ENV === 'production';
    const sessionCookieOptions = {
      path: '/',
      sameSite: 'lax',
      secure: isProd,
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
    console.error('[AUTH_ERROR] Login Error:', error);
    return NextResponse.json(
      { error: 'Failed to process login', details: error.message },
      { status: 500 }
    );
  }
}
