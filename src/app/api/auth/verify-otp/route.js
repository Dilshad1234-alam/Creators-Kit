import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Please provide both email and verification code.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    await dbConnect();

    // 1. Check if user is verifying a new registration (PendingUser)
    const pendingUser = await PendingUser.findOne({ email: cleanEmail });

    if (pendingUser) {
      const hashedOtp = crypto.createHash('sha256').update(cleanOtp).digest('hex');

      if (pendingUser.otpCode !== hashedOtp) {
        return NextResponse.json(
          { error: 'Invalid verification code. Please double-check and try again.' },
          { status: 400 }
        );
      }

      if (pendingUser.otpExpire < Date.now()) {
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new code.' },
          { status: 400 }
        );
      }

      // Check if user already exists in users collection (e.g. edge-case duplicate)
      let existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        await PendingUser.deleteOne({ _id: pendingUser._id });
        return NextResponse.json(
          {
            message: 'Account already verified! You can sign in now.',
            user: {
              _id: existingUser._id,
              name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role || 'user',
            },
          },
          { status: 200 }
        );
      }

      // Move from PendingUser to User collection
      // Pre-save hook in User model will automatically hash password with bcrypt
      const newUser = new User({
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
        role: 'user',
        isVerified: true,
      });

      await newUser.save();
      await PendingUser.deleteOne({ _id: pendingUser._id });

      console.log(`[AUTH] User verified and saved to MongoDB 'users' collection: ${newUser.email} (ID: ${newUser._id})`);

      return NextResponse.json(
        {
          message: 'Account verified successfully! Welcome to Creators Kit.',
          user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role || 'user',
          },
        },
        { status: 200 }
      );
    }

    // 2. Check if user is verifying a forgot password OTP (User model)
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found for this email address. Please register.' },
        { status: 400 }
      );
    }

    // In forgot password flow, OTP is stored in plaintext on user document
    if (String(user.otpCode) !== cleanOtp) {
      return NextResponse.json(
        { error: 'Invalid verification code.' },
        { status: 400 }
      );
    }

    if (user.otpExpire && user.otpExpire < Date.now()) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'OTP verified successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify code', details: error.message },
      { status: 500 }
    );
  }
}