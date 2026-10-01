const fs = require('fs');
const file = 'd:/Users/mddil/Desktop/Zinmatt/creators-kit/src/app/api/auth/resend-otp/route.js';
let content = fs.readFileSync(file, 'utf8');

const replacement = `} catch (emailErr) {
  console.error('Email error in resend-otp:', emailErr.message);
  console.log('--- NEW OTP FOR TESTING (EMAIL FAILED) ---');
  console.log('OTP Code: ' + otp);
  console.log('------------------------------------------');
  return NextResponse.json({ message: 'A new OTP has been generated (check terminal due to email failure).' }, { status: 200 });
 }
} catch (error) {`;

content = content.replace(/catch\s*\(emailErr\)\s*\{[\s\S]*?\}\s*catch\s*\(error\)\s*\{/, replacement);

fs.writeFileSync(file, content);
console.log("Updated resend-otp");
