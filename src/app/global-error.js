'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // In production, this is where you'd send the error to Sentry, LogRocket, or a custom logging service.
    console.error('CRITICAL UNCAUGHT ERROR:', error);
    
    // Example: fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ message: error.message, stack: error.stack }) });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-[100svh] flex flex-col items-center justify-center bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#900606] dark:text-white px-4 text-center font-sans">
          <h2 className="text-3xl font-black mb-4">A critical error occurred!</h2>
          <p className="mb-8 text-neutral-600 dark:text-neutral-400">Our team has been notified. Please try refreshing.</p>
          <button
        onClick={() => reset()}
        className="relative px-8 py-3.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm inline-flex items-center justify-center cursor-pointer"
      >
        <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
        <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
          Try again
        </span>
      </button>
        </div>
      </body>
    </html>
  );
}
