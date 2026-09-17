import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';

export async function GET() {
  try {
    await dbConnect();
    const policies = await Policy.find({});
    return NextResponse.json({ success: true, data: policies });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const policy = await Policy.findOneAndUpdate(
      { key: body.key },
      body,
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ success: true, data: policy }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
