'use client';

import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const defaultBonusMasterclasses = [
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

export default function BundleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bundleId = params?.id || 'pro-creator-kit';
  const { addToCart, buyNow } = useCart();

  const [mounted, setMounted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fallback Bundle Data
  const fallbackBundles = {
    'pro-creator-kit': {
      id: 'pro-creator-kit',
      name: 'Pro Creator Kit',
      category: 'Creator bundles',
      tag: 'Most Popular',
      price: 9999,
      originalPrice: 14999,
      discount: '33% OFF',
      rating: 5.0,
      reviews: '2,800+ Creator Reviews',
      stock: 42,
      image: '/pro1.png',
      images: ['/pro1.png', '/pro.png', '/pro2.png'],
      description: 'The all-in-one studio bundle engineered for professional YouTubers, streamers, and podcast hosts. Includes high-performance lighting, crystal-clear dual wireless audio, stable tripod support, and chroma key backdrop.',
      features: [
        'Rode Wireless GO II Dual Mic System',
        '18-inch High-CRI LED Ring Light',
        'Heavy-Duty Aluminum Camera & Phone Tripod',
        'Wrinkle-Resistant Green Screen Backdrop with Stand',
        'All-Weather Reinforced Equipment Travel Bag',
      ],
      items: [
        'Rode Wireless GO II Transmitter & Receiver',
        '18" Dimmable Bi-Color LED Ring Light',
        'Adjustable 6ft Heavy Duty Tripod Stand',
        'High-Grade Chroma Key Green Screen (9x6 ft)',
        'Deluxe Padded Equipment Carry Bag',
      ],
      includeBonusCourses: true,
      bonusMasterclasses: defaultBonusMasterclasses,
    },
    'basic-creator-kit': {
      id: 'basic-creator-kit',
      name: 'Basic Creator Kit',
      category: 'Creator bundles',
      tag: 'Best Seller',
      price: 4999,
      originalPrice: 6999,
      discount: '28% OFF',
      rating: 4.9,
      reviews: '3,150+ Creator Reviews',
      stock: 35,
      image: '/pro.png',
      images: ['/pro.png', '/ring.jpg', '/tripod.jpg'],
      description: 'The foundational setup every aspiring creator needs. Clean lighting, directional audio, and solid tripod mounting to produce crisp videos right out of the box.',
      features: [
        'Ring Light 18" with Phone Mount',
        'Adjustable Aluminum Tripod Stand',
        'Wireless Lapel Microphone',
        'Universal Smartphone Grip',
        'Zippered Gear Carry Pouch',
      ],
      items: [
        '18" Ring Light with Flexible Mount',
        'Sturdy Aluminum Tripod Stand',
        'Plug & Play Wireless Lapel Mic',
        '360° Rotating Smartphone Holder',
        'Lightweight Travel Pouch',
      ],
      includeBonusCourses: true,
      bonusMasterclasses: defaultBonusMasterclasses,
    },
    'ultimate-creator-kit': {
      id: 'ultimate-creator-kit',
      name: 'Ultimate Creator Kit',
      category: 'Creator bundles',
      tag: 'New Arrival',
      price: 14999,
      originalPrice: 24999,
      discount: '40% OFF',
      rating: 5.0,
      reviews: '1,950+ Creator Reviews',
      stock: 20,
      image: '/pro2.png',
      images: ['/pro2.png', '/pro1.png'],
      description: 'Our flagship commercial creation kit with dual RGB lighting panels, boom arm, broadcast microphones, and premium motorized slider.',
      features: [
        'Dual Bi-Color LED RGB Light Panels',
        'Broadcast Boom Arm & Condenser Mic',
        'Professional Carbon Fiber Tripod',
        'Ultra-Wide Studio Chroma Key Curtain',
        'Hard Shell Travel Equipment Case',
      ],
      items: [
        '2 × Studio LED RGB Panels with Light Stands',
        'Broadcast Mic with Heavy-Duty Boom Arm',
        'Carbon Fiber Professional Tripod',
        'Studio Grade Green Screen Backdrop',
        'Shockproof Hard Equipment Case',
      ],
      includeBonusCourses: true,
      bonusMasterclasses: defaultBonusMasterclasses,
    },
  };

  const defaultBundle = fallbackBundles[bundleId] || fallbackBundles['pro-creator-kit'];
  const [bundle, setBundle] = useState(defaultBundle);

  // Dynamic database fetch
  useEffect(() => {
    async function loadBundle() {
      try {
        const res = await fetch(`/api/bundles/${bundleId}`);
        if (res.ok) {
          const json = await res.json();
          const b = json.data;
          if (b) {
            const priceVal = typeof b.price === 'number' ? b.price : Number(b.price) || 0;
            const origVal = b.originalPrice ? Number(b.originalPrice) : Math.round(priceVal * 1.35);
            let discountStr = b.discount || '';
            if (!discountStr && origVal > priceVal) {
              discountStr = `${Math.round(((origVal - priceVal) / origVal) * 100)}% OFF`;
            }

            let imgList = [];
            if (Array.isArray(b.images) && b.images.length > 0) {
              imgList = b.images
                .map((im) => (typeof im === 'string' ? im : im?.src || b.image))
                .filter(Boolean);
            }
            if (b.image && !imgList.includes(b.image)) {
              imgList = [b.image, ...imgList];
            }
            if (imgList.length === 0) {
              imgList = [b.image || '/pro1.png'];
            }

            const rawItems = (Array.isArray(b.items) && b.items.length > 0)
              ? b.items
              : ((Array.isArray(b.whatsInTheBox) && b.whatsInTheBox.length > 0)
                  ? b.whatsInTheBox.map((w) => typeof w === 'string' ? w : w.name).filter(Boolean)
                  : (Array.isArray(b.features) && b.features.length > 0 ? b.features : []));

            setBundle({
              id: b.id || b._id,
              _id: b._id,
              name: b.name,
              subheading: b.subheading || '',
              category: b.category || 'Creator bundles',
              tag: b.tag || 'Popular Bundle',
              price: priceVal,
              originalPrice: origVal,
              discount: discountStr || '30% OFF',
              rating: 5.0,
              reviews: '2,500+ Creator Reviews',
              stock: b.stock || 20,
              image: b.image || imgList[0] || '/pro1.png',
              images: imgList,
              description: b.description || 'All-in-one complete creator studio kit for YouTube and podcasts.',
              features: Array.isArray(b.features) && b.features.length > 0 ? b.features : [],
              items: rawItems,
              includeBonusCourses: b.includeBonusCourses !== undefined ? b.includeBonusCourses : true,
              bonusMasterclasses: Array.isArray(b.bonusMasterclasses) && b.bonusMasterclasses.length > 0
                ? b.bonusMasterclasses
                : defaultBonusMasterclasses,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load bundle details:', err);
      }
    }

    if (bundleId) {
      loadBundle();
    }
  }, [bundleId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeBonusCourses = (
    Array.isArray(bundle.bonusMasterclasses) && bundle.bonusMasterclasses.length > 0
      ? bundle.bonusMasterclasses
      : defaultBonusMasterclasses
  )
    .filter((c) => c.active !== false)
    .map((c) => {
      let img = c.image;
      const isLegacyOrBroken =
        !img ||
        img.includes('banner') ||
        img.includes('placeholder') ||
        img.includes('circle');
      if (isLegacyOrBroken) {
        const idLower = (c.id || c.title || '').toLowerCase();
        if (idLower.includes('insta')) img = '/video 2.webp';
        else if (idLower.includes('you')) img = '/video 1.webp';
        else if (idLower.includes('film')) img = '/video.webp';
        else img = '/video.webp';
      }
      return { ...c, image: img };
    });

  const totalBonusValue = activeBonusCourses.reduce(
    (acc, c) => acc + (Number(c.originalPrice) || 0),
    0
  );

  const shouldShowBonus = bundle.includeBonusCourses !== false && activeBonusCourses.length > 0;

  const activeImages = bundle.images && bundle.images.length > 0 ? bundle.images : [bundle.image];
  const activeImage = activeImages[selectedImageIndex] || activeImages[0];

  const handleAddToCart = () => {
    addToCart({
      id: `${bundle.id || bundle._id}`,
      name: bundle.name,
      price: bundle.price,
      quantity: 1,
      img: activeImage,
      image: activeImage,
    });
    router.push('/cart');
  };

  const handleBuyNow = () => {
    buyNow({
      id: `${bundle.id || bundle._id}`,
      name: bundle.name,
      price: bundle.price,
      quantity: 1,
      img: activeImage,
      image: activeImage,
    });

    const rawUser = typeof window !== 'undefined' ? localStorage.getItem('creatorsKitUserInfo') : null;
    const sessionEmail = typeof window !== 'undefined' ? (sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail')) : null;
    const userRole = typeof window !== 'undefined' ? (sessionStorage.getItem('userRole') || localStorage.getItem('userRole')) : null;
    let user = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser);
      } catch (e) {}
    }
    const isLoggedIn = (user?.email || sessionEmail) && userRole !== 'admin' && user?.role !== 'admin';

    if (!isLoggedIn) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-[#111827] font-sans pt-28 pb-16">
      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 shadow-2xs transition-colors cursor-pointer"
          >
            <span>←</span> Back
          </button>
          <div className="text-xs text-neutral-400 font-medium hidden sm:block">
            Home / Creator Bundles / <span className="text-neutral-700 font-bold">{bundle.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
            
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 shrink-0 overflow-x-auto sm:overflow-visible">
              {activeImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 transition-all shrink-0 bg-white flex items-center justify-center overflow-hidden cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#900606] shadow-md ring-2 ring-[#900606]/20'
                      : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={getImageUrl(src)}
                    alt={`${bundle.name} angle ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Main Showcase Image */}
            <div className="relative flex-1 aspect-square rounded-[2rem] bg-white border border-neutral-200 shadow-sm overflow-hidden flex items-center justify-center">
              {/* Badges */}
              <div className="absolute top-5 left-5 flex gap-2 z-20">
                <span className="bg-[#900606] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md uppercase">
                  {bundle.tag || 'CREATOR BUNDLE'}
                </span>
              </div>

              <Image
                src={getImageUrl(activeImage)}
                alt={bundle.name}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
                priority
              />
            </div>

          </div>

          {/* RIGHT: Bundle Details & Order Actions */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#900606]">
                {bundle.subheading || 'All-In-One Studio Kit'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-1">
                {bundle.name}
              </h1>
              <p className="text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
                {bundle.description}
              </p>
            </div>

            {/* Reviews & Social Proof */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                {'★'.repeat(5)}
              </div>
              <span className="text-xs font-bold text-neutral-700">{bundle.reviews}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified Creator Gear
              </span>
            </div>

            {/* Pricing Card */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-5 flex items-baseline justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-1">Bundle Special Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#900606]">
                    ₹{bundle.price.toLocaleString('en-IN')}
                  </span>
                  {bundle.originalPrice && (
                    <span className="text-base text-neutral-400 line-through font-medium">
                      MRP ₹{bundle.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">Includes GST & free insured shipping</span>
              </div>
            </div>

            {/* What's in the Bundle */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs space-y-3">
              <h3 className="font-extrabold text-[#111827] text-base flex items-center gap-2">
                <span>📦</span> What&apos;s Included in this Bundle Kit:
              </h3>
              <ul className="space-y-2.5 pt-1">
                {bundle.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 font-medium">
                    <span className="text-[#900606] font-bold text-base leading-none mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FREE MASTERCLASSES BUNDLE OFFER (DYNAMIC FROM MONGODB / ADMIN) */}
            {shouldShowBonus && (
              <div className="rounded-2xl border-2 border-red-200/90 bg-gradient-to-br from-red-50/70 via-white to-amber-50/30 p-4 sm:p-5 shadow-sm relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#900606] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm">
                    🎁 FREE BUNDLE OFFER
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-[#900606] bg-red-100/90 px-3 py-1 rounded-full border border-red-300 shadow-2xs">
                    Worth ₹{totalBonusValue ? totalBonusValue.toLocaleString('en-IN') : '4,997'} • 100% Free
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-[#111827] tracking-tight">
                  Includes {activeBonusCourses.length === 1 ? 'Masterclass Free' : `${activeBonusCourses.length} Masterclasses Free`}
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  Purchasing this bundle automatically unlocks lifetime access to all courses directly inside your account:
                </p>

                {/* Course Mini Cards */}
                <div className={`grid ${activeBonusCourses.length === 1 ? 'grid-cols-1' : activeBonusCourses.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2 sm:gap-2.5 mt-3.5`}>
                  {activeBonusCourses.map((c) => (
                    <div
                      key={c.id || c.title}
                      className="bg-white rounded-xl p-2.5 border border-red-100 shadow-2xs hover:shadow-md transition-shadow text-center flex flex-col justify-between group"
                    >
                      <div className="w-full h-24 sm:h-28 rounded-lg overflow-hidden relative bg-neutral-50 mb-2 border border-neutral-100 p-1 flex items-center justify-center">
                        <Image
                          src={getImageUrl(c.image || '/video.webp')}
                          alt={c.title}
                          fill
                          sizes="(max-width: 768px) 33vw, 150px"
                          className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="font-bold text-xs sm:text-[12px] text-[#111827] line-clamp-1 group-hover:text-[#900606] transition-colors">
                            {c.title}
                          </h4>
                          <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                            {c.description || c.badge || 'Masterclass'}
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-neutral-100 flex items-center justify-center gap-1.5">
                          {c.originalPrice ? (
                            <span className="text-[10px] text-neutral-400 line-through">
                              ₹{Number(c.originalPrice).toLocaleString('en-IN')}
                            </span>
                          ) : null}
                          <span className="text-[11px] font-black text-emerald-600">
                            100% Free
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instant Access Guarantee */}
                <div className="mt-3.5 pt-3 border-t border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs">
                      ✓
                    </span>
                    <span>Automatically granted to your account on purchase</span>
                  </span>
                  <Link
                    href="/account?tab=courses"
                    className="text-[#900606] font-bold hover:underline shrink-0 inline-flex items-center gap-1 self-end sm:self-auto"
                  >
                    <span>Preview Courses</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="relative flex-1 py-4 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm sm:text-base overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                  🛒 Add Bundle to Cart
                </span>
              </button>

              <button
                onClick={handleBuyNow}
                className="relative flex-1 py-4 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm sm:text-base overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                  ⚡ Buy Now (Instant Checkout)
                </span>
              </button>
            </div>

            {/* Guarantee and Benefits */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200 text-center">
              <div className="p-3 bg-white rounded-xl border border-neutral-100">
                <span className="text-xs font-bold text-neutral-900 block">Fast Free Delivery</span>
                <span className="text-[10px] text-neutral-400">Delivered in 2-4 business days</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-100">
                <span className="text-xs font-bold text-neutral-900 block">7-Day Replacement</span>
                <span className="text-[10px] text-neutral-400">Zero-hassle replacement policy</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-100">
                <span className="text-xs font-bold text-neutral-900 block">1-Year Warranty</span>
                <span className="text-[10px] text-neutral-400">Official manufacturer coverage</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* FREE MASTERCLASSES TRILOGY SHOWCASE (DYNAMICALLY LINKED TO MONGODB / ADMIN) */}
      {shouldShowBonus && (
        <section className="w-full py-12 sm:py-16 bg-white border-t border-neutral-200 mt-16 transition-colors">
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#900606] uppercase mb-2">
                  <span className="w-2.5 h-2.5 bg-[#900606] rounded-xs inline-block"></span>
                  <span>BONUS INCLUDED WITH PURCHASE</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight">
                  Free Masterclasses <span className="text-[#900606] whitespace-nowrap">Bundle</span>
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base font-normal mt-2 max-w-2xl leading-relaxed">
                  Purchasing this product includes {activeBonusCourses.length === 1 ? 'this expert creator course' : `all ${activeBonusCourses.length} expert creator courses`} completely free. Courses are automatically granted to your account upon checkout for lifetime streaming.
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs sm:text-sm border border-emerald-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  + Total ₹{totalBonusValue.toLocaleString('en-IN')} Value • 100% Free
                </span>
              </div>
            </div>

            {/* DYNAMIC CARDS LINKED TO ADMIN PRODUCTS PANEL */}
            <div className={`grid grid-cols-1 ${activeBonusCourses.length === 1 ? 'max-w-md mx-auto' : activeBonusCourses.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'} gap-6 sm:gap-8 mt-8`}>
              {activeBonusCourses.map((course) => (
                <div
                  key={course.id || course.title}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-center items-center group"
                >
                  <div className="w-full h-52 sm:h-56 rounded-2xl bg-neutral-50 overflow-hidden relative mb-5 border border-neutral-200/80 flex items-center justify-center p-3">
                    <Image
                      src={getImageUrl(course.image || '/video.webp')}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div>
                      <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#900606] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-neutral-600 font-normal text-sm leading-relaxed mb-6">
                        {course.description}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-100 flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        {course.originalPrice && (
                          <span className="text-xs line-through text-neutral-400">
                            ₹{Number(course.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#900606]">
                          {course.badge || '100% Free'}
                        </span>
                      </div>
                      <Link
                        href="/account?tab=courses"
                        className="text-xs font-semibold text-neutral-500 hover:text-[#900606] transition-colors flex items-center gap-1 mt-0.5"
                      >
                        <span>Explore Bundles</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
