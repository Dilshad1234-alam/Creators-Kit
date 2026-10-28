import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

function getFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { id: id }] };
  }
  return { id: id };
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const filter = getFilter(id);
    const bundle = await Product.findOne(filter);
    if (!bundle) {
      return NextResponse.json({ success: false, message: 'Bundle not found' }, { status: 404 });
    }
    const bundleObj = bundle.toObject ? bundle.toObject() : { ...bundle };
    if (!Array.isArray(bundleObj.bonusMasterclasses) || bundleObj.bonusMasterclasses.length === 0) {
      bundleObj.bonusMasterclasses = [
        {
          id: 'instagram-mastery',
          title: 'Instagram Mastery',
          description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
          image: '/video 2.webp',
          badge: '100% Free',
          originalPrice: 1999,
          active: true,
        },
        {
          id: 'youtube-mastery',
          title: 'YouTube Mastery',
          description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
          image: '/video 1.webp',
          badge: '100% Free',
          originalPrice: 1999,
          active: true,
        },
        {
          id: 'filmora-mastery',
          title: 'Filmora Mastery',
          description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
          image: '/video.webp',
          badge: '100% Free',
          originalPrice: 999,
          active: true,
        },
      ];
    } else {
      bundleObj.bonusMasterclasses = bundleObj.bonusMasterclasses.map((c) => {
        let img = c.image;
        if (!img || img.includes('banner') || img.includes('placeholder') || img.includes('circle')) {
          const id = (c.id || c.title || '').toLowerCase();
          if (id.includes('insta')) img = '/video 2.webp';
          else if (id.includes('you')) img = '/video 1.webp';
          else if (id.includes('film')) img = '/video.webp';
          else img = '/video.webp';
        }
        return { ...c, image: img };
      });
    }
    if (bundleObj.includeBonusCourses === undefined) {
      bundleObj.includeBonusCourses = true;
    }
    return NextResponse.json({ success: true, data: bundleObj });
  } catch (error) {
    console.error('GET /api/bundles/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const filter = getFilter(id);

    const updateData = { ...body, isBundle: true };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map((f) => f.trim()).filter(Boolean);
    }
    if (typeof updateData.items === 'string') {
      updateData.items = updateData.items.split(',').map((f) => f.trim()).filter(Boolean);
    }

    if (updateData.includeBonusCourses !== undefined) {
      updateData.includeBonusCourses = Boolean(updateData.includeBonusCourses);
    }

    if (Array.isArray(updateData.bonusMasterclasses)) {
      updateData.bonusMasterclasses = updateData.bonusMasterclasses.map((c) => {
        let img = c.image;
        if (!img || img.includes('banner') || img.includes('placeholder') || img.includes('circle')) {
          const id = (c.id || c.title || '').toLowerCase();
          if (id.includes('insta')) img = '/video 2.webp';
          else if (id.includes('you')) img = '/video 1.webp';
          else if (id.includes('film')) img = '/video.webp';
          else img = '/video.webp';
        }
        return {
          id: c.id || (c.title ? c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'masterclass'),
          title: c.title || 'Masterclass',
          description: c.description || '',
          image: img,
          badge: c.badge || '100% Free',
          originalPrice: c.originalPrice !== undefined && c.originalPrice !== '' ? Number(c.originalPrice) : 1999,
          active: c.active !== false,
        };
      });
    }

    const bundle = await Product.findOneAndUpdate(filter, updateData, {
      new: true,
      runValidators: true,
    });

    if (!bundle) {
      return NextResponse.json({ success: false, message: 'Bundle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: bundle });
  } catch (error) {
    console.error('PUT /api/bundles/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const filter = getFilter(id);
    const deletedBundle = await Product.findOneAndDelete(filter);

    if (!deletedBundle) {
      return NextResponse.json({ success: false, message: 'Bundle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('DELETE /api/bundles/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
