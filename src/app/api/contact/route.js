import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    await dbConnect();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const message = await Contact.create(body);
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
