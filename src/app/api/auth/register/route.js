import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mailer';
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide name, email and password' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }
      // If unverified, update details for a fresh registration attempt
      user.name = name;
      user.password = password;
    } else {
      user = new User({
        name,
        email,
        password,
        role: 'user',
        isVerified: false
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.otpCode = hashedOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Send email with OTP
    try {
      const message = `
        <h1>Welcome to Creators Kit!</h1>
        <p>Please use the following 6-digit code to verify your account:</p>
        <h2 style="background: #eee; padding: 10px; display: inline-block;">${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: 'Verify your account',
        html: message,
      });

      return NextResponse.json(
        { message: 'Registration initiated. Please verify OTP.', email: user.email },
        { status: 201 }
      );
    } catch (emailErr) {
      console.error('Email error in register:', emailErr.message);
      user.otpCode = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return NextResponse.json(
        { error: 'Registration succeeded, but failed to send verification email. Please try again or request a new OTP.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Failed to register user', details: error.message },
      { status: 500 }
    );
  }
}
