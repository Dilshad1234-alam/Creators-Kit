const fs = require('fs');
const file = 'd:/Users/mddil/Desktop/Zinmatt/creators-kit/src/app/api/auth/register/route.js';
let content = fs.readFileSync(file, 'utf8');

const replacement = `} catch (emailErr) {
 console.error('Email error in register:', emailErr.message);
 console.log('--- OTP FOR TESTING (EMAIL FAILED) ---');
 console.log('OTP Code: ' + otp);
 console.log('--------------------------------------');
 return NextResponse.json(
 { message: 'Registration initiated, but email failed. Check terminal for OTP.', email: pendingUser.email },
 { status: 201 }
 );
}`;

content = content.replace(/catch\s*\(emailErr\)\s*\{[\s\S]*?\}\s*catch\s*\(error\)/, replacement + ' catch (error)');

fs.writeFileSync(file, content);
console.log("Updated");
