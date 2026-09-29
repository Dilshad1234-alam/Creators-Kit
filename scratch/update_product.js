const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/app/product/page.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/bg-primary-hover/g, 'bg-[#700505]');
content = content.replace(/bg-primary/g, 'bg-[#900606]');
content = content.replace(/text-primary/g, 'text-[#900606]');
content = content.replace(/border-primary/g, 'border-[#900606]');
content = content.replace(/ring-primary/g, 'ring-[#900606]');
content = content.replace(/text-amber-400/g, 'text-[#900606]');

// mobile button text color: text-neutral-950 -> text-white
content = content.replace(/bg-\[#900606\] text-neutral-950/g, 'bg-[#900606] text-white');

// remove shadow-2xl glow
content = content.replace(/shadow-2xl shadow-neutral-950\/50/g, 'shadow-sm');
// remove hover drop shadows
content = content.replace(/hover:shadow-\[0_0_40px_rgba\(245,158,11,0\.2\)\] active:shadow-\[0_0_40px_rgba\(245,158,11,0\.2\)\]/g, '');
// remove inner drop shadows
content = content.replace(/drop-shadow-\[0_0_25px_rgba\(255,255,255,0\.15\)\]/g, '');
content = content.replace(/drop-shadow-\[0_0_8px_rgba\(255,255,255,0\.2\)\]/g, '');

// clean up radial gradients that make it look like a spotlight
content = content.replace(/bg-\[radial-gradient\(ellipse_at_center,_var\(--tw-gradient-stops\)\)\] from-neutral-700\/40 via-neutral-900\/80 to-background/g, 'bg-[#FDFBF7]');

// CTA shadow
content = content.replace(/shadow-xl shadow-#FF6B4A\/30/g, 'shadow-sm');

fs.writeFileSync(filePath, content);
console.log('Fixed product/page.js styling');
