import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export async function GET() {
  try {
    await dbConnect();
    const content = await Content.find({});
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
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
