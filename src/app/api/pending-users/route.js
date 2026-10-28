import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PendingUser from '@/models/PendingUser';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const pending = await PendingUser.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: pending.length, data: pending });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
