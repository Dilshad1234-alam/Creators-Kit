'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  ShoppingCartPlus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Search,
  X,
  ShoppingBag,
  Sparkles,
  Zap,
  Flame,
  Gift
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/lib/imagekit';
import BuiltForCreators from '@/components/BuiltForCreators';
import WhatCreatorsSay from '@/components/WhatCreatorsSay';

// Pro Creator Bundle Hero Data (Matching Reference Screenshot 2)
const proCreatorBundleHero = {
  id: 'pro-creator-kit',
  name: 'Creator Bundle Kits',
  badge: 'LIMITED-TIME BUNDLE OFFER',
  subtitle: 'Your complete setup. One powerful bundle.',
  rating: 4.8,
  reviewsCount: 120,
  price: 3999,
  originalPrice: 4999,
  savings: 1000,
  savingsPercent: 20,
  images: [
    { src: '/pro1.png', alt: 'Creator Bundle Kits Complete Studio Setup' },
    { src: '/ring5.png', alt: '18-inch Professional LED Ring Light' },
    { src: '/chorma2.png', alt: 'Chroma Key Green Screen Backdrop' },
    { src: '/wireless-mic4.png', alt: 'Dual-Channel Wireless Studio Mic' },
    { src: '/tripod6.png', alt: 'Heavy-Duty Aluminum Camera & Mobile Tripod' },
  ],
  whatsInTheBundle: [
    {
      name: '18-inch Ring Light',
      type: 'ring',
    },
    {
      name: 'Adjustable Tripod',
      type: 'tripod',
    },
    {
      name: 'Wireless Microphone',
      type: 'mic',
    },
    {
      name: 'Green Screen Backdrop',
      type: 'backdrop',
    },
  ],
  masterclasses: [
    {
      id: 'instagram-mastery',
      title: 'Instagram Mastery',
      image: '/video 2.webp',
    },
    {
      id: 'youtube-mastery',
      title: 'YouTube Mastery',
      image: '/video 1.webp',
    },
    {
      id: 'filmora-mastery',
      title: 'Filmora Mastery',
      image: '/video.webp',
    },
  ],
};

// Standard fallback catalog for individual products
const fallbackCatalog = [
  {
    id: 'ring-light-18',
    slug: 'ring-light-18',
    name: '18-Inch Professional Studio Ring Light',
    subheading: 'Adjustable Bi-Color Lighting with Heavy Desk Mount',
    category: 'Ring Lights',
    tag: 'BESTSELLER',
    price: 3999,
    mrp: 4995,
    rating: 4.8,
    reviewsCount: 140,
    image: '/ring5.png',
    stock: 12,
    productType: 'individual',
    description: 'Achieve studio-grade illumination with 3200K-5600K color temperature and flicker-free dimming.',
  },
  {
    id: 'tripod',
    slug: 'tripod',
    name: 'Heavy-Duty Aluminum Camera & Mobile Tripod',
    subheading: '3-Way Fluid Pan Head with Quick-Release Plate',
    category: 'Tripods & Stands',
    tag: 'TOP RATED',
    price: 999,
    mrp: 1299,
    rating: 4.8,
    reviewsCount: 120,
    image: '/tripod6.png',
    stock: 15,
    productType: 'individual',
    description: 'Rock-solid 170cm height extension with smooth 360-degree panning for horizontal & vertical shooting.',
  },
  {
    id: 'wireless-studio-mic',
    slug: 'wireless-studio-mic',
    name: 'Dual-Channel Wireless Studio Microphone System',
    subheading: '2.4GHz Ultra-Low Latency with AI Noise Cancellation',
    category: 'Wireless Mics',
    tag: 'TRENDING',
    price: 999,
    mrp: 1499,
    rating: 4.8,
    reviewsCount: 120,
    image: '/wireless-mic4.png',
    stock: 10,
    productType: 'individual',
    description: 'Crystal-clear 48kHz/24-bit broadcast audio for YouTubers, vloggers, reels creators, and podcasters.',
  },
  {
    id: 'green-screen-backdrop',
    slug: 'green-screen-backdrop',
    name: 'Wrinkle-Resistant Chroma Key Green Screen',
    subheading: 'High-Density Studio Fabric with Heavy-Duty Stand',
    category: 'Green Screen',
    tag: 'BESTSELLER',
    price: 899,
    mrp: 1099,
    rating: 4.8,
    reviewsCount: 110,
    image: '/chorma2.png',
    stock: 14,
    productType: 'individual',
    description: 'Pure chroma green non-reflective matte cloth for seamless background replacement in OBS and Premiere.',
  },
  {
    id: 'rode-wireless-go-2',
    slug: 'rode-wireless-go-2',
    name: 'Rode Wireless GO II Dual Mic System',
    subheading: 'Broadcast-Grade Dual Transmitter & Receiver Suite',
    category: 'Wireless Mics',
    tag: 'STUDIO PRO',
    price: 1499,
    mrp: 2199,
    rating: 4.9,
    reviewsCount: 215,
    image: '/wireless-mic2.png',
    stock: 8,
    productType: 'individual',
    description: 'World-renowned wireless audio performance with 200m range and 7-hour battery life.',
  },
  {
    id: 'pro-creator-kit',
    slug: 'pro-creator-kit',
    name: 'Pro Creator Kit (Complete 4-in-1 Studio Suite)',
    subheading: 'Ring Light + Wireless Mic + Tripod + Green Screen + Bag',
    category: 'Creator Bundles',
    tag: 'BEST VALUE',
    price: 9999,
    mrp: 14999,
    rating: 5.0,
    reviewsCount: 280,
    image: '/pro1.png',
    stock: 6,
    productType: 'bundle',
    isBundle: true,
    description: 'The complete creator powerhouse. Everything you need to produce cinematic content from day one.',
  },
  {
    id: 'basic-creator-kit',
    slug: 'basic-creator-kit',
    name: 'Basic Creator Kit (Starter Suite)',
    subheading: '18" Ring Light + Adjustable Aluminum Tripod Stand',
    category: 'Creator Bundles',
    tag: 'STARTER PACK',
    price: 4999,
    mrp: 6999,
    rating: 4.9,
    reviewsCount: 310,
    image: '/pro.png',
    stock: 9,
    productType: 'bundle',
    isBundle: true,
    description: 'Essential lighting and stable mounting setup designed for beginner creators and unboxing channels.',
  },
  {
    id: 'ultimate-creator-kit',
    slug: 'ultimate-creator-kit',
    name: 'Ultimate Creator Studio Suite',
    subheading: 'Dual RGB LED Panels + Boom Arm + Condenser Mic + Tripod',
    category: 'Creator Bundles',
    tag: 'NEW ARRIVAL',
    price: 14999,
    mrp: 19999,
    rating: 5.0,
    reviewsCount: 195,
    image: '/pro2.png',
    stock: 5,
    productType: 'bundle',
    isBundle: true,
    description: 'Maximum production value for top gaming streamers, podcasts, and video production houses.',
  },
  {
    id: 'ring-light-desk-compact',
    slug: 'ring-light-desk-compact',
    name: 'Compact 10" RGB Desktop Ring Light',
    subheading: 'Multi-Color RGB Modes with 360 Ball Head',
    category: 'Ring Lights',
    tag: 'HOT DEAL',
    price: 799,
    mrp: 1199,
    rating: 4.7,
    reviewsCount: 95,
    image: '/ring1.png',
    stock: 20,
    productType: 'individual',
    description: 'Vibrant RGB lighting with 26 color modes, USB powered, ideal for streaming and makeup tutorials.',
  },
  {
    id: 'overhead-boom-arm-tripod',
    slug: 'overhead-boom-arm-tripod',
    name: 'Overhead 2-in-1 Boom Arm & Floor Tripod',
    subheading: 'Horizontal 90-Degree Cross-Arm for Flatlay Shoots',
    category: 'Tripods & Stands',
    tag: 'CREATOR PICK',
    price: 1299,
    mrp: 1799,
    rating: 4.8,
    reviewsCount: 88,
    image: '/tripod3.png',
    stock: 11,
    productType: 'individual',
    description: 'Engineered for overhead unboxings, cooking videos, art tutorials, and table-top photography.',
  },
];

export default function ProductPage() {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();

  // State management
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [addedMap, setAddedMap] = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  // Hero Section State (Pro Creator Bundle)
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [heroQuantity, setHeroQuantity] = useState(1);
  const [heroBundleAdded, setHeroBundleAdded] = useState(false);

  // Load products from API with fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchStoreCatalog() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json.data) && json.data.length > 0) {
            const formatted = json.data.map((p) => {
              const priceVal = typeof p.price === 'number' ? p.price : Number(p.price) || 999;
              const mrpVal = p.originalPrice || Math.round(priceVal * 1.3);
              return {
                id: p.id || p._id,
                _id: p._id,
                name: p.name || 'Creator Gear',
                subheading: p.subheading || p.subtitle || '',
                description: p.description || '',
                category: p.category || (p.isBundle ? 'Creator Bundles' : 'Accessories'),
                tag: p.tag || (p.isBundle ? 'BEST VALUE' : 'BESTSELLER'),
                price: priceVal,
                mrp: mrpVal,
                rating: Number(p.rating) || 4.8,
                reviewsCount: Number(p.reviewsCount) || 120,
                image: p.image || (Array.isArray(p.images) && p.images[0]?.src) || '/pro1.png',
                stock: p.stock !== undefined ? Number(p.stock) : 10,
                isBundle: Boolean(p.isBundle || p.productType === 'bundle'),
                productType: p.productType || (p.isBundle ? 'bundle' : 'individual'),
              };
            });
            setProductsList(formatted);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load store catalog, using fallback:', err);
      }
      if (isMounted) {
        setProductsList(fallbackCatalog);
        setLoading(false);
      }
    }
    fetchStoreCatalog();
    return () => { isMounted = false; };
  }, []);

  // Hero Bundle Actions
  const handleBuyHeroBundle = () => {
    buyNow({
      id: proCreatorBundleHero.id,
      name: proCreatorBundleHero.name,
      price: proCreatorBundleHero.price,
      quantity: heroQuantity,
      img: proCreatorBundleHero.images[0].src,
      image: proCreatorBundleHero.images[0].src,
    }, '/checkout');
  };

  const handleAddToCartHeroBundle = () => {
    const ok = addToCart({
      id: proCreatorBundleHero.id,
      name: proCreatorBundleHero.name,
      price: proCreatorBundleHero.price,
      quantity: heroQuantity,
      img: proCreatorBundleHero.images[0].src,
      image: proCreatorBundleHero.images[0].src,
    });
    if (ok) {
      setHeroBundleAdded(true);
      setTimeout(() => setHeroBundleAdded(false), 2000);
    }
  };

  // Grid Product Actions
  const handleAddToCartProduct = useCallback((productItem) => {
    const priceVal = typeof productItem.price === 'number' ? productItem.price : Number(productItem.price) || 0;
    const ok = addToCart({
      id: String(productItem.id || productItem._id),
      name: productItem.name,
      price: priceVal,
      quantity: 1,
      img: productItem.image,
      image: productItem.image,
    });
    if (ok) {
      const pid = String(productItem.id || productItem._id);
      setAddedMap((prev) => ({ ...prev, [pid]: true }));
      setTimeout(() => {
        setAddedMap((prev) => ({ ...prev, [pid]: false }));
      }, 1800);
    }
  }, [addToCart]);

  const handleBuyNowProduct = useCallback((productItem) => {
    const priceVal = typeof productItem.price === 'number' ? productItem.price : Number(productItem.price) || 0;
    buyNow({
      id: String(productItem.id || productItem._id),
      name: productItem.name,
      price: priceVal,
      quantity: 1,
      img: productItem.image,
      image: productItem.image,
    }, '/checkout');
  }, [buyNow]);

  // Categories list with dynamic counters
  const categoriesList = useMemo(() => {
    const counts = {
      all: productsList.length,
      bundles: 0,
      ringLights: 0,
      mics: 0,
      tripods: 0,
      greenScreen: 0,
    };

    productsList.forEach((p) => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const isBun = p.isBundle || p.productType === 'bundle' || p.productType === 'thumbnail-bundle' || cat.includes('bundle') || name.includes('bundle') || name.includes('kit');
      const isRing = cat.includes('ring') || cat.includes('light') || name.includes('ring') || name.includes('light');
      const isMic = cat.includes('mic') || cat.includes('audio') || name.includes('mic') || name.includes('audio');
      const isTripod = cat.includes('tripod') || cat.includes('stand') || name.includes('tripod') || name.includes('stand');
      const isGreen = cat.includes('green') || cat.includes('chroma') || cat.includes('backdrop') || name.includes('green') || name.includes('chroma');

      if (isBun) counts.bundles += 1;
      if (isRing && !isBun) counts.ringLights += 1;
      if (isMic && !isBun) counts.mics += 1;
      if (isTripod && !isBun) counts.tripods += 1;
      if (isGreen && !isBun) counts.greenScreen += 1;
    });

    return [
      { id: 'all', name: 'All Gear', count: counts.all },
      { id: 'bundles', name: 'Creator Bundles', count: counts.bundles },
      { id: 'ring-lights', name: 'Ring Lights', count: counts.ringLights },
      { id: 'wireless-mics', name: 'Wireless Mics', count: counts.mics },
      { id: 'tripods', name: 'Tripods & Stands', count: counts.tripods },
      { id: 'green-screen', name: 'Green Screen', count: counts.greenScreen },
    ];
  }, [productsList]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (activeCategory !== 'all') {
      result = result.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        if (activeCategory === 'bundles') {
          return p.isBundle || p.productType === 'bundle' || p.productType === 'thumbnail-bundle' || cat.includes('bundle') || name.includes('bundle') || name.includes('kit');
        }
        if (activeCategory === 'ring-lights') {
          return (cat.includes('ring') || cat.includes('light') || name.includes('ring') || name.includes('light')) && !p.isBundle;
        }
        if (activeCategory === 'wireless-mics') {
          return (cat.includes('mic') || cat.includes('audio') || name.includes('mic') || name.includes('audio')) && !p.isBundle;
        }
        if (activeCategory === 'tripods') {
          return (cat.includes('tripod') || cat.includes('stand') || name.includes('tripod') || name.includes('stand')) && !p.isBundle;
        }
        if (activeCategory === 'green-screen') {
          return (cat.includes('green') || cat.includes('chroma') || cat.includes('backdrop') || name.includes('green') || name.includes('chroma')) && !p.isBundle;
        }
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.subheading?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0;
        const discB = b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0;
        return discB - discA;
      });
    }

    return result;
  }, [productsList, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-[#111827] font-sans selection:bg-[#900606] selection:text-white ">
      <main className="w-full pt-[96px] sm:pt-[116px]">

        {/* ========================================================================= */}
        {/* 1. HERO SECTION (PRO CREATOR BUNDLE - MATCHING REFERENCE SCREENSHOT 2)    */}
        {/* ========================================================================= */}
        <section className="w-full pt-1 sm:pt-2 pb-1.5 sm:pb-2 bg-[#FBFBF7]">
          <div className="w-full px-3.5 sm:px-6 md:px-8 lg:px-10">

            {/* Grid Layout: Left Gallery + Right Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 lg:items-stretch w-full">

              {/* LEFT: VERTICAL THUMBNAILS + MAIN SHOWCASE CARD */}
              <div className="lg:col-span-7 flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch w-full h-full">

                {/* Vertical Thumbnails */}
                <div className="flex md:flex-col gap-2 sm:gap-2.5 order-2 md:order-1 overflow-x-auto md:overflow-visible no-scrollbar pb-1 md:pb-0 shrink-0 w-full md:w-20 lg:w-22 xl:w-24">
                  {proCreatorBundleHero.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setHeroImageIdx(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 rounded-2xl overflow-hidden border-2 bg-white flex items-center justify-center shrink-0 transition-all cursor-pointer ${heroImageIdx === idx
                        ? 'border-[#900606] shadow-sm ring-2 ring-[#900606]/20'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={getImageUrl(img.src)}
                        alt={img.alt}
                        fill
                        sizes="112px"
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Showcase Image Card - Stretches full height to align bottom with right column */}
                <div className="relative flex-1 min-w-0 w-full h-full min-h-[460px] sm:min-h-[500px] lg:min-h-0 rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden order-1 md:order-2 flex items-center justify-center">

                  {/* BEST VALUE Badge */}
                  <span className="absolute top-4 left-4 z-20 bg-[#900606] text-white text-[10px] sm:text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                    BEST VALUE
                  </span>

                  {/* Navigation Arrows */}
                  <button
                    type="button"
                    onClick={() => setHeroImageIdx((prev) => (prev - 1 + proCreatorBundleHero.images.length) % proCreatorBundleHero.images.length)}
                    aria-label="Previous image"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroImageIdx((prev) => (prev + 1) % proCreatorBundleHero.images.length)}
                    aria-label="Next image"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Main Image Display: zero padding, proper full display */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <Image
                      src={getImageUrl(proCreatorBundleHero.images[heroImageIdx].src)}
                      alt={proCreatorBundleHero.images[heroImageIdx].alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className={`${heroImageIdx === 0 ? 'object-cover object-center' : 'object-contain object-center p-4 sm:p-6'} select-none transition-all duration-300`}
                      priority
                    />
                  </div>

                  {/* Carousel Pagination Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {proCreatorBundleHero.images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHeroImageIdx(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${heroImageIdx === idx ? 'w-5 bg-[#900606]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                          }`}
                      />
                    ))}
                  </div>

                </div>

              </div>

              {/* RIGHT: DETAILS, BUNDLE BREAKDOWN, MASTERCLASSES, BUY ACTIONS */}
              <div className="lg:col-span-5 flex flex-col justify-start">

                {/* LIMITED-TIME BUNDLE OFFER Badge */}
                <div>
                  <span className="inline-block bg-[#900606] text-white text-[11px] font-extrabold px-3 py-1 rounded shadow-2xs uppercase tracking-wider mb-2">
                    {proCreatorBundleHero.badge}
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight leading-tight">
                    Creator <span className="text-[#900606] whitespace-nowrap">Bundle Kits</span>
                  </h1>

                  <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal mt-1.5">
                    {proCreatorBundleHero.subtitle}
                  </p>

                  {/* Ratings & Reviews */}
                  <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="font-bold text-neutral-800">{proCreatorBundleHero.rating}</span>
                    <span className="text-neutral-400">({proCreatorBundleHero.reviewsCount} reviews)</span>
                  </div>

                  {/* Pricing Box */}
                  <div className="mt-3.5 pt-3 border-t border-neutral-200">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-black text-[#900606]">
                        ₹{proCreatorBundleHero.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-lg text-neutral-400 line-through font-normal">
                        ₹{proCreatorBundleHero.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="bg-[#900606] text-white text-[11px] font-black px-2.5 py-0.5 rounded shadow-2xs">
                        SAVE ₹{proCreatorBundleHero.savings.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-normal mt-0.5">
                      Inclusive of all taxes
                    </p>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mt-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>In Stock – Ready to Ship</span>
                    </div>
                  </div>

                  {/* Save Callout Pill (Compact Width) */}
                  <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50/90 border border-red-200/80 text-[#900606] text-xs font-bold w-fit shadow-2xs">
                    <span>🏷</span>
                    <span>Save {proCreatorBundleHero.savingsPercent}% when you buy the complete kit</span>
                  </div>

                  {/* What's in the bundle section */}
                  <div className="mt-3">
                    <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 tracking-tight">
                      What&apos;s in the bundle
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mt-2">
                      {proCreatorBundleHero.whatsInTheBundle.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border border-neutral-200/90 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-2xs hover:border-[#900606] transition-colors"
                        >
                          <div className="h-9 sm:h-10 flex items-center justify-center mb-1">
                            {item.type === 'ring' && (
                              <svg viewBox="0 0 48 48" className="w-7 h-7 sm:w-9 sm:h-9 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="24" cy="18" r="11" strokeWidth="2.5" />
                                <circle cx="24" cy="18" r="6" strokeWidth="1.5" />
                                <path d="M24 29v9M18 43l6-5 6 5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                            {item.type === 'tripod' && (
                              <svg viewBox="0 0 48 48" className="w-7 h-7 sm:w-9 sm:h-9 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="19" y="6" width="10" height="6" rx="1.5" strokeWidth="2" />
                                <path d="M24 12v8M24 20l-9 22M24 20l9 22M24 20v22" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19 33h10" strokeLinecap="round" />
                              </svg>
                            )}
                            {item.type === 'mic' && (
                              <svg viewBox="0 0 48 48" className="w-7 h-7 sm:w-9 sm:h-9 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="16" y="8" width="16" height="23" rx="4" strokeWidth="2" />
                                <circle cx="24" cy="15" r="3" fill="currentColor" />
                                <path d="M20 22h8M22 26h4" strokeLinecap="round" />
                                <path d="M24 31v9M20 40h8" strokeLinecap="round" />
                              </svg>
                            )}
                            {item.type === 'backdrop' && (
                              <svg viewBox="0 0 48 48" className="w-7 h-7 sm:w-9 sm:h-9 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 8h32M10 8v34M38 8v34" strokeLinecap="round" strokeWidth="2" />
                                <rect x="13" y="11" width="22" height="25" rx="2" fill="#22c55e" fillOpacity="0.8" stroke="#16a34a" strokeWidth="1.5" />
                                <path d="M6 42h8M34 42h8" strokeLinecap="round" strokeWidth="2" />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-auto">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">✓</span>
                            <span className="text-[10px] font-bold text-neutral-800 leading-tight text-center">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 Masterclasses. Included FREE. */}
                  <div className="mt-3 rounded-2xl border border-red-200/90 bg-[#FFFBFB] p-2.5 sm:p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-2 flex-wrap gap-1">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs sm:text-sm">
                        <span className="text-base">🎓</span>
                        <span>3 Masterclasses. Included <span className="text-[#900606]">FREE.</span></span>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        Lifetime access with your bundle
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {proCreatorBundleHero.masterclasses.map((c) => (
                        <div key={c.id} className="flex flex-col items-center text-center">
                          <div className="relative w-full h-14 sm:h-16 md:h-18 rounded-xl overflow-hidden bg-white border border-neutral-200/80 p-1 flex items-center justify-center shadow-2xs">
                            <Image
                              src={getImageUrl(c.image)}
                              alt={c.title}
                              fill
                              sizes="120px"
                              className="object-contain"
                            />
                          </div>
                          <span className="font-bold text-[10px] sm:text-xs text-neutral-900 mt-1 line-clamp-1">
                            {c.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row: Quantity + Buy Bundle Now + Add to Cart */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 mt-3 w-full">
                    {/* Buy Bundle Now */}
                    <button
                      type="button"
                      onClick={handleBuyHeroBundle}
                      className="flex-1 py-3 px-3 bg-[#900606] hover:bg-[#780505] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Buy Bundle Now</span>
                      <span>➔</span>
                    </button>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={handleAddToCartHeroBundle}
                      className="px-5 py-3 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-xs sm:text-sm rounded-xl transition shadow-2xs hover:shadow-sm cursor-pointer active:scale-95"
                    >
                      {heroBundleAdded ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>

                  {/* Trust badges row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-neutral-200 mt-3 text-neutral-800">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#900606] shrink-0 stroke-[2]" />
                      <div>
                        <p className="text-[11px] font-bold leading-tight">Free Delivery</p>
                        <p className="text-[10px] text-neutral-400">2–3 days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-[#900606] shrink-0 stroke-[2]" />
                      <div>
                        <p className="text-[11px] font-bold leading-tight">7-Day Returns</p>
                        <p className="text-[10px] text-neutral-400">Easy replacement</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#900606] shrink-0 stroke-[2]" />
                      <div>
                        <p className="text-[11px] font-bold leading-tight">Secure Payment</p>
                        <p className="text-[10px] text-neutral-400">100% safe</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#900606] shrink-0 stroke-[2]" />
                      <div>
                        <p className="text-[11px] font-bold leading-tight">Genuine Products</p>
                        <p className="text-[10px] text-neutral-400">Official warranty</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FEATURED STUDIO PRODUCTS (CATALOG + FILTERS + SEARCH & SORT)           */}
        {/* ========================================================================= */}
        <section id="catalog-section" className="w-full pt-3 sm:pt-4 pb-1 bg-[#FBFBF7] border-t border-neutral-200">
          <div className="w-full px-2.5 sm:px-4 md:px-6 lg:px-8">

            {/* Centered Heading - Matching Popular Creators Bundles Font Style */}
            <div className="flex flex-col items-center text-center mb-3 sm:mb-4 max-w-3xl mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight pb-1">
                Featured <span className="text-[#900606] whitespace-nowrap">Studio Products</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal max-w-xl leading-relaxed mt-1">
                Explore individual creator products and studio tools designed to elevate your content creation.
              </p>
            </div>

            {/* Controls Bar: Category Filter Pills + Search & Sort */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {categoriesList.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${isActive
                        ? 'bg-[#900606] text-white shadow-md ring-2 ring-[#900606]/20'
                        : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/90 hover:border-neutral-300 shadow-2xs'
                        }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                          }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
                <div className="relative min-w-[200px] sm:min-w-[240px] flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search gear (e.g. tripod, mic)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#900606] shadow-2xs text-neutral-900 placeholder:text-neutral-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#900606] text-neutral-800 font-semibold shadow-2xs cursor-pointer"
                >
                  <option value="featured">Featured / Top Sellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. OPTIMIZED PRODUCT GRID (DESKTOP: 5-COLUMN | MOBILE: 2-COLUMN)         */}
        {/* ========================================================================= */}
        <section className="w-full pt-0 pb-8 bg-[#FBFBF7]">
          <div className="w-full px-2.5 sm:px-4 md:px-6 lg:px-8">

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 animate-pulse">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border border-neutral-200 h-80 flex flex-col justify-between">
                    <div className="aspect-square bg-neutral-200 rounded-2xl w-full" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4 mt-3" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2 mt-2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-neutral-900">No matching gear found</h3>
                <p className="text-xs text-neutral-500 mt-1">Try another search term or switch your category filter.</p>
                <button
                  type="button"
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="mt-4 px-5 py-2.5 bg-[#900606] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* ------------------------------------------------------------- */}
                {/* MOBILE VIEW (block md:hidden) - 2-COLUMN FLIPKART/D2C STYLE */}
                {/* ------------------------------------------------------------- */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:hidden w-full">
                  {filteredProducts.map((rel) => {
                    const priceVal = typeof rel.price === 'number' ? rel.price : Number(rel.price) || 0;
                    const mrpVal = rel.mrp ? Number(rel.mrp) : Math.round(priceVal * 1.3);
                    const savePercent = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 25;
                    const ratingVal = Number(rel.rating) || 4.8;
                    const isAdded = addedMap[String(rel.id || rel._id)];

                    return (
                      <div
                        key={rel.id || rel._id}
                        onClick={() => router.push(`/product/${rel.id || rel._id}`)}
                        className="flex flex-col bg-white rounded-2xl p-2.5 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer group justify-between"
                      >
                        <div>
                          {/* Image Container with floating rating and discount badge */}
                          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                            {savePercent > 0 && (
                              <span className="absolute top-1.5 right-1.5 z-10 bg-[#900606] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
                                {savePercent}% OFF
                              </span>
                            )}

                            {/* Floating Rating Pill */}
                            <div className="absolute bottom-1.5 left-1.5 z-10 bg-white/95 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1 border border-neutral-200/70">
                              <span>{ratingVal.toFixed(1)}</span>
                              <span className="text-amber-500 text-[9px]">★</span>
                              <span className="text-neutral-300 text-[9px]">|</span>
                              <span className="text-neutral-500 text-[9px] font-medium">{rel.reviewsCount || 120}</span>
                            </div>

                            <Image
                              src={getImageUrl(rel.image)}
                              alt={rel.name}
                              fill
                              sizes="50vw"
                              className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="pt-2 pb-1">
                            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-[#900606] transition-colors">
                              {rel.name}
                            </h3>
                            <p className="text-[11px] text-neutral-500 font-normal line-clamp-1 mt-0.5">
                              {rel.subheading || rel.description || 'Creator Studio Gear'}
                            </p>

                            {/* Price Row */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                              <span className="font-extrabold text-sm sm:text-base text-[#900606]">
                                ₹{priceVal.toLocaleString('en-IN')}
                              </span>
                              {mrpVal > priceVal && (
                                <span className="text-[10px] text-neutral-400 line-through">
                                  ₹{mrpVal.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex items-center gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyNowProduct(rel);
                            }}
                            className="flex-1 py-2 bg-[#900606] hover:bg-[#780505] text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
                          >
                            Buy Now
                          </button>
                          <button
                            type="button"
                            title="Add to Cart"
                            aria-label="Add to Cart"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCartProduct(rel);
                            }}
                            className="w-8 h-8 flex-shrink-0 bg-white hover:bg-neutral-50 text-[#111827] hover:text-[#900606] border border-neutral-300 hover:border-[#900606] rounded-xl font-bold transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
                          >
                            {isAdded ? (
                              <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in" />
                            ) : (
                              <ShoppingCartPlus className="w-4 h-4 text-[#111827]" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* DESKTOP VIEW (hidden md:grid) - 5-COLUMN BALANCED D2C GRID */}
                {/* ------------------------------------------------------------- */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4 w-full">
                  {filteredProducts.map((rel) => {
                    const priceVal = typeof rel.price === 'number' ? rel.price : Number(rel.price) || 0;
                    const mrpVal = rel.mrp ? Number(rel.mrp) : Math.round(priceVal * 1.3);
                    const savePercent = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 25;
                    const ratingVal = Number(rel.rating) || 4.8;
                    const isAdded = addedMap[String(rel.id || rel._id)];

                    return (
                      <div
                        key={rel.id || rel._id}
                        onClick={() => router.push(`/product/${rel.id || rel._id}`)}
                        className="group flex flex-col bg-white rounded-2xl lg:rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer justify-between"
                      >
                        <div>
                          {/* Product Image Container with Badges */}
                          <div className="relative w-full aspect-square bg-white overflow-hidden flex items-center justify-center group">
                            {/* Promo Tag */}
                            {rel.tag && (
                              <span className="absolute top-2.5 left-2.5 z-10 bg-[#900606] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                                {rel.tag}
                              </span>
                            )}

                            {/* Discount Pill */}
                            {savePercent > 0 && (
                              <span className="absolute top-2.5 right-2.5 z-10 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                                {savePercent}% OFF
                              </span>
                            )}

                            <Image
                              src={getImageUrl(rel.image)}
                              alt={rel.name}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              className="object-cover object-center w-full h-full group-hover:scale-108 transition-transform duration-500 ease-out"
                            />
                          </div>

                          {/* Product Information */}
                          <div className="p-3 sm:p-3.5 pb-1 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#900606] mb-0.5">
                              {rel.category || 'Creator Studio'}
                            </span>

                            <h3 className="font-bold text-[#111827] text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-[#900606] transition-colors">
                              {rel.name}
                            </h3>

                            <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-normal">
                              {rel.subheading || rel.description || 'Professional creator equipment'}
                            </p>

                            {/* Ratings & Reviews */}
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex items-center text-amber-400">
                                {[...Array(5)].map((_, sIdx) => (
                                  <Star
                                    key={sIdx}
                                    className={`w-3 h-3 ${sIdx < Math.round(ratingVal)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-neutral-200 text-neutral-200'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[11px] font-bold text-neutral-800 ml-0.5">
                                {ratingVal.toFixed(1)}
                              </span>
                              <span className="text-[11px] text-neutral-400">
                                ({rel.reviewsCount || 120})
                              </span>
                            </div>

                            {/* Price & Savings */}
                            <div className="mt-1.5 pt-1.5 border-t border-neutral-100 flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-black text-lg sm:text-xl text-[#900606]">
                                ₹{priceVal.toLocaleString('en-IN')}
                              </span>
                              {mrpVal > priceVal && (
                                <span className="text-[11px] text-neutral-400 line-through font-medium">
                                  ₹{mrpVal.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            {/* In Stock & Bonus Badges */}
                            <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-neutral-50 text-neutral-500">
                              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                In Stock
                              </span>
                              <span className="text-[#900606] font-semibold text-[10px]">
                                +3 Free Courses
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Direct Buy Now + Add to Cart */}
                        <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-1 mt-auto flex items-center gap-2 w-full">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyNowProduct(rel);
                            }}
                            className="flex-1 py-2 bg-[#900606] hover:bg-[#780505] text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-[0.98]"
                          >
                            Buy Now
                          </button>
                          <button
                            type="button"
                            title="Add to Cart"
                            aria-label="Add to Cart"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCartProduct(rel);
                            }}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 bg-white hover:bg-neutral-50 text-[#111827] hover:text-[#900606] border border-neutral-300 hover:border-[#900606] rounded-xl font-bold transition-all shadow-2xs flex items-center justify-center cursor-pointer active:scale-95"
                          >
                            {isAdded ? (
                              <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in" />
                            ) : (
                              <ShoppingCartPlus className="w-4 h-4 text-[#111827]" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. POPULAR CREATORS BUNDLES SECTION                                      */}
        {/* ========================================================================= */}
        <BuiltForCreators />

        {/* ========================================================================= */}
        {/* 4.5 WHAT CREATORS SAY TESTIMONIALS SECTION                                */}
        {/* ========================================================================= */}
        <WhatCreatorsSay />

        {/* ========================================================================= */}
        {/* 5. STORE FAQ REASSURANCE SECTION                                         */}
        {/* ========================================================================= */}
        <section className="w-full pt-2.5 pb-3 sm:pt-3.5 sm:pb-4 border-t border-neutral-200/70 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 max-w-5xl mx-auto">
            <div className="text-center mb-2.5 sm:mb-3.5">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
                Frequently Asked <span className="text-[#900606] whitespace-nowrap">Questions</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal max-w-xl mx-auto mt-1">
                Everything you need to know about compatibility, shipping, and warranty.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Are Creators Kit gear compatible with smartphones & DSLRs?',
                  a: 'Yes! All our tripods, ring lights, and microphones include universal mounts and adapters compatible with Android phones, iPhones, DSLRs, mirrorless cameras, and laptops.'
                },
                {
                  q: 'How long does delivery take across India?',
                  a: 'We provide Free Express Delivery. Orders are dispatched from our Delhi warehouse within 24 hours, with typical doorstep delivery taking 2 to 3 business days.'
                },
                {
                  q: 'How do I claim the 7-day replacement or 1-year warranty?',
                  a: 'Simply message our WhatsApp support or email support@creatorskit.in with your Order ID. Defective or transit-damaged items receive instant no-questions-asked replacements.'
                },
                {
                  q: 'How do I access the 3 Free Masterclasses (Worth ₹4,999)?',
                  a: 'Upon ordering, the Instagram, YouTube, and Video Editing Masterclasses are automatically activated inside your Creators Kit account under the "My Courses" tab.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-neutral-900 hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <span className="pr-3 leading-snug">{faq.q}</span>
                    <span className="text-lg text-neutral-400 font-bold ml-auto shrink-0">
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-[#FAF9F5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="w-full my-2 sm:my-5 overflow-hidden bg-[#0A2212]">
          <div className="w-full relative h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] lg:h-[440px] xl:h-[570px]">
            <Image
              src={getImageUrl('/img-kit10.png')}
              alt="Shop More, Save More - Creator Sale"
              fill
              sizes="100vw"
              priority
              className="object-cover object-[center_35%] w-full h-full block"
            />
          </div>
        </section>

      </main>
    </div>
  );
}
