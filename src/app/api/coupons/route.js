import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
