import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(req) {
  try {
    await dbConnect();
    const { code, cartItems } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: 'This coupon is no longer active' }, { status: 400 });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 });
    }

    // Validate applicableProduct
    let isApplicable = false;
    let applicableCartItem = null;

    if (coupon.applicableProduct === 'ALL' || !coupon.applicableProduct) {
      isApplicable = true;
    } else {
      if (cartItems && cartItems.length > 0) {
        applicableCartItem = cartItems.find(item => item.id === coupon.applicableProduct || item._id === coupon.applicableProduct);
        if (applicableCartItem) {
          isApplicable = true;
        }
      }
    }

    if (!isApplicable) {
      return NextResponse.json({ success: false, error: 'This coupon is not applicable to any items in your cart' }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    
    if (coupon.applicableProduct === 'ALL' || !coupon.applicableProduct) {
      // Apply to whole cart total
      const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      if (coupon.discountType === 'percentage') {
        discountAmount = (cartTotal * coupon.discountAmount) / 100;
      } else {
        discountAmount = coupon.discountAmount;
      }
    } else {
      // Apply ONLY to the applicable product
      const itemTotal = applicableCartItem.price * applicableCartItem.quantity;
      if (coupon.discountType === 'percentage') {
        discountAmount = (itemTotal * coupon.discountAmount) / 100;
      } else {
        discountAmount = coupon.discountAmount;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount,
        discountType: coupon.discountType
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}
