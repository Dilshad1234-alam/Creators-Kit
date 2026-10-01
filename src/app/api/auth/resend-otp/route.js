import { NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';
import { sendEmail} from '@/lib/mailer';
export async function POST(req) {
 try {
 await dbConnect();
 const { email} = await req.json();

 if (!email) {
 return NextResponse.json({ error: 'Please provide email'}, { status: 400});
}

  let targetUser = await PendingUser.findOne({ email });
  let isPending = true;

  if (!targetUser) {
    targetUser = await User.findOne({ email });
    isPending = false;
  }

  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
      <h1>Your New OTP Code</h1>
      <p>Please use the following 6-digit code to verify your account/action:</p>
      <h2 style="background: #eee; padding: 10px; display: inline-block;">${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
    `;

    await sendEmail({
      to: targetUser.email,
      subject: 'Your new verification code',
      html: message,
    });

    return NextResponse.json({ message: 'A new OTP has been sent to your email.' }, { status: 200 });
  } catch (emailErr) {
    console.error('Email error in resend-otp:', emailErr.message);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
} catch (error) {
 console.error('Resend OTP Error:', error);
 return NextResponse.json({ error: 'Internal server error'}, { status: 500});
}
}
