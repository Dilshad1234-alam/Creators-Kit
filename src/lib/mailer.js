import nodemailer from 'nodemailer';

/**
 * Robust Email Utility
 * Sends an email using SMTP credentials from environment variables.
 * Falls back to creating a dynamic Ethereal test account if credentials are not set.
 * Returns a success boolean or throws an error.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    let transporter;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
    const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
    const pass = (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, '').trim();
    const fromEmail = process.env.FROM_EMAIL || `"Creators Kit" <${user || 'support@creatorskithub.com'}>`;

    // Use actual SMTP if configured
    if (host && port && user && pass) {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587 or others
        auth: {
          user,
          pass,
        },
        // Timeout configuration to avoid hanging on slow network
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
    } else {
      // Fallback to Ethereal for testing
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

    const info = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });

    console.log(`[MAILER] Email successfully sent to ${to}: ${info.messageId}`);

    if (!host) {
      console.log('[MAILER] Ethereal Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[MAILER_ERROR] Email sending failed:', error.message);
    if (error.responseCode === 535) {
      console.error('  -> [SMTP Auth Error]: Check if your SMTP_USER or SMTP_PASS is correct.');
    }
    throw new Error('Failed to send verification email. Please try again later.');
  }
};
