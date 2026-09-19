import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    await dbConnect();
    let content = await Content.find({});

    // Auto-seed if empty
    if (content.length === 0) {
      const seedData = [
        { key: 'hero_heading', value: 'Unbox your potential' },
        { key: 'hero_subheading', value: 'The Complete Creator Bundle' },
        { key: 'hero_description', value: 'Stop guessing what gear you need. We provide the professional equipment, expert courses, and tactile resources so you can focus on what matters: making great content.' },
        { key: 'product_hero_heading', value: 'PROFESSIONAL LED RING LIGHT' },
        { key: 'product_badge_text', value: 'SAVE 55%' },
        { key: 'product_hero_desc', value: 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.' },
        { key: 'section_one_title', value: "Need Just One Piece?" },
        { key: 'section_two_title', value: 'The Complete Bundle' },
        { key: 'section_three_title', value: 'The Secret Sauce: Education' }
      ];
      await Content.insertMany(seedData);
      content = await Content.find({});
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const content = await Content.findOneAndUpdate(
      { key: body.key },
      { value: body.value },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ success: true, data: content }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
