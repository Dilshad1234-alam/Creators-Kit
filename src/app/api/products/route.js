import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

const initialSeedData = [
  {
    id: 'pro-creator-kit',
    name: 'Pro Creator Kit',
    category: 'Creator bundles',
    productType: 'bundle',
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
      'All-Weather Reinforced Equipment Travel Bag'
    ],
    items: ['Creators Kit Studio Condenser Mic', 'Ring Light with Stand', 'Tripod Stand', 'Green Screen Backdrop', 'Carry Bag'],
    tag: 'Most Popular',
    discount: '33% OFF',
  },
  {
    id: 'basic-creator-kit',
    name: 'Basic Creator Kit',
    category: 'Creator bundles',
    productType: 'bundle',
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
      'Zippered Gear Carry Pouch'
    ],
    items: ['Ring Light 18"', 'Tripod Stand', 'Wireless Mic', 'Phone Mount', 'Carry Bag'],
    tag: 'Best Seller',
    discount: '28% OFF',
  },
  {
    id: 'ultimate-creator-kit',
    name: 'Ultimate Creator Kit',
    category: 'Creator bundles',
    productType: 'bundle',
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
      'Hard Shell Travel Equipment Case'
    ],
    items: ['Dual RGB Panels', 'Boom Mic System', 'Carbon Fiber Tripod', 'Chroma Key Curtain', 'Hard Case'],
    tag: 'New Arrival',
    discount: '40% OFF',
  },
  {
    id: 'digitek-ring-light-18',
    name: 'Digitek Ring Light 18"',
    category: 'Lighting',
    productType: 'individual',
    isBundle: false,
    price: 2499,
    originalPrice: 3499,
    stock: 8,
    image: '/ring.jpg',
    images: [{ src: '/ring.jpg' }, { src: '/ring1.png' }, { src: '/ring2.png' }],
    description: 'Professional 18-inch dimmable LED ring light with adjustable color temperatures (3200K - 5600K). Delivers shadowless facial illumination for streaming, vlogging, and beauty tutorials.',
    features: [
      'Bi-Color 3200K - 5600K Variable Temperature',
      'Dimmable 1% - 100% Stepless Brightness Control',
      'Includes 6ft Aluminum Light Stand',
      'Hot Shoe Ball Head with Flexible Phone Clamp'
    ],
    items: ['18" Ring Light', '6ft Light Stand', 'Smartphone Mount', 'AC Power Adapter'],
    tag: 'Trending',
    discount: '28% OFF',
  },
  {
    id: 'rode-wireless-go-ii',
    name: 'Creators Kit Wireless Studio Mic',
    category: 'Audio',
    productType: 'individual',
    isBundle: false,
    price: 24999,
    originalPrice: 29999,
    stock: 6,
    image: '/wireless-mic.jpg',
    images: [{ src: '/wireless-mic.jpg' }, { src: '/wireless-mic1.png' }, { src: '/wireless-mic2.png' }],
    description: 'Dual channel wireless microphone system featuring series IV 2.4GHz digital transmission, built-in microphones, and on-board recording capabilities with over 40 hours of onboard memory.',
    features: [
      'Dual-Channel Wireless System for Two Transmitters',
      'Series IV 2.4GHz Digital Transmission with 128-bit Encryption',
      'Over 40 Hours of Onboard Memory Recording',
      'Universal 3.5mm TRS Output and USB-C Digital Audio'
    ],
    items: ['2 × Transmitters (TX)', '1 × Receiver (RX)', '3 × USB-C Cables', '3 × Furry Windshields', 'Carry Pouch'],
    tag: 'Pro Audio',
    discount: '16% OFF',
  },
  {
    id: 'digitek-dtr-550-tripod',
    name: 'Digitek DTR 550 LW Tripod',
    category: 'Accessories',
    productType: 'individual',
    isBundle: false,
    price: 1999,
    originalPrice: 2499,
    stock: 4,
    image: '/tripod.jpg',
    images: [{ src: '/tripod.jpg' }, { src: '/tripod1.png' }, { src: '/tripod2.png' }],
    description: 'Heavy-duty lightweight aluminum tripod with 3-way panhead, bubble level, and quick release plate. Extends up to 5.57 feet for rock-solid video stabilization.',
    features: [
      '3-Way Smooth Pan Head with Bubble Level',
      'Quick-Release Plate with Standard 1/4" Screw',
      'Multipurpose Head for DV Cameras and Smartphones',
      'Extends to 170cm (5.57 ft) Height'
    ],
    items: ['Tripod Stand', 'Quick Release Plate', 'Smartphone Holder', 'Carry Bag'],
    tag: 'Best Stability',
    discount: '20% OFF',
  },
  {
    id: 'green-screen-backdrop',
    name: 'Green Screen Backdrop',
    category: 'Accessories',
    productType: 'individual',
    isBundle: false,
    price: 799,
    originalPrice: 1299,
    stock: 64,
    image: '/chorma.jpg',
    images: [{ src: '/chorma.jpg' }, { src: '/chorma1.png' }, { src: '/chorma2.png' }],
    description: 'High-density chroma key green screen cloth designed for streaming overlays, background removal, and virtual studio sets. Washable, wrinkle-resistant, and non-reflective.',
    features: [
      'Non-Reflective Matte Finish for Clean Keying',
      'High-Density 100% Pure Muslin Polyester',
      'Seamless One-Piece Design with Rod Pocket',
      'Machine Washable and Fade-Resistant'
    ],
    items: ['Green Screen Cloth (9x6 ft)', 'Heavy Duty Spring Clamps (4pcs)'],
    tag: 'Essential',
    discount: '38% OFF',
  },
  {
    id: 'rode-wireless-go-2',
    name: 'Creators Studio Gear',
    category: 'Lighting',
    productType: 'thumbnail-bundle',
    isBundle: false,
    isFeaturedHero: true,
    price: 3999,
    originalPrice: 4999,
    discount: '17% OFF',
    stock: 50,
    rating: 4.8,
    reviewsCount: 120,
    soldCount: '1k+',
    image: '/ring5.png',
    images: [
      {
        src: '/ring5.png',
        title: 'Ring Light',
        subtitle: 'Professional 18 inch Ring Light with Desk Mount & Stand',
        description: 'Achieve flawless, studio-quality illumination with adjustable brightness and color temperature. Perfect for eliminating shadows and glowing on camera.',
        price: 2499,
        originalPrice: 3499,
      },
      {
        src: '/tripod6.png',
        title: 'Tripod',
        subtitle: 'Professional Aluminum Tripod Stand for Cameras & Mobiles',
        description: 'Engineered for ultimate stability. Keep your shots rock-solid and level during long streams, outdoor vlogging, and cinematic pans.',
        price: 1999,
        originalPrice: 2499,
      },
      {
        src: '/chorma2.png',
        title: 'Chroma Green',
        subtitle: 'Portable Wrinkle-Resistant Green Screen Backdrop',
        description: 'Instant background removal and replacement. Set up your virtual studio anywhere in seconds with this high-grade matte green fabric.',
        price: 799,
        originalPrice: 1299,
      },
      {
        src: '/wireless-mic4.png',
        title: 'Wireless Mic',
        subtitle: 'Dual Channel Wireless Microphone System for Creators, Vloggers & Filmmakers',
        description: 'Capture professional, studio-quality audio with the Creators Kit wireless condenser microphone. Perfect for YouTubers, podcasters, and mobile creators.',
        price: 24999,
        originalPrice: 29999,
      },
    ],
    features: [
      'Dual Channel Wireless System for Simultaneous Recording',
      '200m Stable Digital Transmission Range',
      'Up to 7 Hours Continuous Battery Life',
      'Compact & Ultra-Lightweight Pocket Form Factor',
    ],
    items: ['Ring Light', 'Tripod Stand', 'Chroma Green Screen', 'Wireless Mic Transmitter & Receiver'],
    tag: 'Featured Gear',
  },
];

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');
    const typeParam = searchParams.get('type');
    const searchParam = searchParams.get('search');

    let products = await Product.find({}).sort({ createdAt: -1 });

    // Seed database with any missing core catalog items
    const existingIds = new Set(products.map((p) => p.id));
    const itemsToSeed = initialSeedData.filter((s) => !existingIds.has(s.id));
    if (itemsToSeed.length > 0) {
      await Product.insertMany(itemsToSeed);
      products = await Product.find({}).sort({ createdAt: -1 });
    }

    // Auto-migrate legacy database records to have correct productType
    await Promise.all([
      Product.updateMany(
        { $or: [{ id: 'rode-wireless-go-2' }, { isFeaturedHero: true }] },
        { $set: { productType: 'thumbnail-bundle', isBundle: false } }
      ),
      Product.updateMany(
        { isBundle: true, productType: { $ne: 'bundle' } },
        { $set: { productType: 'bundle' } }
      ),
    ]);

    // Re-fetch if migration occurred
    products = await Product.find({}).sort({ createdAt: -1 });

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
            src: im.src || body.image || '/pro1.png',
            title: im.title || '',
            subtitle: im.subtitle || '',
            description: im.description || '',
            price: im.price !== undefined && im.price !== '' ? Number(im.price) : undefined,
            originalPrice: im.originalPrice !== undefined && im.originalPrice !== '' ? Number(im.originalPrice) : undefined,
          };
        })
      : [{ src: body.image || '/pro1.png', title: body.name || '', subtitle: '', description: '' }];

    const cleanedBonusMasterclasses = Array.isArray(body.bonusMasterclasses) && body.bonusMasterclasses.length > 0
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
      productType,
      isBundle,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      image: parsedImages[0]?.src || body.image || '/pro1.png',
      images: parsedImages,
      includeBonusCourses: body.includeBonusCourses !== undefined ? Boolean(body.includeBonusCourses) : true,
      ...(cleanedBonusMasterclasses ? { bonusMasterclasses: cleanedBonusMasterclasses } : {}),
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
