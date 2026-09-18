import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Masterclass from '@/models/Masterclass';

export async function GET() {
  try {
    await dbConnect();
    let courses = await Masterclass.find({}).sort({ order: 1 });
    
    // Auto-seed if empty
    if (courses.length === 0) {
      const seedData = [
        {
          title: 'Instagram Mastery',
          description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
          icon: '📱',
          badge: '100% Free',
          order: 1
        },
        {
          title: 'YouTube Mastery',
          description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
          icon: '▶️',
          badge: '100% Free',
          order: 2
        },
        {
          title: 'Filmora Mastery',
          description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
          icon: '🎬',
          badge: '100% Free',
          order: 3
        }
      ];
      await Masterclass.insertMany(seedData);
      courses = await Masterclass.find({}).sort({ order: 1 });
    }

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Masterclasses GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const course = await Masterclass.create(body);
    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
