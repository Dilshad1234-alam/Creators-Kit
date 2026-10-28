import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await dbConnect();
    const { code, cartItems } = await req.json();

    if (!code || !String(code).trim()) {
      return NextResponse.json({ success: false, error: 'Coupon code is required.' }, { status: 400 });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code.' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: 'This coupon is currently inactive.' }, { status: 400 });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ success: false, error: 'This coupon has expired.' }, { status: 400 });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty.' }, { status: 400 });
    }

    // Retrieve database product information for all items in cart to match types, categories, and IDs
    const candidateIds = cartItems
      .map((item) => String(item.id || item._id || ''))
      .filter(Boolean);

    const validObjectIds = candidateIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    let dbProducts = [];
    try {
      dbProducts = await Product.find({
        $or: [
          { id: { $in: candidateIds } },
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
        ],
      }).lean();
    } catch (fetchErr) {
      console.warn('Could not fetch DB products for coupon validation:', fetchErr);
    }

    const productMap = new Map();
    dbProducts.forEach((p) => {
      if (p.id) productMap.set(String(p.id), p);
      if (p._id) productMap.set(String(p._id), p);
    });

    const scope = coupon.appliesTo || (coupon.applicableProduct && coupon.applicableProduct !== 'ALL' ? 'PRODUCTS' : 'ALL');
    const targetProducts = Array.isArray(coupon.applicableProducts)
      ? coupon.applicableProducts.map(String)
      : [];
    const targetCategories = Array.isArray(coupon.applicableCategories)
      ? coupon.applicableCategories.map((c) => String(c).toLowerCase().trim())
      : [];

    // Filter eligible items from the cart
    const eligibleItems = cartItems.filter((item) => {
      const dbProd = productMap.get(String(item.id)) || productMap.get(String(item._id)) || {};
      const productId = String(item.id || item._id || dbProd.id || dbProd._id || '');
      const dbId = dbProd._id ? String(dbProd._id) : '';
      const slug = dbProd.id ? String(dbProd.id) : (item.id ? String(item.id) : '');

      const productType =
        dbProd.productType ||
        item.productType ||
        (dbProd.isBundle || item.isBundle ? 'bundle' : 'individual');
      const isBundle = Boolean(dbProd.isBundle || item.isBundle || productType === 'bundle');
      const isThumbnailBundle = Boolean(productType === 'thumbnail-bundle');
      const category = String(dbProd.category || item.category || '').toLowerCase().trim();

      // Legacy fallback
      if (!coupon.appliesTo && coupon.applicableProduct && coupon.applicableProduct !== 'ALL') {
        return (
          coupon.applicableProduct === productId ||
          coupon.applicableProduct === dbId ||
          coupon.applicableProduct === slug
        );
      }

      switch (scope) {
        case 'ALL':
          return true;

        case 'PRODUCTS':
          // Specific Individual Products
          if (targetProducts.length > 0) {
            return (
              targetProducts.includes(productId) ||
              targetProducts.includes(dbId) ||
              targetProducts.includes(slug)
            );
          }
          // If no specific product list, applies to any individual product
          return productType === 'individual' || (!isBundle && !isThumbnailBundle);

        case 'BUNDLES':
          // Creator Bundles
          if (targetProducts.length > 0) {
            return (
              (isBundle || productType === 'bundle') &&
              (targetProducts.includes(productId) ||
                targetProducts.includes(dbId) ||
                targetProducts.includes(slug))
            );
          }
          // Applies to all creator bundles
          return isBundle || productType === 'bundle' || category.includes('bundle');

        case 'THUMBNAIL_BUNDLES':
          // Thumbnail Bundles
          if (targetProducts.length > 0) {
            return (
              (isThumbnailBundle || productType === 'thumbnail-bundle') &&
              (targetProducts.includes(productId) ||
                targetProducts.includes(dbId) ||
                targetProducts.includes(slug))
            );
          }
          // Applies to all thumbnail bundles
          return isThumbnailBundle || productType === 'thumbnail-bundle';

        case 'CATEGORY':
          // Specific Category
          return targetCategories.includes(category);

        default:
          return true;
      }
    });

    if (eligibleItems.length === 0) {
      let message = 'This coupon is not applicable to any items in your cart.';
      if (scope === 'BUNDLES') {
        message = 'This coupon is valid only on Creator Bundles.';
      } else if (scope === 'THUMBNAIL_BUNDLES') {
        message = 'This coupon is valid only on Thumbnail Bundles.';
      } else if (scope === 'PRODUCTS') {
        message = 'This coupon is only applicable to specific individual products.';
      } else if (scope === 'CATEGORY') {
        message = `This coupon is only valid for products in: ${coupon.applicableCategories?.join(', ') || 'selected categories'}.`;
      }
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    // Calculate subtotal of eligible items only
    const eligibleSubtotal = eligibleItems.reduce((acc, item) => {
      const price =
        typeof item.price === 'number'
          ? item.price
          : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + price * qty;
    }, 0);

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round(((eligibleSubtotal * coupon.discountAmount) / 100) * 100) / 100;
    } else {
      // Fixed discount cannot exceed eligible items subtotal
      discountAmount = Math.min(Number(coupon.discountAmount), eligibleSubtotal);
    }

    discountAmount = Math.max(0, discountAmount);

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount,
        discountType: coupon.discountType,
        discountRate: coupon.discountAmount,
        appliesTo: scope,
        eligibleItemsCount: eligibleItems.length,
        eligibleSubtotal,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon: ' + error.message },
      { status: 500 }
    );
  }
}

