const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\Users\\mddil\\Desktop\\Zinmatt\\creators-kit\\src';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace all red #900606 back to forest green #0F3826
      if (content.includes('#900606')) {
        content = content.replace(/#900606/g, '#0F3826');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}

processDirectory(srcDir);
console.log('Reverted red back to forest green.');
