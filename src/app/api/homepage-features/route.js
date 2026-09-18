import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HomepageFeature from '@/models/HomepageFeature';

export async function GET() {
  try {
    await dbConnect();
    let features = await HomepageFeature.find({}).sort({ order: 1 });
    
    // Auto-seed if database is completely empty
    if (features.length === 0) {
      const seedData = [
        {
          name: 'Ring Light',
          description: 'Professional LED ring light with adjustable color temperatures.',
          features: ['3 Color Modes', '10 Brightness Levels', 'USB Powered'],
          useCase: 'Perfect for well-lit vlogs, beauty tutorials, and streaming.',
          benefit: 'Instantly elevates your video quality with flattering, even lighting.',
          icon: '💡',
          image: '/kits 25 (1).jpg',
          order: 1
        },
        {
          name: 'Wireless Microphone',
          description: 'Crisp, clear audio capture without the hassle of cables.',
          features: ['Noise Reduction', 'Plug-and-Play', '65ft Range'],
          useCase: 'Ideal for interviews, podcasts, and on-the-go vlogging.',
          benefit: 'Ensures your audience hears every word clearly, without background static.',
          icon: '🎙️',
          image: '/kits 27 (1).jpg',
          order: 2
        },
        {
          name: 'Camera/Phone Tripod',
          description: 'Versatile mounting solution for your smartphone or DSLR.',
          features: ['360° Rotation', 'Bluetooth Remote', 'Universal Mount'],
          useCase: 'Achieve stable shots and smooth panning for professional videos.',
          benefit: 'No more shaky footage; get the perfect angle every time.',
          icon: '📸',
          image: '/kits 24 (1).jpg',
          order: 3
        },
        {
          name: 'Chroma Key Curtain',
          description: 'High-quality green screen backdrop for seamless background replacement.',
          features: ['Wrinkle-resistant', 'Washable', 'Includes Clamps'],
          useCase: 'Easily drop in custom backgrounds for gaming, streaming, or effects.',
          benefit: 'Transform your messy bedroom into a professional studio instantly.',
          icon: '🟩',
          image: '/kits 26 (1).jpg',
          order: 4
        },
        {
          name: 'Mastery Pen Drive',
          description: 'Physical USB pendrive packed with all our exclusive Mastery Courses and digital resources.',
          features: ['Plug-and-Play', 'High-Speed USB', 'Pre-loaded Courses'],
          useCase: 'Access premium educational content offline, anywhere you go.',
          benefit: 'No internet required to learn the exact secrets of going viral.',
          icon: '💾',
          image: '/kits 28 (1).jpg',
          order: 5
        }
      ];
      await HomepageFeature.insertMany(seedData);
      features = await HomepageFeature.find({}).sort({ order: 1 });
    }

    return NextResponse.json({ success: true, data: features });
  } catch (error) {
    console.error("HomepageFeatures GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const feature = await HomepageFeature.create(body);
    return NextResponse.json({ success: true, data: feature });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
