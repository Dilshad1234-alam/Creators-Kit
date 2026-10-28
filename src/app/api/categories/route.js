import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let categories = await Category.find({}).sort({ order: 1 });

    // Auto-seed initial categories if empty
    if (categories.length === 0) {
      const seedData = [
        {
          name: 'Lights',
          image: '/ring.jpg',
          link: '/product',
          itemCount: 'Studio Lighting',
          order: 1,
        },
        {
          name: 'Pro Tripods',
          image: '/tripod.jpg',
          link: '/product',
          itemCount: 'Heavy Duty Stands',
          order: 2,
        },
        {
          name: 'Gimbal/Rig',
          image: '/chorma.jpg',
          link: '/product',
          itemCount: 'Stabilizers & Backdrops',
          order: 3,
        },
        {
          name: 'Microphones',
          image: '/wireless-mic.jpg',
          link: '/product',
          itemCount: 'Wireless Audio',
          order: 4,
        },
      ];
      await Category.insertMany(seedData);
      categories = await Category.find({}).sort({ order: 1 });
    }

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Category GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const category = await Category.create(body);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Category POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
