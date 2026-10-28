import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroBanner from '@/models/HeroBanner';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const banner = await HeroBanner.findById(id);
    if (!banner) {
      return NextResponse.json({ success: false, error: 'Hero banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const banner = await HeroBanner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return NextResponse.json({ success: false, error: 'Hero banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const banner = await HeroBanner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json({ success: false, error: 'Hero banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
