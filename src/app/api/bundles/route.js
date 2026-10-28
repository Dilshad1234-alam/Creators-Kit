import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

const initialBundles = [
  {
    id: 'pro-creator-kit',
    name: 'Pro Creator Kit',
    category: 'Creator bundles',
    isBundle: true,
    price: 9999,
    originalPrice: 14999,
    stock: 42,
    image: '/pro1.png',
    images: [{ src: '/pro1.png' }, { src: '/pro.png' }, { src: '/pro2.png' }],
    description: 'The all-in-one studio bundle engineered for professional YouTubers, streamers, and podcast hosts. Includes high-performance lighting, crystal-clear dual wireless audio, stable tripod support, and chroma key backdrop.',
    features: [
      'Creators Kit Studio Condenser Mic',
      '18-inch High-CRI LED Ring Light',
      'Heavy-Duty Aluminum Camera & Phone Tripod',
      'Wrinkle-Resistant Green Screen Backdrop with Stand',
      'All-Weather Reinforced Equipment Travel Bag',
    ],
    items: ['Creators Kit Studio Condenser Mic', 'Ring Light with Stand', 'Tripod Stand', 'Green Screen Backdrop', 'Carry Bag'],
    tag: 'Most Popular',
    discount: '33% OFF',
  },
  {
    id: 'basic-creator-kit',
    name: 'Basic Creator Kit',
    category: 'Creator bundles',
    isBundle: true,
    price: 4999,
    originalPrice: 6999,
    stock: 35,
    image: '/pro.png',
    images: [{ src: '/pro.png' }, { src: '/ring.jpg' }, { src: '/tripod.jpg' }],
    description: 'The foundational setup every aspiring creator needs. Clean lighting, directional audio, and solid tripod mounting to produce crisp videos right out of the box.',
    features: [
      'Ring Light 18" with Phone Mount',
      'Adjustable Aluminum Tripod Stand',
      'Wireless Lapel Microphone',
      'Universal Smartphone Grip',
      'Zippered Gear Carry Pouch',
    ],
    items: ['Ring Light 18"', 'Tripod Stand', 'Wireless Mic', 'Phone Mount', 'Carry Bag'],
    tag: 'Best Seller',
    discount: '28% OFF',
  },
  {
    id: 'ultimate-creator-kit',
    name: 'Ultimate Creator Kit',
    category: 'Creator bundles',
    isBundle: true,
    price: 14999,
    originalPrice: 24999,
    stock: 20,
    image: '/pro2.png',
    images: [{ src: '/pro2.png' }, { src: '/pro1.png' }],
    description: 'Our flagship commercial creation kit with dual RGB lighting panels, boom arm, broadcast microphones, and premium motorized slider.',
    features: [
      'Dual Bi-Color LED RGB Light Panels',
      'Broadcast Boom Arm & Condenser Mic',
      'Professional Carbon Fiber Tripod',
      'Ultra-Wide Studio Chroma Key Curtain',
      'Hard Shell Travel Equipment Case',
    ],
    items: ['Dual RGB Panels', 'Boom Mic System', 'Carbon Fiber Tripod', 'Chroma Key Curtain', 'Hard Case'],
    tag: 'New Arrival',
    discount: '40% OFF',
  },
];

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const searchParam = searchParams.get('search');

    let bundles = await Product.find({
      $or: [
        { isBundle: true },
        { category: { $regex: /bundle/i } },
        { category: 'Creator bundles' },
      ],
    }).sort({ createdAt: -1 });

    // Auto-seed default bundles if missing
    if (bundles.length === 0) {
      await Product.insertMany(initialBundles);
      bundles = await Product.find({
        $or: [
          { isBundle: true },
          { category: { $regex: /bundle/i } },
          { category: 'Creator bundles' },
        ],
      }).sort({ createdAt: -1 });
    }

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
      images: body.images && body.images.length > 0 ? body.images : [{ src: body.image || '/pro1.png' }],
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
