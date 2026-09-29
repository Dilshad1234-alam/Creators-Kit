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

      // Replace hero background specific color
      if (content.includes('bg-[#0F3826]')) {
        content = content.replace(/\bbg-\[\#0F3826\]\b/g, 'bg-[#900606]');
        changed = true;
      }

      // Replace emerald-900 and emerald-950 backgrounds
      if (content.includes('bg-emerald-900')) {
        content = content.replace(/\bbg-emerald-900\b/g, 'bg-[#900606]');
        changed = true;
      }
      
      if (content.includes('bg-emerald-950')) {
        content = content.replace(/\bbg-emerald-950\b/g, 'bg-[#900606]');
        changed = true;
      }
      
      // Replace interactive control panel background
      if (content.includes('bg-[#0B2A1C]')) {
        content = content.replace(/bg-\[\#0B2A1C\]/g, 'bg-[#900606]');
        changed = true;
      }

      // Replace generic dark slate/black backgrounds
      if (content.includes('bg-neutral-900')) {
        content = content.replace(/\bbg-neutral-900\b/g, 'bg-[#900606]');
        changed = true;
      }
      
      if (content.includes('bg-neutral-950')) {
        content = content.replace(/\bbg-neutral-950\b/g, 'bg-[#900606]');
        changed = true;
      }
      
      if (content.includes('bg-black')) {
        content = content.replace(/\bbg-black\b/g, 'bg-[#900606]');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}

directoryPaths.forEach(processDirectory);
console.log('Dark backgrounds updated to #900606');
