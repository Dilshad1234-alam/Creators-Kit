const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\Users\\mddil\\Desktop\\Zinmatt\\creators-kit\\src';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove the premium-glow-card class safely
      if (content.includes('premium-glow-card')) {
        content = content.replace(/\bpremium-glow-card\b/g, '');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}
processDirectory(srcDir);
console.log('Safely removed premium-glow-card across the project.');
