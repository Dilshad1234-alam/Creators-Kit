import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Please provide an email address' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security reasons
      return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire to 15 minutes from now
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const message = `
        <h1>Password Reset Request</h1>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="${resetUrl}" style="background: #FF3B14; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 10px;">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: message,
      });

      return NextResponse.json({ message: 'Email sent' }, { status: 200 });
    } catch (emailErr) {
      console.error('Email error in forgot-password:', emailErr.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return NextResponse.json({ error: 'Email could not be sent' }, { status: 500 });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
