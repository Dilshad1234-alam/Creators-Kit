const fs = require('fs');

const path = 'd:\\Users\\mddil\\Desktop\\Zinmatt\\creators-kit\\src\\components\\HomeClient.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Hero Section Wrapper
content = content.replace(
  /<section className="relative w-full pt-8 md:pt-12 pb-4 overflow-hidden bg-white">/,
  '<section className="relative w-full pt-16 md:pt-24 pb-24 md:pb-32 overflow-hidden bg-[#0F3826]">'
);

// 2. Badge
content = content.replace(
  /bg-\[#FF6B4A\]\/10 text-\[#FF6B4A\] text-sm font-bold mb-8 border border-\[#FF6B4A\]\/20/g,
  'bg-amber-500/10 text-amber-400 text-sm font-bold mb-8 border border-amber-500/20'
);
content = content.replace(
  /<span className="flex h-2 w-2 rounded-full bg-emerald-800 animate-pulse"><\/span>/,
  '<span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>'
);

// 3. Heading
content = content.replace(
  /text-4xl md:text-6xl font-extrabold mb-4 leading-snug tracking-tight drop-shadow-lg/g,
  'text-4xl md:text-6xl font-extrabold mb-4 leading-snug tracking-tight text-white drop-shadow-lg'
);
content = content.replace(
  /text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light/g,
  'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200'
);

// 4. Description
content = content.replace(
  /text-base md:text-lg text-neutral-600 mb-8 leading-snug font-medium/g,
  'text-base md:text-lg text-emerald-50/90 mb-10 leading-relaxed font-medium'
);

// 5. Buttons
content = content.replace(
  /bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-extrabold text-lg hover:shadow-\[0_0_40px_rgba\(255,110,64,0\.5\)\] transition-all/g,
  'bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-full font-extrabold text-lg shadow-lg hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all'
);
content = content.replace(
  /bg-white text-neutral-700 border-2 border-neutral-200 rounded-full font-bold text-lg hover:border-secondary hover:text-secondary transition-colors shadow-sm/g,
  'bg-transparent text-white border-2 border-white/30 rounded-full font-bold text-lg hover:border-white/60 hover:bg-white/10 transition-colors shadow-sm'
);

// 6. Interactive Controls wrapper
content = content.replace(
  /mt-6 bg-white p-1\.5 sm:p-2 rounded-full border border-neutral-200 shadow-\[0_10px_30px_rgba\(0,0,0,0\.5\)\] backdrop-blur-md/g,
  'mt-6 bg-[#0B2A1C]/80 p-1.5 sm:p-2 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md'
);

// 7. White Light Button
content = content.replace(
  /bg-neutral-800 text-white shadow-\[0_0_15px_rgba\(255,255,255,0\.2\)\] border-neutral-600/g,
  'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border-white/30'
);
content = content.replace(
  /bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-transparent/g,
  'bg-transparent text-emerald-100/70 hover:text-white hover:bg-white/10 border-transparent'
);

// 8. Warm Light Button
content = content.replace(
  /bg-neutral-800 text-emerald-800 shadow-\[0_0_15px_rgba\(245,158,11,0\.2\)\] border-emerald-800/g,
  'bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] border-amber-500/30'
);
content = content.replace(
  /bg-transparent text-neutral-600 hover:text-emerald-800 hover:bg-neutral-100 border-transparent/g,
  'bg-transparent text-emerald-100/70 hover:text-amber-400 hover:bg-white/10 border-transparent'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete');
