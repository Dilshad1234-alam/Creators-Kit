import nodemailer from 'nodemailer';

/**
 * Robust Email Utility
 * Sends an email using SMTP credentials from environment variables.
 * Falls back to creating a dynamic Ethereal test account if credentials are not set.
 * Returns a success boolean or throws an error.
 */
export const sendEmail = async ({ to, subject, html}) => {
 try {
    let transporter;

    // Use actual SMTP if configured
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
        transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true for 465, false for other ports
        auth: {
        user: process.env.SMTP_USER || process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
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
        from: process.env.FROM_EMAIL || '"Creators Kit" <support@creatorskithub.com>',
        to,
        subject,
        html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
 
    // Log preview URL for ethereal emails
    if (!process.env.SMTP_HOST) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId};
    } catch (error) {
        console.error('Email sending failed:', error.message);
        if (error.responseCode === 535) {
            console.error("  -> [SMTP Auth Error]: Check if your SMTP_USER or SMTP_PASS is correct.");
            console.error("  -> If your password has special characters, enclose it in quotes in .env.local.");
        }
    // Instead of completely crashing, we throw a controlled error that can be caught
        throw new Error('Failed to send email. Please try again later.');
    }
};
