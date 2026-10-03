'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { getImageUrl } from '@/lib/imagekit';

export default function AboutPage() {
  const { theme, mounted: themeMounted } = useTheme();
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

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B0F19] text-neutral-100' : 'bg-[#FDFBF7] text-neutral-900'} w-full font-sans overflow-hidden pb-16 md:pb-24`}>
      
      {/* Editorial Header Section */}
      <section className="pt-24 md:pt-48 px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto">
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-[#900606] tracking-tighter uppercase mb-12 border-b-[6px] border-[#900606] pb-6 leading-none">
          About Us.
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-24 lg:mb-32">
          <div className="md:col-span-5 lg:col-span-6">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[#900606]">
              We are a creative collective obsessed with designing the perfect environment for content creation. Our tools empower thousands of creators worldwide.
            </p>
          </div>
          <div className="md:col-span-7 lg:col-span-6 text-lg md:text-xl text-neutral-900 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-900'} leading-relaxed columns-1 sm:columns-2 gap-8 md:gap-12">
            <p className="mb-6">
              Founded on the belief that gear should get out of your way, Creators Kit simplifies the entire process. From lighting to audio, we curate the definitive tools for modern storytelling.
            </p>
            <p>
              It's not just about the hardware; it's about the ecosystem. When everything works together seamlessly, your creativity flows uninterrupted.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Imagery & Pull Quote */}
      <section className="px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto mb-20 lg:mb-32">
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 lg:mb-24 shadow-xl group bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={getImageUrl("/team.png")} 
            alt="Team Photograph" 
            className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle even overlay to remove harsh streaks while keeping the photo clearly visible */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-700 group-hover:bg-black/10"></div>

        </div>
        
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-[#900606] leading-tight italic tracking-tight">
            "Our work does make sense only if it is a faithful witness of his time."
          </h2>
        </div>
      </section>

      {/* The Team Section */}
      <section className="px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto mb-20 lg:mb-32">
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-[#900606] tracking-tighter uppercase mb-12 md:mb-16 border-b-2 border-[#900606]/30 pb-4">
          The Team.
        </h2>
        
        <div className="mb-12 max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#900606] tracking-tight">
            Crafting the Standard
          </h3>
          <p className="text-lg md:text-xl text-neutral-900 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-900'} leading-relaxed mb-4">
            Our team consists of industry veterans, product designers, and passionate creators. We've spent thousands of hours analyzing what makes a successful studio setup and distilled it into a single, cohesive kit.
          </p>
          <p className="text-lg md:text-xl text-neutral-900 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-900'} leading-relaxed font-medium">
            Every curve, every material, and every piece of software is designed with exact purpose.
          </p>
        </div>
        
        <div className={`w-full ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-[#FDFBF7] border-[#900606]/10'} rounded-[2rem] p-8 md:p-12 mb-24 lg:mb-32 flex flex-wrap justify-center items-start gap-6 md:gap-12 lg:gap-16 border shadow-sm`}>
          {[
            { src: '/zin.png', name: 'Ring Light' },
            { src: '/zin1.png', name: 'Wireless Microphone' },
            { src: '/zin2.png', name: 'Camera/Phone Tripod' },
            { src: '/zin3.png', name: 'Chroma Key Curtain' },
            { src: '/zin4.png', name: 'Mastery Pen Drive' }
          ].map((product, i) => (
            <div key={i} className="flex flex-col items-center w-28 md:w-40 lg:w-48">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 rounded-full overflow-hidden border-[4px] md:border-[6px] border-[#900606] bg-white ${isDarkMode ? 'bg-[#131C2E]' : 'bg-white'} flex-shrink-0 hover:scale-105 transition-transform duration-500 mb-6 md:mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getImageUrl(product.src)} alt={product.name} className="w-full h-full object-contain object-center transition-all duration-500" />
              </div>
              <h4 className="text-[#2D2D2D] dark:text-neutral-200 font-bold text-sm md:text-base lg:text-lg text-center leading-tight">
                {product.name}
              </h4>
            </div>
          ))}
        </div>

        {/* Impact Metrics / Stats Bar */}
        <div className="border-t-[3px] border-b-[3px] border-[#900606] py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-6xl md:text-8xl font-black text-[#900606] tracking-tighter mb-2 md:mb-4">600</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-bold text-neutral-600 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} uppercase tracking-widest">Happy Creators</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-6xl md:text-8xl font-black text-[#900606] tracking-tighter mb-2 md:mb-4">700</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-bold text-neutral-600 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} uppercase tracking-widest">Studios Built</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-6xl md:text-8xl font-black text-[#900606] tracking-tighter mb-2 md:mb-4">1.2<span className="text-2xl sm:text-4xl md:text-6xl">M</span></div>
              <div className="text-[10px] sm:text-xs md:text-sm font-bold text-neutral-600 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} uppercase tracking-widest">Hours Saved</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-6xl md:text-8xl font-black text-[#900606] tracking-tighter mb-2 md:mb-4">110</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-bold text-neutral-600 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} uppercase tracking-widest">Countries</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
