import nodemailer from 'nodemailer';
import dns from 'dns';

// CRITICAL FOR HOSTINGER & CLOUD HOSTING: Force IPv4 first to prevent unroutable IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

/**
 * Creates a Nodemailer transporter with IPv4 and relaxed TLS for Hostinger SMTP
 */
function createTransporter(targetPort) {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = targetPort || Number(process.env.SMTP_PORT) || 587;
  const secure = port === 465;
  const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, '').trim();

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    family: 4, // Force IPv4 connection to avoid Hostinger Docker container IPv6 network drops
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Resilient Hostinger SMTP Email Utility with Automatic Dual-Port Failover (587 <-> 465)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const configuredPort = Number(process.env.SMTP_PORT) || 587;
  const alternativePort = configuredPort === 465 ? 587 : 465;
  const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || '').replace(/^["']|["']$/g, '').trim();
  const fromEmail = process.env.FROM_EMAIL || `"Creators Kit" <${user || 'support@creatorskithub.com'}>`;

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

  // Attempt 1: Try configured port
  try {
    const transporter = createTransporter(configuredPort);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email successfully sent via port ${configuredPort} to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (primaryErr) {
    console.warn(`[MAILER] Primary delivery via port ${configuredPort} failed (${primaryErr.message}). Retrying via alternative port ${alternativePort}...`);
    // Attempt 2: Failover to alternative port
    try {
      const fallbackTransporter = createTransporter(alternativePort);
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[MAILER] Email successfully sent via fallback port ${alternativePort} to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (fallbackErr) {
      console.error(`[MAILER_ERROR] Email delivery failed on both ports (${configuredPort} & ${alternativePort}):`, fallbackErr.message);
      throw new Error('Failed to send verification email. Please check your connection and try again.');
    }
  }
};
