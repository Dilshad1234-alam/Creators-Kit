const fs = require('fs');

const path = 'd:\\Users\\mddil\\Desktop\\Zinmatt\\creators-kit\\src\\app\\layout.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /className=\{`\$\{geistSans\.variable\} \$\{geistMono\.variable\} h-full antialiased`\}/g,
  'className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden w-full max-w-[100vw]`}'
);

content = content.replace(
  /<body className="min-h-full flex flex-col bg-\[\#FDFBF7\] text-\[\#0F3826\] transition-colors duration-300" suppressHydrationWarning=\{true\}>/g,
  '<body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#0F3826] transition-colors duration-300 overflow-x-hidden w-full max-w-[100vw]" suppressHydrationWarning={true}>'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed scroll in layout.js');
