const fs = require('fs');
const path = require('path');

const files = [
  path.resolve(__dirname, '../src/components/HomeClient.js'),
  path.resolve(__dirname, '../src/app/product/page.js')
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to remove shadow and border classes
  // We want to remove: border, border-*, shadow, shadow-*
  
  // Actually, it's safer to target specific container classes, or just remove border/shadow broadly:
  // e.g., ` border border-neutral-200` -> ``
  // ` shadow-sm` -> ``
  // ` shadow-md` -> ``
  // ` shadow-[...]` -> ``
  // ` dark:border-zinc-800/50` -> ``
  // ` dark:border-zinc-900` -> ``
  
  content = content.replace(/ border border-neutral-200/g, '');
  content = content.replace(/ border border-neutral-100/g, '');
  content = content.replace(/ border-neutral-200/g, '');
  content = content.replace(/ shadow-sm/g, '');
  content = content.replace(/ shadow-md/g, '');
  content = content.replace(/ shadow-lg/g, '');
  content = content.replace(/ shadow-xl/g, '');
  content = content.replace(/ shadow-2xl/g, '');
  content = content.replace(/ dark:border-zinc-900/g, '');
  content = content.replace(/ dark:border-zinc-800\/50/g, '');
  content = content.replace(/ dark:border-zinc-800/g, '');
  
  // Custom shadows in product/page.js
  content = content.replace(/ shadow-\[[^\]]+\]/g, '');
  
  // Custom border classes
  content = content.replace(/ border-\[8px\] border-white/g, '');
  content = content.replace(/ border-t /g, ' '); // Though they want border removed from containers, maybe border-t is for section dividers. The prompt says "card containers".
  // I will leave border-t if it's just a section divider. Wait, they said "making them flat against the light cream background". A border-t on a section is fine.
  
  // Specific kit components border removal
  content = content.replace(/border border-neutral-200/g, '');
  content = content.replace(/border-neutral-200/g, '');
  content = content.replace(/border-neutral-100/g, '');
  content = content.replace(/shadow-sm/g, '');
  content = content.replace(/shadow-md/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed styling in ' + path.basename(filePath));
});
