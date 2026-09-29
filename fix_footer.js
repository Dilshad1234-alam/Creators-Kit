const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.js', 'utf8');

// Container
content = content.replace(/bg-\[#1A3B2A\]/g, 'bg-slate-950');
content = content.replace(/border-t-4 border-yellow-500/g, 'border-t border-neutral-200 dark:border-slate-800');

// Typography
content = content.replace(/text-green-50/g, 'text-slate-400');
content = content.replace(/hover:text-yellow-500/g, 'hover:text-primary');
content = content.replace(/text-\[#1A3B2A\]/g, 'text-neutral-900 dark:text-white');

// Social icons hover
content = content.replace(/hover:bg-yellow-500 hover:text-\[#1A3B2A\]/g, 'hover:bg-primary hover:text-white');

// Bottom bar
content = content.replace(/bg-\[#F59E0B\] text-\[#1A3B2A\]/g, 'bg-slate-900 text-slate-400 border-t border-slate-800');

fs.writeFileSync('src/components/Footer.js', content);
