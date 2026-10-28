import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroBanner from '@/models/HeroBanner';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let banners = await HeroBanner.find({}).sort({ order: 1 });

    // Auto-seed initial slides if empty
    if (banners.length === 0) {
      const seedData = [
        {
          image: '/banner 5.png',
          title: 'ALL-IN-ONE CREATOR KIT',
          subtitle: '🚀 Everything You Need',
          ctaText: 'Explore Bundle',
          link: '/product',
          order: 1,
          active: true,
        },
        {
          image: '/banner 1.png',
          title: 'PROFESSIONAL LIGHTING.',
          subtitle: '💡 Studio Grade',
          ctaText: 'Shop Lighting',
          link: '/product',
          order: 2,
          active: true,
        },
        {
          image: '/banner 2.jpg',
          title: 'ULTIMATE STABILITY.',
          subtitle: '📸 Carbon Fiber',
          ctaText: 'Explore Tripods',
          link: '/product',
          order: 3,
          active: true,
        },
        {
          image: '/banners 2.jpg',
          title: 'CRYSTAL CLEAR AUDIO.',
          subtitle: '🎙️ Pro Sound',
          ctaText: 'Shop Microphones',
          link: '/product',
          order: 4,
          active: true,
        },
      ];
      await HeroBanner.insertMany(seedData);
      banners = await HeroBanner.find({}).sort({ order: 1 });
    }

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error('HeroBanner GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const banner = await HeroBanner.create(body);
    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error('HeroBanner POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
