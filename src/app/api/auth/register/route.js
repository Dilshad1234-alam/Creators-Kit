import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
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

    // Create and save new User directly into the MongoDB Compass 'users' collection
    // The User model pre-save hook automatically hashes the password with bcrypt
    const newUser = new User({
      name,
      email,
      password,
      role: 'user',
      isVerified: true,
      authProvider: 'credentials',
    });

    await newUser.save();
    console.log(`[AUTH] User successfully registered and saved in MongoDB 'users' collection: ${newUser.email} (ID: ${newUser._id})`);

    // Clean up any stale unverified/pending entries for this email
    try {
      await PendingUser.deleteMany({ email });
    } catch (cleanErr) {
      console.warn('[AUTH] Cleaned pending user warning:', cleanErr.message);
    }

    // Send welcome confirmation email in background without blocking response
    try {
      const welcomeHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 20px; border: 1px solid #eaeaea;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 26px; font-weight: 900; color: #111111; margin: 0 0 8px 0; letter-spacing: -0.5px;">
              Creators <span style="color: #900606;">kit</span>
            </h1>
            <p style="font-size: 14px; color: #666666; margin: 0;">Welcome to Creators Kit</p>
          </div>
          
          <div style="background: #FAF7F2; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 16px; color: #333333; margin: 0 0 12px 0; font-weight: 600;">
              Hello <strong style="color: #111111;">${name}</strong>, welcome aboard!
            </p>
            <p style="font-size: 13px; color: #666666; margin: 0; line-height: 1.6;">
              Your account has been created successfully. You can now explore studio gear, creator bundles, and enjoy exclusive member checkout.
            </p>
          </div>

          <p style="font-size: 12px; color: #999999; text-align: center; margin: 0; line-height: 1.5;">
            Creators Kit Hub &bull; Equip Your Studio
          </p>
        </div>
      `;

      sendEmail({
        to: newUser.email,
        subject: `Welcome to Creators Kit, ${name}!`,
        html: welcomeHtml,
      }).catch((emailErr) => {
        console.warn('[AUTH] Welcome email dispatch note:', emailErr.message);
      });
    } catch (e) {
      // Non-fatal
    }

    return NextResponse.json(
      {
        message: 'Account created successfully!',
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Failed to create account', details: error.message },
      { status: 500 }
    );
  }
}
