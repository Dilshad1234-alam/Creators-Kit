import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PendingUser from '@/models/PendingUser';

export const dynamic = 'force-dynamic';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await PendingUser.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Pending user not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
