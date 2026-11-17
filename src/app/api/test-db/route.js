import { NextResponse } from 'next/server';
import '@/lib/loadEnv';
import dbConnect from '@/lib/mongodb';
import fs from 'fs';
import dns from 'dns';
import net from 'net';
import nodemailer from 'nodemailer';

export async function GET(request) {
  const diagnostic = {};
  const { searchParams } = new URL(request.url);
  const testEmailTarget = searchParams.get('test_email');

  try {
    await dbConnect();
    diagnostic.db = 'connected';
  } catch (err) {
    diagnostic.db = err.message;
  }

  // 1. Environment variables check
  diagnostic.env = {
    SMTP_HOST: process.env.SMTP_HOST || 'not set (using fallback: smtp.hostinger.com)',
    SMTP_PORT: process.env.SMTP_PORT || 'not set',
    SMTP_USER: process.env.SMTP_USER || 'not set',
    has_SMTP_PASS: !!process.env.SMTP_PASS,
    NODE_ENV: process.env.NODE_ENV,
  };

  // 2. DNS check for smtp.hostinger.com
  try {
    diagnostic.dns_ipv4 = await dns.promises.resolve4('smtp.hostinger.com').catch(e => `ERR: ${e.message}`);
  } catch (e) {
    diagnostic.dns_ipv4 = `ERR: ${e.message}`;
  }

  // 3. TCP socket checks
  const testTcp = (host, port, timeout = 4000) => {
    return new Promise((resolve) => {
      const s = net.createConnection({ host, port, timeout });
      s.on('connect', () => { s.destroy(); resolve('CONNECTED'); });
      s.on('timeout', () => { s.destroy(); resolve('TIMEOUT'); });
      s.on('error', (err) => resolve(`ERR: ${err.message}`));
    });
  };

  diagnostic.tcp_465 = await testTcp('smtp.hostinger.com', 465);
  diagnostic.tcp_587 = await testTcp('smtp.hostinger.com', 587);

  // 4. Sendmail binary check
  diagnostic.has_sendmail = fs.existsSync('/usr/sbin/sendmail');

  // 5. Test nodemailer verify on port 465
  try {
    const t465 = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: (process.env.SMTP_USER || 'support@creatorskithub.com').trim(),
        pass: (process.env.SMTP_PASS || 'CreatorsKitHub@2026').trim(),
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
    });
    diagnostic.verify_465 = await t465.verify().then(() => 'SUCCESS').catch(e => `ERR: ${e.message} (code: ${e.code})`);
  } catch (e) {
    diagnostic.verify_465 = `ERR: ${e.message}`;
  }

  // 6. Test nodemailer verify on port 587
  try {
    const t587 = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: (process.env.SMTP_USER || 'support@creatorskithub.com').trim(),
        pass: (process.env.SMTP_PASS || 'CreatorsKitHub@2026').trim(),
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
    });
    diagnostic.verify_587 = await t587.verify().then(() => 'SUCCESS').catch(e => `ERR: ${e.message} (code: ${e.code})`);
  } catch (e) {
    diagnostic.verify_587 = `ERR: ${e.message}`;
  }

  // 7. Optional live email test dispatch
  if (testEmailTarget) {
    try {
      const liveTransporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
          user: (process.env.SMTP_USER || 'support@creatorskithub.com').trim(),
          pass: (process.env.SMTP_PASS || 'CreatorsKitHub@2026').trim(),
        },
        tls: { rejectUnauthorized: false, servername: 'smtp.hostinger.com' },
        connectionTimeout: 10000,
      });

      const info = await liveTransporter.sendMail({
        from: '"Creators Kit" <support@creatorskithub.com>',
        replyTo: 'support@creatorskithub.com',
        to: testEmailTarget,
        subject: 'Creators Kit Live SMTP Test',
        text: `Live test email dispatched successfully to ${testEmailTarget}.`,
        html: `<b>Live test email dispatched successfully to ${testEmailTarget}.</b>`,
      });

      diagnostic.test_send = {
        status: 'SUCCESS',
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
      };
    } catch (err) {
      diagnostic.test_send = {
        status: 'ERROR',
        error: err.message,
      };
    }
  }

  return NextResponse.json(diagnostic);
}
