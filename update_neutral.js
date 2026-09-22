const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src', 'app', 'admin'),
  path.join(__dirname, 'src', 'components', 'admin'),
];

const replaceRules = [
  { regex: /\bbg-neutral-950(\/[0-9]+)?\b/g, replacement: (match) => `bg-white dark:${match}` },
  { regex: /\bbg-neutral-900(\/[0-9]+)?\b/g, replacement: (match) => `bg-white dark:${match}` },
  { regex: /\bbg-neutral-800(\/[0-9]+)?\b/g, replacement: (match) => `bg-neutral-100 dark:${match}` },
  
  { regex: /\bborder-neutral-900(\/[0-9]+)?\b/g, replacement: (match) => `border-neutral-200 dark:${match}` },
  { regex: /\bborder-neutral-800(\/[0-9]+)?\b/g, replacement: (match) => `border-neutral-200 dark:${match}` },
  
  { regex: /\btext-neutral-100\b/g, replacement: 'text-neutral-900 dark:text-neutral-100' },
  { regex: /\btext-neutral-200\b/g, replacement: 'text-neutral-800 dark:text-neutral-200' },
  { regex: /\btext-neutral-300\b/g, replacement: 'text-neutral-700 dark:text-neutral-300' },
  { regex: /\btext-neutral-400\b/g, replacement: 'text-neutral-600 dark:text-neutral-400' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') && !fullPath.includes('ThemeProvider.js') && !fullPath.includes('ThemeToggle.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let originalContent = content;
      
      replaceRules.forEach(({ regex, replacement }) => {
        content = content.replace(regex, (...args) => {
          const string = args[args.length - 1];
          const offset = args[args.length - 2];
          const match = args[0];
          const before = string.substring(Math.max(0, offset - 10), offset);
          
          if (before.includes('dark:') || before.includes('white ')) {
            return match; 
          }
          if (typeof replacement === 'function') {
             return replacement(match);
          }
          return replacement;
        });
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach(processDir);
console.log('Done');
