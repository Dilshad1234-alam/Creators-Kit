import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { title: 'Blog Not Found' };
    
    const blog = await res.json();
    return {
      title: `${blog.title} | Creators Kit`,
      description: blog.excerpt,
    };
  } catch (error) {
    return { title: 'Blog' };
  }
}

const getBlog = async (slug) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch blog');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center gap-3 text-sm font-bold text-primary tracking-widest uppercase mb-6">
          <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Blog
          </Link>
          <span className="text-neutral-600">•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
          {blog.title}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xl text-neutral-300 border border-neutral-700">
            {blog.author.charAt(0)}
          </div>
          <div>
            <p className="text-white font-bold">{blog.author}</p>
            <p className="text-neutral-500 text-sm">Creator</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150">
        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-neutral-800 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="premium-glow-card p-8 sm:p-12 rounded-[2rem]">
          <div 
            className="prose prose-invert prose-lg prose-neutral max-w-none 
              prose-headings:text-white prose-headings:font-bold 
              prose-a:text-primary hover:prose-a:text-primary-hover 
              prose-strong:text-white prose-strong:font-bold
              prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-neutral-300 prose-blockquote:font-medium prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* CTA Footer */}
        <div className="mt-16 text-center bg-gradient-to-b from-transparent to-neutral-900/50 rounded-[2rem] p-12 border border-neutral-800/50">
          <h3 className="text-2xl font-black text-white mb-4">Ready to start your journey?</h3>
          <p className="text-neutral-400 mb-8 max-w-lg mx-auto">Get the tools and strategies used by top creators to build and monetize your audience.</p>
          <Link href="/product" className="inline-flex justify-center items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-neutral-950 rounded-full font-extrabold text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all">
            Get the Creators Kit
          </Link>
        </div>
      </div>
    </div>
  );
}
