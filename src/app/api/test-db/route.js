import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json(
      { message: 'Database connected successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Route DB Connection Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to the database', details: error.message },
      { status: 500 }
    );
  }
}
