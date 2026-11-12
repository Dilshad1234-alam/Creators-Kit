import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({
      message: 'Database connected successfully',
      node_env: process.env.NODE_ENV || 'undefined',
      nextauth_url: process.env.NEXTAUTH_URL || 'undefined',
      has_google_id: !!(process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
      has_google_secret: !!process.env.GOOGLE_CLIENT_SECRET,
      has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
    });
  } catch (error) {
    console.error('API Route DB Connection Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to the database', details: error.message },
      { status: 500 }
    );
  }
}
