const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const targetDir = path.resolve(__dirname, '../src');

walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace primary tailwind classes
    content = content.replace(/bg-primary-hover/g, 'bg-[#700505]');
    content = content.replace(/bg-primary/g, 'bg-[#900606]');
    content = content.replace(/text-primary/g, 'text-[#900606]');
    content = content.replace(/border-primary/g, 'border-[#900606]');
    content = content.replace(/ring-primary/g, 'ring-[#900606]');
    
    // Replace amber classes (yellow/gold)
    content = content.replace(/text-amber-300/g, 'text-[#900606]');
    content = content.replace(/text-amber-400/g, 'text-[#900606]');
    content = content.replace(/text-amber-500/g, 'text-[#900606]');
    content = content.replace(/text-amber-600/g, 'text-[#900606]');
    content = content.replace(/bg-amber-400/g, 'bg-[#900606]');
    content = content.replace(/bg-amber-500/g, 'bg-[#900606]');
    content = content.replace(/border-amber-400/g, 'border-[#900606]');
    content = content.replace(/border-amber-500/g, 'border-[#900606]');
    
    // Some buttons had text-neutral-950 on yellow background. We want them text-white on maroon background.
    content = content.replace(/bg-\[#900606\] text-neutral-950/g, 'bg-[#900606] text-white');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + path.relative(targetDir, filePath));
    }
  }
});

console.log('Global yellow/primary elimination complete!');
