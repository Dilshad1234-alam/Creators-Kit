import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      code,
      discountType = 'percentage',
      discountAmount,
      expiryDate,
      appliesTo = 'ALL',
      applicableProducts = [],
      applicableCategories = [],
      isActive = true,
    } = body || {};

    if (!code || !discountAmount) {
      return NextResponse.json(
        { success: false, error: 'Coupon code and discount amount are required.' },
        { status: 400 }
      );
    }

    const payload = {
      code: String(code).trim().toUpperCase(),
      discountType,
      discountAmount: Number(discountAmount),
      isActive: Boolean(isActive),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      appliesTo,
      applicableProducts: Array.isArray(applicableProducts) ? applicableProducts : [],
      applicableCategories: Array.isArray(applicableCategories) ? applicableCategories : [],
      applicableProduct:
        appliesTo === 'ALL'
          ? 'ALL'
          : applicableProducts.length > 0
          ? applicableProducts[0]
          : 'SPECIFIC',
    };

    const coupon = await Coupon.create(payload);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
