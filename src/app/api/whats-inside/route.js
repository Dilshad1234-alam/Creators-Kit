import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import WhatsInside from '@/models/WhatsInside';

export async function GET() {
  await dbConnect();
  try {
    const items = await WhatsInside.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching whats inside items:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const item = await WhatsInside.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Error creating whats inside item:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
