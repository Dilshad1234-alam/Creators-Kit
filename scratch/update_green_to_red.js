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
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let originalContent = content;

      // Replace #0F3826 with #900606
      content = content.replace(/#0F3826/g, '#900606');

      // Replace emerald-500 through emerald-950 with [#900606]
      content = content.replace(/\b(bg|text|border|ring|shadow|from|to|via)-emerald-[56789]00\b/g, '$1-[#900606]');
      content = content.replace(/\b(bg|text|border|ring|shadow|from|to|via)-emerald-950\b/g, '$1-[#900606]');
      
      // Replace green-500 through green-950 with [#900606]
      content = content.replace(/\b(bg|text|border|ring|shadow|from|to|via)-green-[56789]00\b/g, '$1-[#900606]');
      content = content.replace(/\b(bg|text|border|ring|shadow|from|to|via)-green-950\b/g, '$1-[#900606]');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  });
}

directoryPaths.forEach(processDirectory);
console.log('All green brand colors successfully replaced with #900606');
