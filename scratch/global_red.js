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

    // Replace all green color codes and tailwind green classes
    content = content.replace(/#0F3826/ig, '#900606');
    content = content.replace(/emerald-900/ig, '[#900606]');
    content = content.replace(/emerald-800/ig, '[#900606]');
    content = content.replace(/green-900/ig, '[#900606]');
    content = content.replace(/green-800/ig, '[#900606]');
    
    // Some classes might become bg-[#900606] text-[#900606] etc. That's fine.

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + path.relative(targetDir, filePath));
    }
  }
});

console.log('Global green elimination complete!');
