import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const content = await Content.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!content) {
      return NextResponse.json({ success: false, message: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedContent = await Content.findByIdAndDelete(id);
    if (!deletedContent) {
      return NextResponse.json({ success: false, message: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
