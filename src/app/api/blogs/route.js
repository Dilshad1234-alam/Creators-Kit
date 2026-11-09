import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

export const getProductImageForStory = (productName = '') => {
  const pLower = (productName || '').toLowerCase();
  if (pLower.includes('mic')) return '/wireless-mic.jpg';
  if (pLower.includes('tripod') || pLower.includes('stand')) return '/tripod.jpg';
  if (pLower.includes('ring') || pLower.includes('light')) return '/ring.jpg';
  if (pLower.includes('bundle') || pLower.includes('kit')) return '/banner 6.png';
  if (pLower.includes('gimbal') || pLower.includes('chorma') || pLower.includes('rig') || pLower.includes('green')) return '/chorma.jpg';
  return '/ring.jpg';
};

export const initialBlogs = [
  {
    title: 'How Rohan Transformed a Tiny Bedroom into a Cinematic Studio',
    slug: 'rohan-bedroom-studio-transformation',
    author: 'Rohan Sharma',
    product: 'AuraRing 10" Pro RGB',
    productImage: '/ring.jpg',
    excerpt: 'See how Rohan transformed a tiny bedroom into a cinematic studio with pro lighting and acoustic treatment.',
    content: 'Full studio breakdown of the lighting, audio placement, and acoustic treatment used to transform a small 10x10 bedroom into a broadcast-ready YouTube space. Using the Creators Studio Gear bundle, Rohan achieved studio-grade production without expensive renovations.',
    image: '/blog.jpg',
  },
  {
    title: 'Priya shares how dual-channel wireless mic systems eliminate city noise and fan hums effortlessly',
    slug: 'priya-wireless-mic-audio-guide',
    author: 'Priya Verma',
    product: 'VoiceForge Wireless Mic',
    productImage: '/wireless-mic.jpg',
    excerpt: 'Priya shares how dual-channel wireless mic systems eliminate city noise and fan hums effortlessly.',
    content: 'Audio quality makes or breaks viewer retention. In this detailed case study, lifestyle creator Priya Verma demonstrates how proper gain staging and dual-channel wireless mic placement completely removed street noise and background fan hums from outdoor and indoor vlogs. With zero latency and instant pairing, production quality scaled immediately.',
    image: '/blog1.jpg',
  },
  {
    title: 'Tired of shaky footage, Kunal upgraded to carbon fiber for rock-solid stability',
    slug: 'kunal-carbon-fiber-tripod-upgrade',
    author: 'Kunal Singh',
    product: 'ApexPro Heavy-Duty Tripod',
    productImage: '/tripod.jpg',
    excerpt: 'Tired of shaky footage during long outdoor streams? Here is why a heavy-duty tripod is essential.',
    content: 'Eliminating micro-shakes and achieving smooth, cinematic pans during product review shoots requires a rock-solid foundation. Kunal reviews the heavy-duty tripod setup across 30+ shoots in high-wind outdoor environments, ensuring zero jitter and reliable framing.',
    image: '/blog2.jpg',
  },
  {
    title: 'Ananya reached 100k subscribers in 3 months using the complete bundle',
    slug: 'ananya-100k-subscribers-case-study',
    author: 'Ananya Desai',
    product: 'Complete Creator Bundle',
    productImage: '/banner 6.png',
    excerpt: 'How consistency, the complete creator bundle, and expert courses helped Ananya hit six figures.',
    content: 'Ananya reached 100k subscribers in just 3 months. In this post, she shares her weekly production workflow, thumbnail testing strategies, and all-in-one studio equipment checklist that unlocked consistent viral growth.',
    image: '/blog3.jpg',
  },
  {
    title: 'Vikram fixed dull lighting and achieved professional studio quality',
    slug: 'vikram-studio-lighting-secrets',
    author: 'Vikram Mehta',
    product: 'Pro Studio Lighting Setup',
    productImage: '/ring.jpg',
    excerpt: 'How bi-color 18-inch ring lights bring out natural skin glow and eliminate dark eye bags.',
    content: 'Lighting is the single most important factor in looking professional on camera. Vikram explains the 3-point lighting setup, high-CRI color temperature adjustments, and shadow diffusion techniques that brought out natural skin tones.',
    image: '/blog4.jpg',
  },
];



export async function GET() {
  try {
    await dbConnect();
    let blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(20).lean();

    if (blogs.length === 0) {
      await Blog.insertMany(initialBlogs);
      blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(20).lean();
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.author) {
      body.author = 'Creator';
    }

    if (!body.title) {
      body.title = body.product
        ? `${body.author} - ${body.product}`
        : `${body.author}'s Review`;
    }

    if (!body.content) {
      body.content = body.excerpt || `${body.author}'s creator review for ${body.product || 'Creators Kit'}.`;
    }

    if (!body.excerpt) {
      body.excerpt = body.content ? body.content.slice(0, 160) : `${body.author}'s review`;
    }

    if (!body.slug) {
      let baseSlug = (body.author || body.title || 'creator-review')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      if (!baseSlug) baseSlug = `story-${Date.now()}`;
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      body.slug = slug;
    }

    if (body.rating !== undefined) {
      body.rating = Number(body.rating) || 5;
    }

    if (!body.productImage) {
      body.productImage = getProductImageForStory(body.product);
    }

    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: error.message || 'Failed to create blog' }, { status: 500 });
  }
}
