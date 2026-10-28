import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Masterclass from '@/models/Masterclass';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const course = await Masterclass.findById(id);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Next.js 15+ resolution
    const body = await req.json();
    const link = body.videoLink || body.videoUrl || '';
    if (link) {
      body.videoLink = link;
      body.videoUrl = link;
    }
    const course = await Masterclass.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Next.js 15+ resolution
    const course = await Masterclass.findByIdAndDelete(id);
    
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
