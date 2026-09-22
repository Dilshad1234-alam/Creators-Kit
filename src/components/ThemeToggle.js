'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-neutral-800 dark:border-neutral-700/50 bg-neutral-100 dark:bg-neutral-800/50"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-neutral-800 dark:border-neutral-700/50 hover:border-primary/50 bg-white dark:bg-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-neutral-600 dark:text-neutral-400 hover:text-primary focus:outline-none shadow-sm"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 transition-transform duration-300 transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 transform hover:-rotate-12" />
      )}
    </button>
  );
}
