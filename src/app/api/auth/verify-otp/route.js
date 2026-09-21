import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Please provide email and OTP' }, { status: 400 });
    }

    const normalizedEmail = decodeURIComponent(email).toLowerCase();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const pendingUser = await PendingUser.findOne({
      email: normalizedEmail,
      otpCode: hashedOtp,
      otpExpire: { $gt: Date.now() },
    });

    if (!pendingUser) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Move user to main User collection
    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password, // This will be automatically hashed by User pre-save hook
      isVerified: true,
      role: 'user', // Default role
    });

    await user.save();
    
    // Delete the pending registration
    await PendingUser.deleteOne({ _id: pendingUser._id });

    return NextResponse.json({ message: 'Account verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
