'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagekit';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    const handleSync = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchBlogs();
      }
    };
    window.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-background pt-20 sm:pt-24 md:pt-28 pb-12 md:pb-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-2xl md:text-4xl  lg:text-[5rem] font-black text-[#900606] dark:text-white tracking-tighter uppercase mb-4 md:mb-6 whitespace-nowrap">
            Creators Journal
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl px-2 md:px-0">
            Success stories, creator tips, and updates to fuel your journey.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {blogs.map((blog, idx) => (
            <Link 
              key={blog._id} 
              href={`/blog/${blog.slug}`}
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 h-full bg-white dark:bg-[#900606]/40 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col h-full w-full">
                <div className="relative h-48 md:h-56 w-full overflow-hidden shrink-0 bg-neutral-100">
                  <div className="absolute inset-0 bg-[#900606]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={getImageUrl(blog.image || '/placeholder.png')} 
                    alt={blog.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex flex-col flex-1 p-5 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3 text-[11px] md:text-xs font-bold text-[#900606] tracking-widest uppercase mb-3">
                    <span suppressHydrationWarning>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-[#900606]">{blog.author}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-[#900606] transition-colors duration-200 leading-tight line-clamp-3">
                    {blog.title}
                  </h2>
                  
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center text-sm font-bold text-[#900606] group-hover:text-black dark:group-hover:text-neutral-300 transition-colors">
                    {blog.actionText || 'Read Story'}
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {!loading && blogs.length === 0 && (
            <div className="col-span-full text-center py-20 text-neutral-500">
              <p className="text-xl font-medium">No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}