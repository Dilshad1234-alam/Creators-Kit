import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Please provide email address' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    let targetUser = await PendingUser.findOne({ email: cleanEmail });
    let isPending = true;

    if (!targetUser) {
      targetUser = await User.findOne({ email: cleanEmail });
      isPending = false;
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'No registration or user found for this email' }, { status: 404 });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (isPending) {
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
      targetUser.otpCode = hashedOtp;
    } else {
      targetUser.otpCode = otp; // Stored in plain text for forgot password
    }

    targetUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await targetUser.save();

    // Send email with new OTP
    try {
      const message = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 20px; border: 1px solid #eaeaea;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 24px; font-weight: 900; color: #111111; margin: 0 0 8px 0; letter-spacing: -0.5px;">
              Creators <span style="color: #FF1F2D;">kit</span>
            </h1>
            <p style="font-size: 14px; color: #666666; margin: 0;">New Verification Code</p>
          </div>
          
          <div style="background: #FAF7F2; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 15px; color: #333333; margin: 0 0 16px 0; font-weight: 500;">
              Your new verification code is:
            </p>
            <div style="background: #ffffff; border: 2px dashed #FF1F2D; border-radius: 12px; padding: 16px 24px; display: inline-block;">
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #FF1F2D; font-family: monospace;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #777777; margin: 16px 0 0 0;">This code will expire in 10 minutes.</p>
          </div>

          <p style="font-size: 12px; color: #999999; text-align: center; margin: 0; line-height: 1.5;">
            If you did not request this verification code, please ignore this email.
          </p>
        </div>
      `;

      await sendEmail({
        to: targetUser.email,
        subject: `${otp} is your new Creators Kit verification code`,
        html: message,
      });

      return NextResponse.json({ message: 'A new verification code has been sent to your email.' }, { status: 200 });
    } catch (emailErr) {
      console.error('Email error in resend-otp:', emailErr.message);
      console.log('--------------------------------------------------');
      console.log(`[TESTING RESEND OTP] Email: ${targetUser.email} | OTP: ${otp}`);
      console.log('--------------------------------------------------');
      return NextResponse.json({ message: 'A new verification code has been dispatched.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
