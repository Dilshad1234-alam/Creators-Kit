import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

function getFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { key: id }] };
  }
  return { key: id };
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const content = await Content.findOne(getFilter(id));
    if (!content) {
      return NextResponse.json({ success: false, message: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const content = await Content.findOneAndUpdate(getFilter(id), body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedContent = await Content.findOneAndDelete(getFilter(id));
    if (!deletedContent) {
      return NextResponse.json({ success: false, message: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
