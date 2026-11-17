import nodemailer from 'nodemailer';
import dns from 'dns';

// CRITICAL FOR HOSTINGER & CLOUD HOSTING: Force IPv4 first to prevent unroutable IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

/**
 * Creates a Nodemailer transporter for Hostinger SMTP
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
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Resilient Multi-Channel Email Utility
 * Attempts Hostinger Port 465 (SSL), Port 587 (TLS), Sendmail binary, and direct IP fallback.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const smtpUser = (process.env.SMTP_USER || process.env.SMTP_EMAIL || 'support@creatorskithub.com').replace(/^["']|["']$/g, '').trim();
  const smtpPass = (process.env.SMTP_PASS || 'CreatorsKitHub@2026').replace(/^["']|["']$/g, '').trim();
  const fromEmail = process.env.FROM_EMAIL || `Creators Kit <${smtpUser}>`;

  const mailOptions = {
    from: fromEmail,
    to,
    subject,
    text: text || 'Your notification is provided in the HTML version of this email.',
    html,
    headers: {
      'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    },
  };

  const errors = [];

  // 1. Port 465 (SSL direct)
  try {
    const transporter = createTransporter(465);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email successfully sent via port 465 to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, method: 'smtp_465' };
  } catch (primaryErr) {
    console.warn(`[MAILER] Primary port 465 failed (${primaryErr.message}). Retrying port 587...`);
    errors.push(`Port 465: ${primaryErr.message}`);
  }

  // 2. Port 587 (STARTTLS fallback)
  try {
    const fallbackTransporter = createTransporter(587);
    const info = await fallbackTransporter.sendMail(mailOptions);
    console.log(`[MAILER] Email successfully sent via fallback port 587 to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, method: 'smtp_587' };
  } catch (fallbackErr) {
    console.warn(`[MAILER] Port 587 failed (${fallbackErr.message}). Retrying sendmail...`);
    errors.push(`Port 587: ${fallbackErr.message}`);
  }

  // 3. Local /usr/sbin/sendmail binary
  try {
    const fs = await import('fs');
    if (fs.existsSync('/usr/sbin/sendmail')) {
      const sendmailTransporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail',
      });
      const info = await sendmailTransporter.sendMail(mailOptions);
      console.log(`[MAILER] Email successfully sent via /usr/sbin/sendmail to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId, method: 'sendmail' };
    }
  } catch (errSendmail) {
    console.warn(`[MAILER] Sendmail failed (${errSendmail.message}).`);
    errors.push(`sendmail: ${errSendmail.message}`);
  }

  // 4. Direct IP with TLS SNI
  try {
    const tIp = nodemailer.createTransport({
      host: '172.65.255.143',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp.hostinger.com',
      },
      connectionTimeout: 8000,
    });
    const info = await tIp.sendMail(mailOptions);
    console.log(`[MAILER] Email successfully sent via direct IP to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, method: 'direct_ip' };
  } catch (errIp) {
    errors.push(`direct_ip: ${errIp.message}`);
  }

  console.error('[MAILER_ERROR] Email delivery failed on all channels:', errors.join('; '));
  return { success: false, error: errors.join('; ') };
};
