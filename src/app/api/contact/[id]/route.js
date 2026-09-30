import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function DELETE(req, { params }) {
  await dbConnect();
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const message = await Contact.findByIdAndDelete(id);
    if (!message) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
