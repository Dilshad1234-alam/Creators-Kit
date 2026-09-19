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

    // Use actual SMTP if configured
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } else {
      // Fallback to Ethereal for testing
      let testAccount = await nodemailer.createTestAccount();
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
      from: process.env.FROM_EMAIL || '"Creators Kit" <noreply@creatorskit.com>',
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    
    // Log preview URL for ethereal emails
    if (!process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    // Instead of completely crashing, we throw a controlled error that can be caught
    throw new Error('Failed to send email. Please try again later.');
  }
};
