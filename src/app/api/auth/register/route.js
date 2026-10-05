import { NextResponse} from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import crypto from 'crypto';
import { sendEmail} from '@/lib/mailer';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(req) {
 try {
 await dbConnect();

 const body = await req.json();
 const { name, email, password} = body;

 if (!name || !email || !password) {
 return NextResponse.json(
 { error: 'Please provide name, email and password'},
 { status: 400}
 );
}

 // First check if a verified user already exists
 const existingUser = await User.findOne({ email});
 if (existingUser) {
 return NextResponse.json(
 { error: 'User already exists'},
 { status: 400}
 );
}

 // Now check if there is an unverified registration attempt
 let pendingUser = await PendingUser.findOne({ email});

 if (pendingUser) {
 // If unverified, update details for a fresh registration attempt
 pendingUser.name = name;
 pendingUser.password = password;
} else {
 pendingUser = new PendingUser({
 name,
 email,
 password,
});
}

 // Generate 6-digit OTP
 const otp = Math.floor(100000 + Math.random() * 900000).toString();
 const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

 pendingUser.otpCode = hashedOtp;
 pendingUser.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

 await pendingUser.save();

 // Send email with OTP
 try {
 const message =`
 <h1>Welcome to Creators Kit!</h1>
 <p>Please use the following 6-digit code to verify your account:</p>
 <h2 style="background: #eee; padding: 10px; display: inline-block;">${otp}</h2>
 <p>This code will expire in 10 minutes.</p>
`;

 await sendEmail({
 to: pendingUser.email,
 subject: 'Verify your account',
 html: message,
});

 return NextResponse.json(
 { message: 'Registration initiated. Please verify OTP.', email: pendingUser.email},
 { status: 201}
 );
 } catch (emailErr) {
  console.error('Email error in register:', emailErr.message);
 console.log('--- OTP FOR TESTING (EMAIL FAILED) ---');
 console.log('OTP Code: ' + otp);
 console.log('--------------------------------------');
 return NextResponse.json(
 { message: 'Registration initiated, but email failed. Check terminal for OTP.', email: pendingUser.email },
 { status: 201 }
 );
 }
} catch (error) {
 console.error('Registration Error:', error);
 return NextResponse.json(
 { error: 'Failed to register user', details: error.message},
 { status: 500}
 );
}
}
