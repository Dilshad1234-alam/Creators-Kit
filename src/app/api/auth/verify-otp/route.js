import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Incoming verification body:', body);

    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Please provide email and OTP.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Check if user is trying to verify registration (PendingUser)
    let pendingUser = await PendingUser.findOne({ email });

    if (pendingUser) {
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

      if (pendingUser.otpCode !== hashedOtp) {
        return NextResponse.json({ error: 'Invalid OTP code.' }, { status: 400 });
      }

      if (pendingUser.otpExpire < Date.now()) {
        return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
      }

      // OTP is valid. Move from PendingUser to User
      const newUser = new User({
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password, // Pre-save hook in User will hash it
        isVerified: true,
      });

      await newUser.save();
      await PendingUser.deleteOne({ _id: pendingUser._id });

      return NextResponse.json({ message: 'Account verified successfully' }, { status: 200 });
    }

    // 2. Check if user is trying to verify forgot password (User)
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json({ error: 'User not found.' }, { status: 400 });
    }

    console.log('DB User Found - Stored OTP:', user.otpCode, 'Expires At:', user.otpExpire, 'Current Time:', Date.now());

    // In forgot-password, OTP is stored in plaintext
    if (String(user.otpCode) !== String(otp)) {
      return NextResponse.json({ error: 'Invalid OTP code.' }, { status: 400 });
    }

    if (user.otpExpire && user.otpExpire < Date.now()) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}