import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp, password } = body;

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    if (!user.otpCode || !user.otpExpire) {
      return NextResponse.json(
        { error: 'OTP code has expired or was not requested. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.otpExpire)) {
      return NextResponse.json(
        { error: 'OTP code has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (String(user.otpCode).trim() !== cleanOtp) {
      return NextResponse.json(
        { error: 'Invalid OTP code. Please check your email and try again.' },
        { status: 400 }
      );
    }

    // Set new password (UserSchema pre-save hook will hash it with bcrypt)
    user.password = password;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    user.isVerified = true;

    await user.save();

    console.log(`[AUTH] Password successfully reset for user: ${cleanEmail}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully! Redirecting to login...',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_ERROR] reset-password route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
