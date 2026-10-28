import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

function getFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { code: id.toUpperCase() }] };
  }
  return { code: id.toUpperCase() };
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const coupon = await Coupon.findOne(getFilter(id));
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updateData = { ...body };
    if (updateData.code) {
      updateData.code = String(updateData.code).trim().toUpperCase();
    }
    if (updateData.discountAmount !== undefined) {
      updateData.discountAmount = Number(updateData.discountAmount);
    }
    if (updateData.expiryDate !== undefined) {
      updateData.expiryDate = updateData.expiryDate ? new Date(updateData.expiryDate) : null;
    }
    if (updateData.applicableProducts && !Array.isArray(updateData.applicableProducts)) {
      updateData.applicableProducts = [String(updateData.applicableProducts)];
    }
    if (updateData.applicableCategories && !Array.isArray(updateData.applicableCategories)) {
      updateData.applicableCategories = [String(updateData.applicableCategories)];
    }
    if (updateData.appliesTo) {
      updateData.applicableProduct =
        updateData.appliesTo === 'ALL'
          ? 'ALL'
          : updateData.applicableProducts?.length > 0
          ? updateData.applicableProducts[0]
          : 'SPECIFIC';
    }

    const coupon = await Coupon.findOneAndUpdate(getFilter(id), updateData, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedCoupon = await Coupon.findOneAndDelete(getFilter(id));
    if (!deletedCoupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
