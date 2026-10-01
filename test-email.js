const fs = require('fs');
if (fs.existsSync('.env.local')) {
  const envConfig = fs.readFileSync('.env.local', 'utf8').split('\n');
  envConfig.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let key = match[1].trim();
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log("--- SMTP Configuration ---");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
  
  const pass = process.env.SMTP_PASS;
  console.log("SMTP_PASS is defined:", !!pass);
  console.log("SMTP_PASS length:", pass ? pass.length : 0);
  console.log("--------------------------");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS
    }
  });

  console.log("Testing connection...");
  try {
    await transporter.verify();
    console.log("✅ SMTP Connection Successful! Credentials are correct.");
  } catch (error) {
    console.error("❌ SMTP Connection Failed:", error.message);
    if (error.responseCode === 535) {
      console.error("  -> This is an Authentication Error. Check if your password is correct.");
      console.error("  -> If your password has special characters like # or @, make sure it is enclosed in quotes in .env.local.");
    }
  }
}

testEmail();
