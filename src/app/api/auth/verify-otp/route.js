import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 6-digit OTP are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    if (!user.otpCode || !user.otpExpire) {
      return NextResponse.json(
        { error: 'No OTP code requested or it has already expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.otpExpire)) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (String(user.otpCode).trim() !== cleanOtp) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check your email and try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_ERROR] verify-otp route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
