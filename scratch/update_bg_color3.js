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
      
      let changed = false;

      // Replace any leftover bg-white with bg-[#FAF7F0]
      if (content.includes('bg-white')) {
        // Exclude bg-white/10 etc.
        content = content.replace(/\bbg-white\b(?![\/-])/g, 'bg-[#FAF7F0]');
        changed = true;
      }
      
      // If it's layout.js, ensure body is bg-[#FDFBF7]
      if (fullPath.endsWith('layout.js')) {
        content = content.replace(/bg-\[\#FAF7F0\]/, 'bg-[#FDFBF7]'); // restore body if it matched
      } else {
        // For other files, if they got bg-[#FDFBF7] from the previous script, change it to bg-[#FAF7F0] for containers
        if (content.includes('bg-[#FDFBF7]')) {
          content = content.replace(/\bbg-\[\#FDFBF7\]\b/g, 'bg-[#FAF7F0]');
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}

directoryPaths.forEach(processDirectory);
console.log('Container backgrounds updated to bg-[#FAF7F0]');
