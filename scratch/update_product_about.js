const fs = require('fs');

function updateProduct() {
  const file = 'src/app/product/page.js';
  let content = fs.readFileSync(file, 'utf8');

  // Replace useState, useEffect imports
  content = content.replace(/import { useState, useEffect} from 'react';/, `import { useState, useEffect } from 'react';`);
  
  // Replace useTheme
  content = content.replace(/const { theme, mounted } = useTheme\(\);/, `const { theme, mounted: themeMounted } = useTheme();\n  const [isDarkMode, setIsDarkMode] = useState(false);\n  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => {\n    setMounted(true);\n    const savedTheme = localStorage.getItem('creatorsKitTheme');\n    setIsDarkMode(savedTheme === 'dark');\n\n    const observer = new MutationObserver(() => {\n      setIsDarkMode(document.documentElement.classList.contains('dark'));\n    });\n    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });\n\n    return () => observer.disconnect();\n  }, []);\n\n  if (!mounted) return null;`);

  // Replace classes
  content = content.replace(/bg-\[#FDFBF7\] dark:bg-\[#0f172a\]/g, '${isDarkMode ? \'bg-[#0f172a]\' : \'bg-[#FDFBF7]\'}');
  content = content.replace(/bg-neutral-100 dark:bg-neutral-800/g, '${isDarkMode ? \'bg-neutral-800\' : \'bg-neutral-100\'}');
  content = content.replace(/text-neutral-600 dark:text-neutral-400 dark:text-neutral-500/g, '${isDarkMode ? \'text-neutral-400\' : \'text-neutral-600\'}');
  content = content.replace(/text-neutral-500 dark:text-neutral-400 dark:text-neutral-500/g, '${isDarkMode ? \'text-neutral-400\' : \'text-neutral-500\'}');
  content = content.replace(/text-neutral-700 dark:text-neutral-300/g, '${isDarkMode ? \'text-neutral-300\' : \'text-neutral-700\'}');

  // Line 146 is tricky:
  content = content.replace(/<div className="min-h-screen flex flex-col \$\{isDarkMode \? 'bg-\[#0f172a\]' : 'bg-\[#FDFBF7\]'\} text-\[#900606\] font-sans w-full">/, '<div className={`min-h-screen flex flex-col ${isDarkMode ? \'bg-[#0f172a] text-neutral-100\' : \'bg-[#FDFBF7] text-neutral-900\'} font-sans w-full`}>');
  
  // Other classNames that need to be template literals if they aren't already
  content = content.replace(/className="([^"]*\$\{isDarkMode[^"]*)"/g, 'className={`$1`}');

  fs.writeFileSync(file, content, 'utf8');
}

function updateAbout() {
  const file = 'src/app/about/page.js';
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes("'use client'")) {
    content = "'use client';\n" + content;
  }
  if (!content.includes("import { useState, useEffect }")) {
    content = content.replace(/import Image from 'next\/image';/, "import Image from 'next/image';\nimport { useState, useEffect } from 'react';");
  }

  content = content.replace(/const { theme, mounted } = useTheme\(\);[\s\S]*?if \(!mounted\) return null;/, `const { theme, mounted: themeMounted } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('creatorsKitTheme');
    setIsDarkMode(savedTheme === 'dark');

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;`);

  content = content.replace(/theme === 'dark'/g, 'isDarkMode');
  content = content.replace(/dark:text-neutral-300/g, '${isDarkMode ? \'text-neutral-300\' : \'text-neutral-700\'}');
  content = content.replace(/dark:text-neutral-400/g, '${isDarkMode ? \'text-neutral-400\' : \'text-neutral-600\'}');
  content = content.replace(/dark:bg-neutral-800/g, '${isDarkMode ? \'bg-neutral-800\' : \'bg-white\'}');

  fs.writeFileSync(file, content, 'utf8');
}

updateProduct();
updateAbout();
