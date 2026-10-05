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
            className="px-6 py-3 bg-[#900606] text-white rounded-full font-bold hover:bg-black transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
