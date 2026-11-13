import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: 'Please provide email, OTP, and new password.' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Set new password
    user.password = password;
    user.otpCode = undefined;
    user.otpExpire = undefined;

    // The pre('save') hook in User model will automatically hash the new password
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('[AUTH_ERROR] Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
