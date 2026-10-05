'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#900606] dark:text-white px-4 text-center">
      <h2 className="text-3xl font-black mb-4">Something went wrong!</h2>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">We apologize for the inconvenience.</p>
      <button onClick={() => reset()} className="px-6 py-3 bg-[#900606] text-white rounded-full font-bold hover:bg-black transition-colors">
        Try again
      </button>
    </div>
  );
}