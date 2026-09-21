const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const replacements = [
  // Glowing Shadows to Amber Gold and Cyan
  { regex: /rgba\(99,102,241,/g, replacement: 'rgba(245,158,11,' },
  { regex: /rgba\(6,182,212,/g, replacement: 'rgba(56,189,248,' },

  // Restore deep shadows for premium dark mode look
  { regex: /shadow-\[0_20px_40px_rgba\(0,0,0,0\.08\)\]/g, replacement: 'shadow-[0_30px_60px_rgba(0,0,0,0.5)]' },
  { regex: /shadow-\[0_15px_30px_rgba\(0,0,0,0\.06\)\]/g, replacement: 'shadow-[0_20px_40px_rgba(0,0,0,0.5)]' },
  { regex: /shadow-\[0_20px_50px_rgba\(0,0,0,0\.1\)\]/g, replacement: 'shadow-[0_20px_50px_rgba(255,255,255,0.05)]' },

  // Fix up buttons that might have text-neutral-50 to text-neutral-900 (because neutral-900 is #131C2E, meaning dark text on gold button)
  // Wait, if text-neutral-50 is #F8FAFC (white), then Gold buttons will have white text. Gold with white text has poor contrast.
  // We want Gold buttons to have dark text!
  { regex: /bg-primary text-white/g, replacement: 'bg-primary text-neutral-950' },
  { regex: /bg-primary text-neutral-50/g, replacement: 'bg-primary text-neutral-950' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log('Starting color replacement...');
processDirectory(srcDir);
console.log('Finished color replacement.');
