const fs = require('fs');

let content = fs.readFileSync('src/components/HomeClient.js', 'utf8');

// Replace card classes
content = content.replace(/className=\"(.*?premium-glow-card.*?)\"/g, (match, p1) => {
  if (!p1.includes('dark:bg-slate-900')) {
    return 'className=\"' + p1 + ' bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800' + '\"';
  }
  return match;
});

content = content.replace(/className={\`(.*?premium-glow-card.*?)\`}/g, (match, p1) => {
  if (!p1.includes('dark:bg-slate-900')) {
    return 'className={\`' + p1 + ' bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800' + '\`}';
  }
  return match;
});

// Fix specific lines
content = content.replace(/bg-white dark:bg-zinc-900\/50/g, 'bg-white dark:bg-slate-900');
content = content.replace(/dark:border-zinc-800\/50/g, 'dark:border-slate-800');
content = content.replace(/dark:bg-zinc-900\/60/g, 'dark:bg-slate-900');
content = content.replace(/dark:bg-zinc-950\/40/g, 'dark:bg-slate-950/80');
content = content.replace(/dark:hover:bg-zinc-900\/60/g, 'dark:hover:bg-slate-900');
content = content.replace(/dark:border-zinc-800\/60/g, 'dark:border-slate-800');

// Text contrasts
content = content.replace(/dark:text-zinc-400/g, 'dark:text-slate-300');
content = content.replace(/dark:text-zinc-300/g, 'dark:text-slate-200');
content = content.replace(/dark:text-zinc-500/g, 'dark:text-slate-400');
content = content.replace(/dark:text-neutral-400/g, 'dark:text-slate-300');

fs.writeFileSync('src/components/HomeClient.js', content);

// Do the same for MasterclassCard.js
if (fs.existsSync('src/components/MasterclassCard.js')) {
  let mcContent = fs.readFileSync('src/components/MasterclassCard.js', 'utf8');
  mcContent = mcContent.replace(/className=\"(.*?premium-glow-card.*?)\"/g, (match, p1) => {
    if (!p1.includes('dark:bg-slate-900')) {
      return 'className=\"' + p1 + ' bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800' + '\"';
    }
    return match;
  });
  mcContent = mcContent.replace(/dark:text-neutral-400/g, 'dark:text-slate-300');
  fs.writeFileSync('src/components/MasterclassCard.js', mcContent);
}
