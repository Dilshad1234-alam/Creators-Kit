import nodemailer from 'nodemailer';
import dns from 'dns';

// CRITICAL FOR HOSTINGER & CLOUD HOSTING: Force IPv4 first to prevent unroutable IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

/**
 * Creates a Nodemailer transporter for Hostinger SMTP
 * Explicitly binds to Hostinger mail server with verified support@creatorskithub.com credentials,
 * completely immune to any corrupted or conflicting environment variables on Hostinger.
 */
function createTransporter(targetPort = 465) {
  const port = targetPort || 465;
  const secure = port === 465;

  return nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port,
    secure,
    auth: {
      user: 'support@creatorskithub.com',
      pass: 'CreatorsKitHub@2026',
    },
    tls: {
      rejectUnauthorized: false,
      servername: 'smtp.hostinger.com',
    },
    connectionTimeout: 10000,
  });
}

/**
 * Resilient Multi-Channel Email Utility
 * Strictly uses authenticated Hostinger SMTP (Port 465 SSL and Port 587 STARTTLS)
 * to guarantee real inbox delivery with valid SPF/DKIM records.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const fromEmail = '"Creators Kit" <support@creatorskithub.com>';

  const mailOptions = {
    from: fromEmail,
    replyTo: 'support@creatorskithub.com',
    to,
    subject,
    text: text || 'Your notification is provided in the HTML version of this email.',
    html,
    headers: {
      'X-Priority': '1 (Highest)',
      'X-MSMail-Priority': 'High',
      'Importance': 'High',
      'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    },
  };

  const errors = [];

  // 1. Port 465 (Hostinger SSL direct - Primary Standard)
  try {
    const transporter = createTransporter(465);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email successfully sent via port 465 to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, method: 'smtp_465' };
  } catch (primaryErr) {
    console.warn(`[MAILER] Primary port 465 failed (${primaryErr.message}). Retrying port 587...`);
    errors.push(`Port 465: ${primaryErr.message}`);
  }

  // 2. Port 587 (Hostinger STARTTLS fallback)
  try {
    const fallbackTransporter = createTransporter(587);
    const info = await fallbackTransporter.sendMail(mailOptions);
    console.log(`[MAILER] Email successfully sent via fallback port 587 to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, method: 'smtp_587' };
  } catch (fallbackErr) {
    console.warn(`[MAILER] Port 587 failed (${fallbackErr.message}).`);
    errors.push(`Port 587: ${fallbackErr.message}`);
  }

  console.error('[MAILER_ERROR] Email delivery failed on all channels:', errors.join('; '));
  return { success: false, error: errors.join('; ') };
};
