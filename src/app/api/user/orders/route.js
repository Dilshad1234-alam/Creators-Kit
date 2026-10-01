import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json({ success: false, error: 'Email or User ID is required' }, { status: 400 });
    }

    const query = { $or: [] };
    if (email) {
      query.$or.push(
        { customerEmail: email },
        { email: email },
        { 'customer.email': email }
      );
    }
    if (userId) {
      query.$or.push(
        { userId: userId },
        { user: userId }
      );
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
