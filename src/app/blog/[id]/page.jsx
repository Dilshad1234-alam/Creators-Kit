'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagekit';
import { Suspense } from 'react';

function BlogDetailContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || 'Creator Story';
  const product = searchParams.get('product') || 'Our Gear';
  const description = searchParams.get('description') || 'Discover how this creator upgraded their setup and enhanced their production quality.';
  const image = searchParams.get('image') || '/blog.jpg';

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-[#111827] font-sans pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#900606] font-bold text-sm mb-10 transition-colors">
          ← Back to Home
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <Image 
              src={getImageUrl(image)} 
              alt={title} 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw" 
              className="object-cover object-center"
              priority
            />
          </div>
          
          {/* Right: Content */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black tracking-widest text-[#900606] uppercase mb-4">Customer Success Story</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-tight mb-6">
              {title}
            </h1>
            <div className="inline-block bg-[#900606]/10 text-[#900606] font-bold px-4 py-2 rounded-full mb-8 w-fit text-sm">
              Product: {product}
            </div>
            
            <div className="prose prose-lg prose-neutral mb-10">
              <p className="text-neutral-600 font-medium leading-relaxed text-lg md:text-xl">
                {description}
              </p>
            </div>
            
            <Link 
              href="/product" 
              className="relative px-10 py-5 bg-[#111827] text-white rounded-full font-black text-lg overflow-hidden group transition-all duration-300 shadow-xl inline-flex items-center justify-center w-full sm:w-max hover:shadow-[0_8px_30px_rgba(17,24,39,0.3)]"
            >
              <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
              <span className="relative z-10 transition-colors duration-300 flex items-center gap-3">
                Shop The Setup
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBFBF7] pt-28 flex justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#900606] border-t-transparent animate-spin"></div>
      </div>
    }>
      <BlogDetailContent />
    </Suspense>
  );
}
