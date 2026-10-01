const fs = require('fs');
const file = 'd:/Users/mddil/Desktop/Zinmatt/creators-kit/src/app/api/auth/forgot-password/route.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const message =[\s\S]*?`;/, `const message = \`
  <h1>Password Reset OTP</h1>
  <p>You requested a password reset. Your OTP is:</p>
  <h2 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">\${otpCode}</h2>
  <p>This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
\`;`);
content = content.replace(/Password Reset Request/g, 'Password Reset OTP');
content = content.replace(/resetPasswordToken/g, 'otpCode');
content = content.replace(/resetPasswordExpire/g, 'otpExpire');
fs.writeFileSync(file, content);
