import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const searchParam = searchParams.get('search');

    let bundles = await Product.find({
      $or: [
        { isBundle: true },
        { productType: 'bundle' },
        { category: { $regex: /bundle/i } },
        { category: 'Creator bundles' },
      ],
    }).sort({ createdAt: -1 }).limit(20).lean();

    if (searchParam) {
      const q = searchParam.toLowerCase();
      bundles = bundles.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          (b.features && b.features.some((f) => f.toLowerCase().includes(q)))
      );
    }

    const normalizedBundles = bundles.map((b) => {
      const obj = b.toObject ? b.toObject() : { ...b };
      if (!Array.isArray(obj.bonusMasterclasses) || obj.bonusMasterclasses.length === 0) {
        obj.bonusMasterclasses = [
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
        obj.bonusMasterclasses = obj.bonusMasterclasses.map((c) => {
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
      if (obj.includeBonusCourses === undefined) {
        obj.includeBonusCourses = true;
      }
      return obj;
    });

    return NextResponse.json({
      success: true,
      count: normalizedBundles.length,
      data: normalizedBundles,
    });
  } catch (error) {
    console.error('GET /api/bundles error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Bundle name and price are required' },
        { status: 400 }
      );
    }

    const baseId = (body.name || 'bundle')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let finalId = body.id || baseId;

    const existing = await Product.findOne({ id: finalId });
    if (existing) {
      finalId = `${baseId}-${Date.now().toString().slice(-4)}`;
    }

    const bundleData = {
      ...body,
      id: finalId,
      isBundle: true,
      category: body.category || 'Creator bundles',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : 20,
      image: body.image || '/pro1.png',
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images.map((im) => (typeof im === 'string' ? { src: im } : im))
        : [{ src: body.image || '/pro1.png' }],
      features: Array.isArray(body.features)
        ? body.features
        : typeof body.features === 'string'
        ? body.features.split(',').map((f) => f.trim()).filter(Boolean)
        : [],
      items: Array.isArray(body.items)
        ? body.items
        : typeof body.items === 'string'
        ? body.items.split(',').map((f) => f.trim()).filter(Boolean)
        : [],
      whatsInTheBox: (Array.isArray(body.items)
        ? body.items
        : typeof body.items === 'string'
        ? body.items.split(',').map((f) => f.trim()).filter(Boolean)
        : []).map((name) => ({ name })),
    };

    const newBundle = await Product.create(bundleData);

    return NextResponse.json(
      { success: true, data: newBundle },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/bundles error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
