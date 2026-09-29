const fs = require('fs');
const path = require('path');

const directoryPaths = [
  'd:\\Users\\mddil\\Desktop\\Zinmatt\\creators-kit\\src\\app',
  'd:\\Users\\mddil\\Desktop\\Zinmatt\\creators-kit\\src\\components'
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Global background replacements
      content = content.replace(/\bbg-white\b(?![\/-])/g, 'bg-[#FDFBF7]');
      
      // Global text replacements for headings and heavy text
      content = content.replace(/\btext-neutral-900\b/g, 'text-[#0F3826]');
      content = content.replace(/\btext-black\b/g, 'text-[#0F3826]');
      
      // Global replacement for neutral backgrounds that might clash
      content = content.replace(/\bbg-neutral-50\b/g, 'bg-[#F9F6EE]');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  });
}

directoryPaths.forEach(processDirectory);
console.log('Background and text colors updated across all components and pages.');
