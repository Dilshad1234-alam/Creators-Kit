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
    const product = await Product.findOne(filter);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    const productObj = product.toObject ? product.toObject() : { ...product };
    if (!Array.isArray(productObj.bonusMasterclasses) || productObj.bonusMasterclasses.length === 0) {
      productObj.bonusMasterclasses = [
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
      productObj.bonusMasterclasses = productObj.bonusMasterclasses.map((c) => {
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
    return NextResponse.json({ success: true, data: productObj });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const filter = getFilter(id);

    const updateData = { ...body };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
    
    if (updateData.productType) {
      if (updateData.productType === 'thumbnail-bundle') {
        updateData.isBundle = false;
      } else if (updateData.productType === 'bundle') {
        updateData.isBundle = true;
      } else if (updateData.productType === 'individual') {
        updateData.isBundle = false;
      }
    } else if (updateData.category) {
      const isBun = updateData.category.toLowerCase().includes('bundle') || updateData.category === 'Creator bundles';
      if (updateData.isBundle === undefined) {
        updateData.isBundle = isBun;
      }
    }

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

    if (Array.isArray(updateData.images)) {
      updateData.images = updateData.images.map((im) => {
        if (typeof im === 'string') return { src: im, title: '', subtitle: '', description: '' };
        return {
          src: im.src || '/pro1.png',
          title: im.title || '',
          subtitle: im.subtitle || '',
          description: im.description || '',
          price: im.price !== undefined && im.price !== '' ? Number(im.price) : undefined,
          originalPrice: im.originalPrice !== undefined && im.originalPrice !== '' ? Number(im.originalPrice) : undefined,
        };
      });
      if (updateData.images.length > 0 && updateData.images[0].src) {
        updateData.image = updateData.images[0].src;
      }
    }

    const product = await Product.findOneAndUpdate(filter, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const filter = getFilter(id);
    const deletedProduct = await Product.findOneAndDelete(filter);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
