'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagekit';

function BlogDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read search params as immediate fallback
  const queryTitle = searchParams.get('title');
  const queryProduct = searchParams.get('product');
  const queryDescription = searchParams.get('description');
  const queryImage = searchParams.get('image');

  useEffect(() => {
    async function fetchBlog() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          // API returns the blog object directly or { success, data }
          const blogData = data?.data || (data?._id ? data : null);
          if (blogData) {
            setBlog(blogData);
          }
        }
      } catch (err) {
        console.warn('Could not fetch blog by ID/slug, falling back to query parameters:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  const title = blog?.title || queryTitle || 'Creator Success Story';
  const author = blog?.author || queryTitle || 'Verified Creator';
  const product = blog?.product || queryProduct || 'Creator Studio Setup';
  const description = blog?.content || blog?.excerpt || queryDescription || 'Discover how this creator upgraded their setup and enhanced their production quality.';
  const image = blog?.image || queryImage || '/blog.jpg';
  const formattedDate = blog?.createdAt 
    ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

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
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-black tracking-widest text-[#900606] uppercase">Customer Success Story</span>
              {formattedDate && (
                <span className="text-xs font-semibold text-neutral-400">• {formattedDate}</span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-tight mb-4">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="bg-[#900606]/10 text-[#900606] font-bold px-4 py-1.5 rounded-full text-xs">
                Author: {author}
              </span>
              <span className="bg-neutral-100 text-neutral-700 font-bold px-4 py-1.5 rounded-full text-xs">
                Featured: {product}
              </span>
            </div>
            
            <div className="prose prose-lg prose-neutral mb-10">
              <p className="text-neutral-600 font-medium leading-relaxed text-base md:text-lg whitespace-pre-line">
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
