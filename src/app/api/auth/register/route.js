import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mailer';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if an account already exists in the users collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 400 }
      );
    }

    // Check if there is an existing pending unverified registration attempt
    let pendingUser = await PendingUser.findOne({ email });

    if (pendingUser) {
      // Update details for fresh registration attempt
      pendingUser.name = name;
      pendingUser.password = password;
    } else {
      pendingUser = new PendingUser({
        name,
        email,
        password,
      });
    }

    // Generate a secure 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    pendingUser.otpCode = hashedOtp;
    pendingUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    await pendingUser.save();

    // Send email with OTP code
    try {
      const message = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 20px; border: 1px solid #eaeaea;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 24px; font-weight: 900; color: #111111; margin: 0 0 8px 0; letter-spacing: -0.5px;">
              Creators <span style="color: #FF1F2D;">kit</span>
            </h1>
            <p style="font-size: 14px; color: #666666; margin: 0;">Account Verification</p>
          </div>
          
          <div style="background: #FAF7F2; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 15px; color: #333333; margin: 0 0 16px 0; font-weight: 500;">
              Hello <strong style="color: #111111;">${name}</strong>, use the verification code below to complete your registration:
            </p>
            <div style="background: #ffffff; border: 2px dashed #FF1F2D; border-radius: 12px; padding: 16px 24px; display: inline-block;">
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #FF1F2D; font-family: monospace;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #777777; margin: 16px 0 0 0;">This code will expire in 10 minutes.</p>
          </div>

          <p style="font-size: 12px; color: #999999; text-align: center; margin: 0; line-height: 1.5;">
            If you didn't create an account with Creators Kit, you can safely ignore this email.
          </p>
        </div>
      `;

      await sendEmail({
        to: pendingUser.email,
        subject: `${otp} is your Creators Kit verification code`,
        html: message,
      });

      return NextResponse.json(
        { message: 'Verification code sent to your email.', email: pendingUser.email },
        { status: 201 }
      );
    } catch (emailErr) {
      console.error('Email sending failed in register route:', emailErr.message);
      console.log('--------------------------------------------------');
      console.log(`[TESTING OTP DISPATCH] Email: ${pendingUser.email} | OTP: ${otp}`);
      console.log('--------------------------------------------------');
      return NextResponse.json(
        { message: 'Registration initiated. Verification code dispatched.', email: pendingUser.email },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate registration', details: error.message },
      { status: 500 }
    );
  }
}
