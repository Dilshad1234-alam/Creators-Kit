import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');
    const typeParam = searchParams.get('type');
    const searchParam = searchParams.get('search');

    const products = await Product.find({}).sort({ createdAt: -1 });

    // Filter by type or category if requested
    let filtered = products;

    if (typeParam === 'thumbnail-bundle' || typeParam === 'thumbnail-bundles') {
      filtered = filtered.filter(
        (p) =>
          p.productType === 'thumbnail-bundle' ||
          (!p.productType && p.images && p.images.length > 1 && p.images.some((v) => v.title && v.title !== p.name))
      );
    } else if (typeParam === 'bundle' || typeParam === 'bundles' || categoryParam === 'bundle' || categoryParam === 'Creator bundles') {
      filtered = filtered.filter(
        (p) =>
          p.productType === 'bundle' ||
          (!p.productType && (p.isBundle || (p.category && p.category.toLowerCase().includes('bundle'))))
      );
    } else if (typeParam === 'individual') {
      filtered = filtered.filter(
        (p) =>
          p.productType === 'individual' ||
          (!p.productType && !p.isBundle && p.productType !== 'thumbnail-bundle')
      );
    } else if (categoryParam) {
      filtered = filtered.filter(
        (p) => p.category && p.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    if (searchParam) {
      const q = searchParam.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    const normalized = filtered.map((p) => {
      const obj = p.toObject ? p.toObject() : { ...p };
      let pType = obj.productType;
      if (!pType || !['individual', 'bundle', 'thumbnail-bundle'].includes(pType)) {
        if (
          obj.id === 'rode-wireless-go-2' ||
          (Array.isArray(obj.images) && obj.images.length > 1 && obj.images.some((v) => v.title && v.title !== obj.name))
        ) {
          pType = 'thumbnail-bundle';
        } else if (obj.isBundle || (obj.category && obj.category.toLowerCase().includes('bundle'))) {
          pType = 'bundle';
        } else {
          pType = 'individual';
        }
      }
      obj.productType = pType;

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
      count: normalized.length,
      data: normalized,
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
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
        { success: false, error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    // Generate unique ID slug if not provided
    const baseId = (body.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let finalId = body.id || baseId;

    // Check if ID already exists
    const existing = await Product.findOne({ id: finalId });
    if (existing) {
      finalId = `${baseId}-${Date.now().toString().slice(-4)}`;
    }

    let productType = body.productType;
    if (!productType) {
      if (Array.isArray(body.images) && body.images.length > 1 && body.images.some((v) => v.title || v.price)) {
        productType = 'thumbnail-bundle';
      } else if (body.isBundle || (body.category || '').toLowerCase().includes('bundle')) {
        productType = 'bundle';
      } else {
        productType = 'individual';
      }
    }

    const isBundle = productType === 'bundle';

    const parsedImages = Array.isArray(body.images) && body.images.length > 0
      ? body.images.map((im) => {
          if (typeof im === 'string') return { src: im, title: '', subtitle: '', description: '' };
          return {
            src: im.src || body.image || (isBundle ? '/pro1.png' : '/ring.jpg'),
            title: im.title || '',
            subtitle: im.subtitle || '',
            description: im.description || '',
            price: im.price !== undefined && im.price !== '' ? Number(im.price) : undefined,
            originalPrice: im.originalPrice !== undefined && im.originalPrice !== '' ? Number(im.originalPrice) : undefined,
          };
        })
      : [{ src: body.image || (isBundle ? '/pro1.png' : '/ring.jpg'), title: body.name || '', subtitle: '', description: '' }];

    const cleanedBonusMasterclasses = isBundle && Array.isArray(body.bonusMasterclasses) && body.bonusMasterclasses.length > 0
      ? body.bonusMasterclasses.map((c) => {
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
        })
      : undefined;

    const productData = {
      ...body,
      id: finalId,
      slug: finalId,
      productType,
      isBundle,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      image: (body.image || '').trim() || parsedImages[0]?.src || (isBundle ? '/pro1.png' : '/ring.jpg'),
      video: (body.video || body.videoUrl || '').trim(),
      videoUrl: (body.video || body.videoUrl || '').trim(),
      images: parsedImages,
      includeBonusCourses: isBundle ? (body.includeBonusCourses !== undefined ? Boolean(body.includeBonusCourses) : true) : false,
      ...(cleanedBonusMasterclasses ? { bonusMasterclasses: cleanedBonusMasterclasses } : { bonusMasterclasses: [] }),
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
    };

    const newProduct = await Product.create(productData);

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
