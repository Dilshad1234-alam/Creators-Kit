import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HomepageFeature from '@/models/HomepageFeature';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const feature = await HomepageFeature.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!feature) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: feature });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const feature = await HomepageFeature.findByIdAndDelete(id);
    
    if (!feature) {
      return NextResponse.json({ success: false, error: 'Feature not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
