import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mailer';
export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Please provide email' }, { status: 400 });
    }

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      // It's possible the user is already verified and in the main User collection.
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User is already verified' }, { status: 400 });
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    pendingUser.otpCode = hashedOtp;
    pendingUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await pendingUser.save();

    // Send email with new OTP
    try {
      const message = `
        <h1>Your New OTP Code</h1>
        <p>Please use the following 6-digit code to verify your account:</p>
        <h2 style="background: #eee; padding: 10px; display: inline-block;">${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
      `;

      await sendEmail({
        to: pendingUser.email,
        subject: 'Your new verification code',
        html: message,
      });

      return NextResponse.json({ message: 'A new OTP has been sent to your email.' }, { status: 200 });
    } catch (emailErr) {
      console.error('Email error in resend-otp:', emailErr.message);
      // Return 200 because the OTP was successfully generated, but warn the frontend the email failed
      // Or return 500 depending on requirements. We'll return 500 but safely caught.
      return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
