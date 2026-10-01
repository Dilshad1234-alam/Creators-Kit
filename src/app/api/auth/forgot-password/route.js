import { NextResponse} from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail} from '@/lib/mailer';

export async function POST(req) {
 try {
 const { email} = await req.json();

 if (!email) {
 return NextResponse.json(
 { error: 'Please provide an email address'},
 { status: 400}
 );
}

 await connectDB();

 const user = await User.findOne({ email});

 if (!user) {
 // Don't reveal if user exists or not for security reasons
 return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link.'});
}

 // Generate 6-digit OTP
 const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

 user.otpCode = otpCode;
 user.otpExpire = Date.now() + 15 * 60 * 1000;

 await user.save({ validateBeforeSave: false});

 try {

 const message = `
  <h1>Password Reset OTP</h1>
  <p>You requested a password reset. Your OTP is:</p>
  <h2 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">${otpCode}</h2>
  <p>This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
`;

 await sendEmail({
 to: user.email,
 subject: 'Password Reset OTP',
 html: message,
});

 return NextResponse.json({ message: 'Email sent'}, { status: 200});
} catch (emailErr) {
 console.error('Email error in forgot-password:', emailErr.message);
 user.otpCode = undefined;
 user.otpExpire = undefined;
 await user.save({ validateBeforeSave: false});

 return NextResponse.json({ error: 'Email could not be sent'}, { status: 500});
}
} catch (error) {
 console.error('Forgot password error:', error);
 return NextResponse.json(
 { error: 'Internal server error'},
 { status: 500}
 );
}
}
