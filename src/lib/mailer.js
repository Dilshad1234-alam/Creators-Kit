import nodemailer from 'nodemailer';
import dns from 'dns';

// CRITICAL FOR HOSTINGER & CLOUD HOSTING: Force IPv4 first to prevent unroutable IPv6 timeout hangs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

/**
 * Resolves verified SMTP credentials for Hostinger mail service.
 * Crucial: Prevents misconfigured 'smtp.gmail.com' in server environment from breaking
 * authentication for Hostinger 'support@creatorskithub.com' accounts.
 */
function getResolvedSmtpConfig(targetPort = 465) {
  let host = (process.env.SMTP_HOST || '').replace(/^["']|["']$/g, '').trim();
  const user = (process.env.SMTP_USER || process.env.SMTP_EMAIL || 'support@creatorskithub.com').replace(/^["']|["']$/g, '').trim();
  const pass = (process.env.SMTP_PASS || 'CreatorsKitHub@2026').replace(/^["']|["']$/g, '').trim();

  if (!host || (host.includes('gmail') && !user.includes('gmail'))) {
    host = 'smtp.hostinger.com';
  }

  const port = targetPort || 465;
  const secure = port === 465;

  return { host, port, secure, user, pass };
}

/**
 * Creates a Nodemailer transporter for Hostinger SMTP
 */
function createTransporter(targetPort) {
  const config = getResolvedSmtpConfig(targetPort);

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
      servername: config.host,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Resilient Multi-Channel Email Utility
 * Strictly uses authenticated Hostinger SMTP (Port 465 SSL, Port 587 STARTTLS, and direct IP fallback)
 * to guarantee real inbox delivery.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const config = getResolvedSmtpConfig(465);
  const fromEmail = `"Creators Kit" <${config.user}>`;

  const mailOptions = {
    from: fromEmail,
    replyTo: config.user,
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

  // 1. Port 465 (Hostinger SSL direct - Primary)
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
    console.warn(`[MAILER] Port 587 failed (${fallbackErr.message}). Retrying direct IP...`);
    errors.push(`Port 587: ${fallbackErr.message}`);
  }

  // 3. Direct Hostinger Cloudflare Proxy IP with TLS SNI
  try {
    const tIp = nodemailer.createTransport({
      host: '172.65.255.143',
      port: 465,
      secure: true,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp.hostinger.com',
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
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
