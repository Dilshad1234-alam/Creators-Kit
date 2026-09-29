const fs = require('fs');
let code = fs.readFileSync('src/components/HomeClient.js', 'utf8');

// 1. Alternate section backgrounds below hero
const sections = [
  { text: "2. What's Inside", bg: "bg-[#FDFBF7]" },
  { text: "4. Benefits Section", bg: "bg-[#FDFBF7]" },
  { text: "7. Creator Workflow Timeline", bg: "bg-[#FDFBF7]" },
  { text: "9. Complete Bundle CTA", bg: "bg-[#FDFBF7]" }
];

sections.forEach(sec => {
  const index = code.indexOf(sec.text);
  if (index !== -1) {
    code = code.substring(0, index) + code.substring(index).replace(/bg-white/, sec.bg);
  }
});

// 2. Headings: text-neutral-900 dark:text-white -> text-emerald-900 dark:text-white
code = code.replace(/<h2([^>]*)text-neutral-900 dark:text-white/g, '<h2$1text-emerald-900 dark:text-white');
code = code.replace(/<h3([^>]*)text-neutral-900 dark:text-(white|zinc-100)/g, '<h3$1text-emerald-900 dark:text-$2');

// 3. Hero CTA buttons
code = code.replace(/bg-gradient-to-r from-primary to-primary-hover/g, 'bg-emerald-800 hover:bg-emerald-900');
code = code.replace(/bg-gradient-to-r from-primary to-\[#FF6B4A\]/g, 'bg-emerald-800 hover:bg-emerald-900');

// 4. Change text-primary to text-emerald-800 (for light mode) but leave dark classes alone if they exist
code = code.replace(/group-hover:text-primary/g, 'group-hover:text-emerald-800 dark:group-hover:text-primary');
code = code.replace(/text-primary/g, 'text-emerald-800 dark:text-primary');
code = code.replace(/border-primary/g, 'border-emerald-800 dark:border-primary');
code = code.replace(/bg-primary/g, 'bg-emerald-800 dark:bg-primary');

// Clean up double darks if any
code = code.replace(/dark:text-emerald-800 dark:text-primary/g, 'dark:text-primary');
code = code.replace(/dark:border-emerald-800 dark:border-primary/g, 'dark:border-primary');
code = code.replace(/dark:bg-emerald-800 dark:bg-primary/g, 'dark:bg-primary');

fs.writeFileSync('src/components/HomeClient.js', code);
