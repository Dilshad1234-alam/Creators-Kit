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
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Block login if user has not verified their OTP
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: 'Please verify your email address before logging in.',
          email: user.email,
          isPending: true,
        },
        { status: 403 }
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Failed to login user', details: error.message },
      { status: 500 }
    );
  }
}
