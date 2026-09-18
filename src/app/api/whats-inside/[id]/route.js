import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import WhatsInside from '@/models/WhatsInside';

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const body = await req.json();
    const item = await WhatsInside.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    console.error('Error updating whats inside item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const item = await WhatsInside.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting whats inside item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
