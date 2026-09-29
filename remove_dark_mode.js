const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove all dark: classes (including things like dark:hover:bg-something, dark:text-something)
      // Matches "dark:" followed by word chars, dashes, slashes, square brackets, commas, percent, hashes, dots
      const orig = content;
      content = content.replace(/dark:[a-zA-Z0-9\-\/\[\]#\.,%:]+/g, '');
      
      // Clean up multiple spaces that might have been left behind
      content = content.replace(/ +/g, ' ');
      // Clean up spaces before closing quotes
      content = content.replace(/ \}/g, '}');
      content = content.replace(/ \"/g, '"');
      content = content.replace(/ \`/g, '`');

      if (orig !== content) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Removed all dark classes from all files.');
