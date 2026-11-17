import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// CRITICAL FOR HOSTINGER / CLOUD DEPLOYMENTS: Force IPv4 first to eliminate IPv6 network timeouts
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

/**
 * Creates a Nodemailer Transporter strictly bound to IPv4
 * Handles Hostinger port 587 (STARTTLS, secure: false) and port 465 (SSL, secure: true)
 */
function createHostingerTransporter(targetPort) {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = targetPort || Number(process.env.SMTP_PORT) || 587;
  const secure = port === 465;
  const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, '').trim();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    family: 4, // CRITICAL: Always use IPv4 to bypass container unrouted IPv6 issues
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Clean HTML Wrapper Template for 6-Digit OTP Email
 * Optimized for 100% deliverability, mobile client support, and spam filter safety.
 */
function generateOtpHtml({ name, otp, isNewUser = false }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creators Kit Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7;">
          <!-- Top Accent Bar -->
          <tr>
            <td style="background-color: #900606; height: 5px;"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; text-align: center;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #18181b;">
                Creators <span style="background-color: #900606; color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 18px; font-weight: 900;">kit</span>
              </span>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 10px 32px 28px 32px;">
              <h2 style="margin: 0 0 10px 0; color: #18181b; font-size: 20px; font-weight: 800; text-align: center;">
                ${isNewUser ? 'Welcome to Creators Kit!' : 'Your Verification Code'}
              </h2>
              <p style="margin: 0 0 20px 0; color: #52525b; font-size: 14px; line-height: 1.6; text-align: center;">
                Hi <strong>${name || 'Creator'}</strong>,<br/>
                ${
                  isNewUser
                    ? 'Enter the 6-digit verification code below to activate your account and complete your sign in:'
                    : 'Use the following 6-digit verification code to securely access your account:'
                }
              </p>

              <!-- OTP Code Display Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                <tr>
                  <td align="center" style="background-color: #faf5f5; border: 2px dashed #900606; border-radius: 12px; padding: 18px 24px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; color: #900606; letter-spacing: 8px; display: inline-block; padding-left: 8px;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; color: #71717a; font-size: 13px; line-height: 1.5; text-align: center;">
                ⏱️ This code is valid for <strong>10 minutes</strong>.
              </p>

              <hr style="border: none; border-top: 1px solid #f4f4f5; margin: 24px 0 16px 0;" />

              <p style="margin: 0; color: #a1a1aa; font-size: 12px; line-height: 1.5; text-align: center;">
                If you did not request this login code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 16px 32px; text-align: center; border-top: 1px solid #f4f4f5;">
              <p style="margin: 0; color: #a1a1aa; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Creators Kit Hub &bull; All Rights Reserved.<br/>
                <a href="https://creatorskithub.com" style="color: #900606; text-decoration: none; font-weight: 600;">creatorskithub.com</a>
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

/**
 * Dispatches the 6-Digit OTP Email with Smart Dual-Port Failover (587 <-> 465)
 * Guarantees real email delivery across local environments and live Hostinger cloud hosting.
 */
async function dispatchOtpEmail({ to, name, otp, isNewUser = false }) {
  const configuredPort = Number(process.env.SMTP_PORT) || 587;
  const alternativePort = configuredPort === 465 ? 587 : 465;
  const smtpUser = (process.env.SMTP_USER || process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
  const fromEmail = process.env.FROM_EMAIL || `"Creators Kit" <${smtpUser || 'support@creatorskithub.com'}>`;

  const plainText = `Hi ${name || 'Creator'},\n\nYour 6-digit Creators Kit verification code is: ${otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this code, please ignore this email.\n\nCreators Kit Hub\nhttps://creatorskithub.com`;

  const mailOptions = {
    from: fromEmail,
    to,
    subject: `${otp} is your Creators Kit verification code`,
    text: plainText,
    html: generateOtpHtml({ name, otp, isNewUser }),
    headers: {
      'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    },
  };

  // Attempt 1: Try configured port (e.g. 587 from Hostinger hPanel or 465)
  try {
    const transporter = createHostingerTransporter(configuredPort);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[AUTH] Real OTP email sent via port ${configuredPort} to ${to}: ${info.messageId}`);
    return info;
  } catch (primaryErr) {
    console.warn(`[AUTH] Primary dispatch via port ${configuredPort} failed (${primaryErr.message}). Retrying via alternative port ${alternativePort}...`);
    // Attempt 2: Failover to alternative port
    try {
      const fallbackTransporter = createHostingerTransporter(alternativePort);
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[AUTH] Real OTP email sent via fallback port ${alternativePort} to ${to}: ${info.messageId}`);
      return info;
    } catch (fallbackErr) {
      console.error(`[AUTH_ERROR] Email delivery failed on both ports (${configuredPort} & ${alternativePort}):`, fallbackErr.message);
      throw fallbackErr;
    }
  }
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
          { status: 400 }
        );
      }

      const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = freshOtp;
      user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      console.log(`[AUTH] Resending fresh OTP ${freshOtp} to: ${cleanEmail}`);

      try {
        await dispatchOtpEmail({
          to: cleanEmail,
          name: user.name || 'Creator',
          otp: freshOtp,
          isNewUser: !user.isVerified,
        });
      } catch (mailErr) {
        console.error('[AUTH] Failed to send resend email:', mailErr.message);
        return NextResponse.json(
          { error: 'Failed to send verification code email. Please check your connection and try again.' },
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
    // STEP 2: VERIFY OTP CODE & COMPLETE SIGN IN
    // -------------------------------------------------------------
    if (otp !== undefined && otp !== null && String(otp).trim() !== '') {
      const user = await User.findOne({ email: cleanEmail });

      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email address.' },
          { status: 400 }
        );
      }

      if (!user.otpCode || !user.otpExpire) {
        return NextResponse.json(
          { error: 'No verification code requested or it has already expired. Please enter your credentials again.' },
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

      // Success: Clear OTP fields and ensure verified
      user.otpCode = undefined;
      user.otpExpire = undefined;
      user.isVerified = true;
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
    // STEP 1: VALIDATE CREDENTIALS & SEND OTP (SEAMLESS AUTO-REGISTER / LOGIN)
    // -------------------------------------------------------------
    if (!password) {
      return NextResponse.json(
        { error: 'Please enter your password.' },
        { status: 400 }
      );
    }

    // 1. Check if user already exists in MongoDB 'users' collection
    let user = await User.findOne({ email: cleanEmail }).select('+password');
    let isNewUser = false;

    // Generate 6-digit numeric OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (!user) {
      // 2. New User: Seamlessly register user with OTP verification
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      const localPart = cleanEmail.split('@')[0] || 'Creator';
      const formattedName = localPart
        .replace(/[._-]+/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Creator';

      user = new User({
        name: formattedName,
        email: cleanEmail,
        password: password, // Pre-save hook hashes with bcrypt automatically
        role: 'user',
        isVerified: false, // Activated when OTP is verified
        authProvider: 'credentials',
        otpCode: generatedOtp,
        otpExpire: otpExpiration,
      });

      await user.save();
      isNewUser = true;
      console.log(`[AUTH] Auto-created new user for OTP verification: ${cleanEmail}`);
    } else {
      // 3. Existing User: Verify password with bcrypt
      if (!user.password) {
        user.password = password;
      } else {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return NextResponse.json(
            { error: 'Incorrect password. Please try again or use Forgot Password.' },
            { status: 401 }
          );
        }
      }

      user.otpCode = generatedOtp;
      user.otpExpire = otpExpiration;
      await user.save();
      console.log(`[AUTH] Step 1 passed for existing user: ${cleanEmail}`);
    }

    console.log(`[AUTH] Step 1 generated OTP ${generatedOtp} for ${cleanEmail} (isNewUser: ${isNewUser})`);

    // 4. Send OTP code to user's real email via Hostinger SMTP (with IPv4 & automatic failover)
    try {
      await dispatchOtpEmail({
        to: cleanEmail,
        name: user.name || 'Creator',
        otp: generatedOtp,
        isNewUser,
      });
    } catch (mailErr) {
      console.error('[AUTH] Failed to send OTP email:', mailErr.message);
      return NextResponse.json(
        { error: 'Failed to send verification code email. Please check your connection and try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        requiresOtp: true,
        isNewUser,
        email: cleanEmail,
        message: isNewUser
          ? 'Account created! A 6-digit verification code has been sent to your email.'
          : 'A 6-digit verification code has been sent to your email.',
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
