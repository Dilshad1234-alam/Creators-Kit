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
      
      // Remove the premium-glow-card class completely
      if (content.includes('premium-glow-card')) {
        content = content.replace(/\bpremium-glow-card\b/g, '');
        // Clean up any double spaces or leading spaces in classNames
        content = content.replace(/className="\s+/g, 'className="');
        content = content.replace(/\s+"/g, '"');
        content = content.replace(/\s{2,}/g, ' ');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}

// Remove the CSS from globals.css
const globalsCssPath = path.join(srcDir, 'app', 'globals.css');
let cssContent = fs.readFileSync(globalsCssPath, 'utf8');
cssContent = cssContent.replace(/\.premium-glow-card[\s\S]*?(?=\n\n|\z)/g, '');
// Specifically remove the whole block from @layer components if it matches
cssContent = cssContent.replace(/@layer components\s*\{[\s\S]*?premium-glow-card[\s\S]*?\}\s*\}/g, '');
fs.writeFileSync(globalsCssPath, cssContent, 'utf8');

processDirectory(srcDir);
console.log('Removed premium-glow-card across the project.');
