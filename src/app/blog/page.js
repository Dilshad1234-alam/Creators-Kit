import Link from 'next/link';

export const metadata = {
  title: 'Blog | Creators Kit',
  description: 'Read the latest updates, tips, and success stories from the Creators Kit community.',
};

export const dynamic = 'force-dynamic';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

const getBlogs = async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/blogs`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function BlogListingPage() {
  const fetchedBlogs = await getBlogs();
  
  const DUMMY_BLOGS = [
    {
      _id: 'dummy-1',
      slug: '#',
      title: 'How Sarah Used the Creator Kit to Hit 100k Subscribers & Monetize',
      excerpt: 'Discover the exact workflow, scripting, and lighting setup Sarah used to skyrocket her channel growth and land her first massive brand deal within just 6 months.',
      author: 'Sarah Jenkins',
      image: '/kits 16.jpg - Edited.png',
      createdAt: '2026-09-22T10:00:00.000Z',
      actionText: 'Read Story'
    },
    {
      _id: 'dummy-2',
      slug: '#',
      title: 'From Zero Experience to Pro Editor: Inside the Mastery Courses',
      excerpt: 'A behind-the-scenes look at how complete beginners are mastering video editing and color grading using our step-by-step curriculum.',
      author: 'Michael Chen',
      image: '/kits 14.jpg - Edited.png',
      createdAt: '2026-09-20T10:00:00.000Z',
      actionText: 'Watch Insights'
    },
    {
      _id: 'dummy-3',
      slug: '#',
      title: 'The Exact Lighting & Audio Setup That Doubled My Viewer Retention',
      excerpt: 'Poor audio and flat lighting kill audience retention instantly. Learn how upgrading to the Creator Kit ecosystem boosted average view duration.',
      author: 'Alex Rivera',
      image: '/kits 17.jpg - Edited.png',
      createdAt: '2026-09-15T10:00:00.000Z',
      actionText: 'Read Story'
    }
  ];

  const blogs = fetchedBlogs.length > 0 ? fetchedBlogs : DUMMY_BLOGS;

  return (
    <div className="min-h-screen bg-white dark:bg-background pt-8 md:pt-12 pb-16 md:pb-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4 md:mb-6 tracking-tight">
            Creators <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Journal</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl px-2 md:px-0">
            Success stories, creator tips, and updates to fuel your journey.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog, idx) => (
            <Link 
              key={blog._id} 
              href={blog.slug === '#' ? '#' : `/blog/${blog.slug}`}
              className="premium-glow-card group flex flex-col rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 h-full p-[2px]"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col h-full w-full rounded-[calc(2rem-2px)] overflow-hidden bg-white dark:bg-neutral-900">
                {/* Thumbnail */}
                <div className="relative h-56 md:h-72 w-full overflow-hidden border-b border-neutral-200 dark:border-neutral-800/50 shrink-0">
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={blog.image || '/placeholder.png'} 
                    alt={blog.title}
                    className="w-full h-full object-cover object-[center_20%] transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Content */}
                <div className="p-5 md:p-8 flex flex-col flex-1 relative bg-white dark:bg-neutral-900">
                  <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-primary tracking-widest uppercase mb-3 md:mb-4">
                    <span suppressHydrationWarning>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-600 dark:text-neutral-400">{blog.author}</span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2 md:mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h2>
                  
                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-4 md:mb-8 line-clamp-3 flex-1 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center text-xs md:text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors">
                    {blog.actionText || 'Read Story'}
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
