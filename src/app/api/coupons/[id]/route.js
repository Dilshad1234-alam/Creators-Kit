import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const coupon = await Coupon.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
