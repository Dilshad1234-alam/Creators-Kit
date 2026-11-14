import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail } from '@/lib/mailer';

function generateOtpHtml({ name, otp }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creators Kit Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);border:1px solid #e4e4e7;">
          <!-- Top Accent Bar -->
          <tr>
            <td style="background-color:#900606;height:6px;"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px 32px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px;color:#18181b;">
                Creators <span style="background-color:#900606;color:#ffffff;padding:2px 8px;border-radius:8px;font-size:20px;font-weight:900;">kit</span>
              </h1>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="padding:10px 32px 32px 32px;">
              <h2 style="margin:0 0 10px 0;color:#18181b;font-size:20px;font-weight:800;text-align:center;">
                Login Verification Code
              </h2>
              <p style="margin:0 0 24px 0;color:#52525b;font-size:14px;line-height:1.6;text-align:center;">
                Hi <strong>${name || 'Creator'}</strong>,<br/>
                Enter this 6-digit code to securely sign in to your Creators Kit account:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color:#fbf4f4;border:2px dashed #900606;border-radius:14px;padding:20px 16px;text-align:center;margin:20px 0;">
                <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:900;color:#900606;letter-spacing:10px;display:inline-block;padding-left:10px;">
                  ${otp}
                </span>
              </div>

              <p style="margin:0 0 20px 0;color:#71717a;font-size:13px;line-height:1.5;text-align:center;">
                ⏰ This code will expire in <strong>10 minutes</strong>.
              </p>

              <hr style="border:none;border-top:1px solid #f4f4f5;margin:24px 0 20px 0;" />

              <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.5;text-align:center;">
                If you did not request this login verification code, someone may have entered your email by mistake. You can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:18px 32px;text-align:center;border-top:1px solid #f4f4f5;">
              <p style="margin:0;color:#a1a1aa;font-size:11px;">
                &copy; ${new Date().getFullYear()} Creators Kit Hub &bull; All Rights Reserved.<br/>
                <a href="https://creatorskithub.com" style="color:#900606;text-decoration:none;font-weight:600;">creatorskithub.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const { email, password, otp, resend } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // -------------------------------------------------------------
    // ACTION: RESEND OTP CODE
    // -------------------------------------------------------------
    if (resend) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email address.' },
          { status: 404 }
        );
      }

      const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = freshOtp;
      user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      console.log(`[AUTH] Resent fresh OTP to: ${cleanEmail}`);

      try {
        await sendEmail({
          to: cleanEmail,
          subject: `${freshOtp} is your Creators Kit verification code`,
          html: generateOtpHtml({ name: user.name || 'Creator', otp: freshOtp }),
        });
      } catch (mailErr) {
        console.error('[AUTH] Failed to send resend email:', mailErr);
        return NextResponse.json(
          { error: 'Failed to send verification email. Please try again in a few moments.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          requiresOtp: true,
          email: cleanEmail,
          message: 'A fresh 6-digit code has been sent to your email.',
        },
        { status: 200 }
      );
    }

    // -------------------------------------------------------------
    // STEP 2: VERIFY OTP CODE & LOG IN
    // -------------------------------------------------------------
    if (otp !== undefined && otp !== null && String(otp).trim() !== '') {
      const user = await User.findOne({ email: cleanEmail });

      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email address.' },
          { status: 404 }
        );
      }

      if (!user.otpCode || !user.otpExpire) {
        return NextResponse.json(
          { error: 'No verification code requested or it has already expired. Please sign in again.' },
          { status: 400 }
        );
      }

      if (new Date() > new Date(user.otpExpire)) {
        return NextResponse.json(
          { error: 'Verification code has expired. Please click "Resend Code".' },
          { status: 400 }
        );
      }

      const inputOtp = String(otp).trim();
      const storedOtp = String(user.otpCode).trim();

      if (storedOtp !== inputOtp) {
        return NextResponse.json(
          { error: 'Invalid verification code. Please check your email and try again.' },
          { status: 400 }
        );
      }

      // Success: Clear OTP fields
      user.otpCode = undefined;
      user.otpExpire = undefined;
      if (!user.isVerified) {
        user.isVerified = true;
      }
      await user.save();

      const userRole = user.role || 'user';
      const isAdmin = userRole === 'admin';
      const redirectTo = isAdmin ? '/admin' : '/';

      const response = NextResponse.json(
        {
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: userRole,
          redirectTo,
        },
        { status: 200 }
      );

      const isProd = process.env.NODE_ENV === 'production';
      const sessionCookieOptions = {
        path: '/',
        sameSite: 'lax',
        secure: isProd,
      };

      if (isAdmin) {
        response.cookies.set('admin_role', 'admin', sessionCookieOptions);
        response.cookies.set('admin_email', user.email, sessionCookieOptions);
        response.cookies.set('admin_name', user.name, sessionCookieOptions);
        response.cookies.set('admin_token', 'admin_active', sessionCookieOptions);
        response.cookies.set('user_role', 'admin', sessionCookieOptions);
      } else {
        response.cookies.set('user_role', 'user', sessionCookieOptions);
        response.cookies.set('user_email', user.email, sessionCookieOptions);
        response.cookies.set('user_name', user.name, sessionCookieOptions);
        response.cookies.set('auth_token', 'session_active', sessionCookieOptions);
      }

      console.log(`[AUTH] User verified OTP and logged in successfully: ${user.email} (Role: ${userRole})`);
      return response;
    }

    // -------------------------------------------------------------
    // STEP 1: VALIDATE EMAIL & PASSWORD, SEND OTP (NO AUTO-SIGNUP)
    // -------------------------------------------------------------
    if (!password) {
      return NextResponse.json(
        { error: 'Please enter your password.' },
        { status: 400 }
      );
    }

    // 1. Check user exists in MongoDB 'users' collection
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    // Rule: Do NOT auto-create users!
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please check your email or contact support.' },
        { status: 404 }
      );
    }

    // Check if user has password set
    if (!user.password) {
      return NextResponse.json(
        { error: 'No password set for this account. Please use Forgot Password or contact support.' },
        { status: 400 }
      );
    }

    // Verify password securely using bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again or use Forgot Password.' },
        { status: 401 }
      );
    }

    // 2. Generate 6-digit OTP and set 10 minute expiration
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = generatedOtp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    console.log(`[AUTH] Step 1 passed for ${cleanEmail}. Generated OTP: ${generatedOtp}`);

    // 3. Send OTP to user's real email via Hostinger SMTP
    try {
      await sendEmail({
        to: cleanEmail,
        subject: `${generatedOtp} is your Creators Kit verification code`,
        html: generateOtpHtml({ name: user.name || 'Creator', otp: generatedOtp }),
      });
    } catch (mailErr) {
      console.error('[AUTH] Failed to send OTP email:', mailErr);
      return NextResponse.json(
        { error: 'Failed to send verification code email. Please check your connection and try again.' },
        { status: 500 }
      );
    }

    // Return requiresOtp signal for Step 2
    return NextResponse.json(
      {
        success: true,
        requiresOtp: true,
        email: cleanEmail,
        message: 'A 6-digit verification code has been sent to your email.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_ERROR] Login API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process login request', details: error.message },
      { status: 500 }
    );
  }
}
