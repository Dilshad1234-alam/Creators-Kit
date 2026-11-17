import nodemailer from 'nodemailer';
import dns from 'dns';

// CRITICAL FOR HOSTINGER & CLOUD HOSTING: Force IPv4 first to prevent unroutable IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

/**
 * Creates a Nodemailer transporter with IPv4 and relaxed TLS for Hostinger SMTP
 * Defaults to Port 465 (Direct SSL) with 4s fast timeouts.
 */
function createTransporter(targetPort) {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = targetPort || 465;
  const secure = port === 465;
  const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || 'support@creatorskithub.com').replace(/^["']|["']$/g, '').trim();
  const pass = (process.env.SMTP_PASS || 'CreatorsKitHub@2026').replace(/^["']|["']$/g, '').trim();

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
      minVersion: 'TLSv1.2',
    },
    family: 4, // Force IPv4 connection to avoid Hostinger Docker container IPv6 network drops
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 6000,
  });
}

/**
 * Resilient Hostinger SMTP Email Utility with Automatic Dual-Port Failover (465 SSL <-> 587 STARTTLS)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const primaryPort = 465;
  const secondaryPort = 587;
  const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || 'support@creatorskithub.com').replace(/^["']|["']$/g, '').trim();
  const fromEmail = process.env.FROM_EMAIL || `Creators Kit <${user}>`;

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

  // Attempt 1: Port 465 (SSL direct)
  try {
    const transporter = createTransporter(primaryPort);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email successfully sent via port ${primaryPort} to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, port: primaryPort };
  } catch (primaryErr) {
    console.warn(`[MAILER] Primary delivery via port ${primaryPort} failed (${primaryErr.message}). Retrying via port ${secondaryPort}...`);
    // Attempt 2: Port 587 (STARTTLS fallback)
    try {
      const fallbackTransporter = createTransporter(secondaryPort);
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[MAILER] Email successfully sent via fallback port ${secondaryPort} to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId, port: secondaryPort };
    } catch (fallbackErr) {
      console.error(`[MAILER_ERROR] Email delivery failed on both ports (465 & 587):`, fallbackErr.message);
      return { success: false, error: fallbackErr.message };
    }
  }
};
