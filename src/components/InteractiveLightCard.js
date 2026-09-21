'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function InteractiveLightCard({ imageSrc, altText = "Product Image", priority = false, className = "" }) {
  const [lightMode, setLightMode] = useState('white'); // 'white', 'warm', 'off'

  return (
    <div className={`premium-glow-card flex flex-col items-center justify-between p-4 sm:p-6 rounded-[2.5rem] w-full bg-neutral-900/40 border border-neutral-800/50 ${className}`}>
      {/* Product Image Area */}
      <div className={`relative w-full h-[250px] sm:h-[300px] lg:h-[350px] flex justify-center items-center transition-all duration-700 ease-in-out will-change-transform transform-gpu ${
        lightMode === 'white' 
          ? 'drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] brightness-110'
          : lightMode === 'warm'
          ? 'drop-shadow-[0_0_40px_rgba(245,158,11,0.3)] sepia-[0.3] hue-rotate-[-10deg]'
          : 'brightness-50 grayscale-[0.5] drop-shadow-none'
      }`}>
        <Image 
          src={imageSrc} 
          alt={altText}
          fill
          className="object-contain transform transition-all duration-500 ease-in-out will-change-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 w-full relative z-10">
        <button 
          onClick={() => setLightMode('white')}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex-1 min-w-[100px] ${
            lightMode === 'white' 
              ? 'bg-neutral-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-neutral-600' 
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 border border-transparent bg-neutral-950/50'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0"></div>
          White Light
        </button>
        
        <button 
          onClick={() => setLightMode('warm')}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex-1 min-w-[100px] ${
            lightMode === 'warm' 
              ? 'bg-neutral-800 text-primary shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-primary/50' 
              : 'text-neutral-400 hover:text-primary hover:bg-neutral-800/50 border border-transparent bg-neutral-950/50'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0"></div>
          Warm Light
        </button>
        
        <button 
          onClick={() => setLightMode(lightMode === 'off' ? 'white' : 'off')}
          className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full transition-all duration-300 ${
            lightMode === 'off'
              ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20'
              : 'bg-neutral-900/80 text-neutral-300 border border-neutral-800 hover:bg-neutral-700'
          }`}
          title="Toggle Power"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
