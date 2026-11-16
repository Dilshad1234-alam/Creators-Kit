import nodemailer from 'nodemailer';

/**
 * Hostinger SMTP Email Utility
 * Sends emails using Hostinger SMTP credentials from environment variables.
 * Fallback to Ethereal if credentials are not configured.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = Number(process.env.SMTP_PORT || 465) === 465; // true for 465, false for 587
    const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
    const pass = (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, '').trim();
    const fromEmail = process.env.FROM_EMAIL || `"Creators Kit" <${user || 'support@creatorskithub.com'}>`;

    let transporter;

    if (user && pass) {
      transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port,
        secure, // true for 465, false for 587
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      });
    } else {
      // Fallback for local testing without credentials
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: fromEmail,
      to,
      subject,
      text: text || 'Your Creators Kit verification code is provided in the HTML version of this email.',
      html,
      headers: {
        'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`[MAILER] OTP email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[MAILER_ERROR] Email dispatch error:', error.message);
    if (error.responseCode === 535) {
      console.error('  -> [SMTP Auth Error]: Incorrect SMTP user or password.');
    }
    throw new Error('Failed to send verification email. Please check your credentials and try again.');
  }
};
