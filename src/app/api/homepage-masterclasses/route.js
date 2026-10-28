import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Masterclass from '@/models/Masterclass';

export const dynamic = 'force-dynamic';

const defaultCurriculums = {
  instagram: {
    duration: '2h 15m',
    progress: 75,
    modules: [
      {
        moduleTitle: 'Module 1: Foundations & High-Growth Setup',
        lessons: [
          {
            id: 'ig-1',
            title: 'Profile Architecture & High-Converting Bio',
            duration: '08:24',
            completed: true,
            locked: false,
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            overview: 'Learn to craft an irresistible bio and visual profile architecture that converts visitors into followers.',
            keyTakeaways: ['3-Second visual hook', 'High converting CTAs', 'Highlight reel structure'],
            resources: [
              { title: 'Viral Hook Blueprint 2026.pdf', fileSize: '1.4 MB', fileType: 'PDF Document', downloadUrl: '#' },
            ],
          },
          {
            id: 'ig-2',
            title: 'Defining Your Creator Niche & Target Audience',
            duration: '11:05',
            completed: true,
            locked: false,
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            overview: 'Find your content moat and zero in on high-engagement demographics.',
            keyTakeaways: ['Audience persona matrix', 'Competitor gap analysis'],
            resources: [],
          },
          {
            id: 'ig-3',
            title: '2026 Instagram Algorithm & Reach Metrics',
            duration: '14:32',
            completed: true,
            locked: false,
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            overview: 'Deep dive into save/share ratios and algorithmic ranking triggers.',
            keyTakeaways: ['Saves vs Shares priority', 'Watch time multipliers'],
            resources: [],
          },
        ],
      },
      {
        moduleTitle: 'Module 2: Viral Reels Production & Retention',
        lessons: [
          { id: 'ig-4', title: 'The 3-Second Visual Hook Formula', duration: '12:40', completed: true, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Hook viewers in under 3 seconds using audio and motion contrast.', keyTakeaways: ['Motion anchor', 'Tonal curiosity'], resources: [] },
          { id: 'ig-5', title: 'Pacing, Micro-Cuts & Audio Sync Mastery', duration: '15:10', completed: true, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Precision editing techniques to keep retention over 70%.', keyTakeaways: ['Waveform analysis', 'Jump cut cadence'], resources: [] },
          { id: 'ig-6', title: 'Trending Audio Selection & Timing Secrets', duration: '09:18', completed: false, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Catch viral audio curves before they saturate.', keyTakeaways: ['Audio velocity indicator', 'Original audio seeding'], resources: [] },
          { id: 'ig-7', title: 'Auto-Captions, Kinetic Text & Retention Triggers', duration: '13:50', completed: false, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Typography animations that boost completion rates.', keyTakeaways: ['High contrast palettes', 'B-roll text stacking'], resources: [] },
        ],
      },
      {
        moduleTitle: 'Module 3: Audience Monetisation & Brand Deals',
        lessons: [
          { id: 'ig-8', title: 'DM Funnels & Converting Views to Buyers', duration: '16:04', completed: false, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Automate DM keyword triggers to capture emails and make sales.', keyTakeaways: ['ManyChat automation', 'Story lead magnets'], resources: [] },
          { id: 'ig-9', title: 'Media Kit Creation & Pitching Top Brands', duration: '18:22', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Design a media kit that justifies premium sponsorship rates.', keyTakeaways: ['Deliverables pricing', 'Cold pitch email scripts'], resources: [] },
          { id: 'ig-10', title: 'Negotiating Pricing & Deliverables', duration: '14:15', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Contract clauses, usage rights, and multi-post packages.', keyTakeaways: ['Usage rights multipliers', 'Exclusivity fees'], resources: [] },
          { id: 'ig-11', title: 'Broadcast Channels & Superfans Community', duration: '10:45', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Build direct, algorithm-free relationships with your top 1% followers.', keyTakeaways: ['Voice notes and polls', 'Exclusive drops'], resources: [] },
          { id: 'ig-12', title: 'Scaling from 10k to 100k Followers Sustainably', duration: '21:10', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'The systemic approach to sustained content scaling without burnout.', keyTakeaways: ['Content batching schedule', 'Hiring your first editor'], resources: [] },
        ],
      },
    ],
  },
  youtube: {
    duration: '3h 40m',
    progress: 20,
    modules: [
      {
        moduleTitle: 'Module 1: Channel Kickstart & Gear Setup',
        lessons: [
          { id: 'yt-1', title: 'YouTube Channel Architecture & Brand Identity', duration: '10:15', completed: true, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Set up banner, avatar, handle, and default channel metadata.', keyTakeaways: ['Search friendly branding', 'About page optimization'], resources: [] },
          { id: 'yt-2', title: 'Budget Gear: Audio, Camera & 3-Point Lighting', duration: '14:20', completed: true, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Achieve studio look using Creator Kit ring lights and wireless mics.', keyTakeaways: ['Key light angle', 'Lavalier gain staging'], resources: [] },
          { id: 'yt-3', title: 'High-CTR Thumbnail Secrets in Photoshop', duration: '18:45', completed: false, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Psychology of 10%+ CTR thumbnails and color grading.', keyTakeaways: ['Rule of thirds focal point', 'Text legibility on mobile'], resources: [] },
        ],
      },
      {
        moduleTitle: 'Module 2: Search SEO & Video Packaging',
        lessons: [
          { id: 'yt-4', title: 'YouTube Search SEO & Tag Strategies', duration: '16:30', completed: false, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Rank for high-CPM search queries in your niche.', keyTakeaways: ['Title keyword placement', 'Timestamp chapters'], resources: [] },
          { id: 'yt-5', title: 'Video Scripting Framework for High Retention', duration: '22:10', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Beat the 30-second cliff and keep viewers engaged.', keyTakeaways: ['Open loops', 'Visual pattern interrupts'], resources: [] },
          { id: 'yt-6', title: 'Shorts vs Long-Form Growth Symbiosis', duration: '12:05', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Funnel Shorts viewers into loyal long-form subscribers.', keyTakeaways: ['Related video cards', 'Pinned comments'], resources: [] },
        ],
      },
      {
        moduleTitle: 'Module 3: AdSense, Sponsorships & Affiliate Income',
        lessons: [
          { id: 'yt-7', title: 'Unlocking YPP Monetization Fast Track', duration: '15:40', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Hit 1k subs and 4k watch hours ethically and quickly.', keyTakeaways: ['Evergreen content strategy', 'Community tab polls'], resources: [] },
          { id: 'yt-8', title: 'Affiliate Marketing & Dedicated Sponsorships', duration: '19:50', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Earn 5x your AdSense with recurring affiliate deals.', keyTakeaways: ['Description link formatting', 'Disclosures compliance'], resources: [] },
        ],
      },
    ],
  },
  filmora: {
    duration: '1h 50m',
    progress: 0,
    modules: [
      {
        moduleTitle: 'Module 1: Interface & Essential Cuts',
        lessons: [
          { id: 'fl-1', title: 'Filmora Interface Tour & Project Settings', duration: '11:20', completed: false, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Timeline shortcuts and 4K 60fps project preferences.', keyTakeaways: ['Proxy rendering for smooth playback', 'Custom hotkeys'], resources: [] },
          { id: 'fl-2', title: 'Smart Cuts, J-Cuts, L-Cuts & Speed Ramping', duration: '14:40', completed: false, locked: false, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Seamless audio-visual transitions used by top creators.', keyTakeaways: ['Speed curve easing', 'Audio crossfading'], resources: [] },
          { id: 'fl-3', title: 'Cinematic Color Grading & LUT Presets', duration: '17:15', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Color correct log footage and apply cinematic tones.', keyTakeaways: ['Scopes reading', 'LUT pack installation'], resources: [{ title: 'Filmora & Premiere LUT Pack.zip', fileSize: '18.2 MB', fileType: 'Archive', downloadUrl: '#' }] },
          { id: 'fl-4', title: 'Keyframing, Dynamic Motion & Sound FX', duration: '16:30', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Animate titles, zooms, and punch-ins with custom sound design.', keyTakeaways: ['Whoosh & pop alignment', 'Smooth zoom curves'], resources: [] },
          { id: 'fl-5', title: 'Export Presets for Crisp 4K Reels & Shorts', duration: '13:55', completed: false, locked: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', overview: 'Bitrate and codec settings that prevent Instagram compression.', keyTakeaways: ['HEVC vs H.264', 'Bitrate sweet spot for mobile'], resources: [] },
        ],
      },
    ],
  },
};

export async function GET(req) {
  try {
    await dbConnect();
    let shouldSeed = false;
    if (req && req.url) {
      try {
        const url = new URL(req.url);
        shouldSeed = url.searchParams.get('seed') === 'true';
      } catch (e) {}
    }

    let courses = await Masterclass.find({}).sort({ order: 1 });

    // Seed only if explicitly requested via ?seed=true
    if (courses.length === 0 && shouldSeed) {
      const seedData = [
        {
          title: 'Instagram Mastery',
          description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
          icon: '📱',
          badge: 'Worth ₹1,999',
          image: '/video 2.webp',
          duration: defaultCurriculums.instagram.duration,
          progress: defaultCurriculums.instagram.progress,
          ctaText: 'Explore Bundles',
          ctaLink: '/product',
          order: 1,
          active: true,
          modules: defaultCurriculums.instagram.modules,
        },
        {
          title: 'YouTube Mastery',
          description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
          icon: '▶️',
          badge: 'Worth ₹1,999',
          image: '/video 1.webp',
          duration: defaultCurriculums.youtube.duration,
          progress: defaultCurriculums.youtube.progress,
          ctaText: 'Explore Bundles',
          ctaLink: '/product',
          order: 2,
          active: true,
          modules: defaultCurriculums.youtube.modules,
        },
        {
          title: 'Filmora Mastery',
          description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
          icon: '🎬',
          badge: 'Worth ₹999',
          image: '/video.webp',
          duration: defaultCurriculums.filmora.duration,
          progress: defaultCurriculums.filmora.progress,
          ctaText: 'Explore Bundles',
          ctaLink: '/product',
          order: 3,
          active: true,
          modules: defaultCurriculums.filmora.modules,
        },
      ];
      await Masterclass.insertMany(seedData);
      courses = await Masterclass.find({}).sort({ order: 1 });
    }

    return NextResponse.json(
      { success: true, data: courses },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Masterclasses GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const link = body.videoLink || body.videoUrl || '';
    if (link) {
      body.videoLink = link;
      body.videoUrl = link;
    }
    const course = await Masterclass.create(body);
    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
