const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src', 'app'),
  path.join(__dirname, 'src', 'components'),
];

const replaceRules = [
  { regex: /\bbg-zinc-950\b/g, replacement: 'bg-neutral-50 dark:bg-zinc-950' },
  { regex: /\bbg-zinc-900\b/g, replacement: 'bg-white dark:bg-zinc-900' },
  { regex: /\bbg-zinc-800\b/g, replacement: 'bg-neutral-100 dark:bg-zinc-800' },
  
  { regex: /\bborder-zinc-900\b/g, replacement: 'border-neutral-200 dark:border-zinc-900' },
  { regex: /\bborder-zinc-800\b/g, replacement: 'border-neutral-200 dark:border-zinc-800' },
  
  { regex: /\btext-zinc-400\b/g, replacement: 'text-neutral-600 dark:text-zinc-400' },
  { regex: /\btext-zinc-300\b/g, replacement: 'text-neutral-700 dark:text-zinc-300' },
  { regex: /\btext-zinc-200\b/g, replacement: 'text-neutral-800 dark:text-zinc-200' },
  { regex: /\btext-zinc-100\b/g, replacement: 'text-neutral-900 dark:text-zinc-100' }
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
        content = content.replace(regex, (match, offset, string) => {
          const before = string.substring(Math.max(0, offset - 10), offset);
          if (before.includes('dark:') || before.includes('white ')) {
            return match; 
          }
          return replacement;
        });
      });

      // Special case for bg-background
      content = content.replace(/\bbg-background\b/g, (match, offset, string) => {
        const before = string.substring(Math.max(0, offset - 10), offset);
        if (before.includes('dark:') || before.includes('white ')) return match;
        return 'bg-white dark:bg-background';
      });

      // Special case for text-white -> text-neutral-900 dark:text-white
      // ONLY if it's not in a button or link that uses primary colors
      content = content.replace(/className="([^"]*)\btext-white\b([^"]*)"/g, (match, before, after) => {
        if (before.includes('bg-primary') || after.includes('bg-primary') || before.includes('bg-green') || before.includes('dark:') || before.includes('bg-[#FF6B4A]') || before.includes('bg-gradient')) {
          return match;
        }
        return `className="${before}text-neutral-900 dark:text-white${after}"`;
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
