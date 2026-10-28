'use client';

import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

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

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id || '1';

  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToCart, buyNow } = useCart();

  // Mock product database mapping for fallback
  const fallbackProductsMap = {
    '1': { 
      id: '1', 
      name: 'Digitek Ring Light 18"', 
      subtitle: 'Professional 18 inch Ring Light with Desk Mount & Stand', 
      price: 2499, 
      mrp: 3499, 
      discount: '28% OFF', 
      rating: 4.8, 
      reviews: '120 reviews', 
      sold: '1k+ sold',
      image: '/ring.jpg', 
      images: ['/ring.jpg', '/ring1.png', '/ring2.png', '/ring3.png'], 
      description: 'Achieve flawless, studio-quality illumination with adjustable brightness and color temperature. Perfect for eliminating shadows and glowing on camera.',
      features: ['Bi-Color 3200K - 5600K', 'Dimmable 1% - 100%', 'Includes 6ft Stand', 'Smartphone Mount'],
    },
    'digitek-ring-light-18': { 
      id: 'digitek-ring-light-18', 
      name: 'Digitek Ring Light 18"', 
      subtitle: 'Professional 18 inch Ring Light with Desk Mount & Stand', 
      price: 2499, 
      mrp: 3499, 
      discount: '28% OFF', 
      rating: 4.8, 
      reviews: '120 reviews', 
      sold: '1k+ sold',
      image: '/ring.jpg', 
      images: ['/ring.jpg', '/ring1.png', '/ring2.png', '/ring3.png'], 
      description: 'Achieve flawless, studio-quality illumination with adjustable brightness and color temperature. Perfect for eliminating shadows and glowing on camera.',
      features: ['Bi-Color 3200K - 5600K', 'Dimmable 1% - 100%', 'Includes 6ft Stand', 'Smartphone Mount'],
    },
    '2': { 
      id: '2', 
      name: 'ApexPro Heavy-Duty Aluminum Creator Tripod', 
      subtitle: 'HEAVY-DUTY ALUMINUM TRIPOD', 
      price: 1999, 
      mrp: 2499, 
      discount: '20% OFF', 
      rating: 4.9, 
      reviews: '890 reviews', 
      sold: '800+ sold',
      image: '/tripod.jpg', 
      images: ['/tripod.jpg', '/tripod1.png', '/tripod2.png', '/tripod3.png'], 
      description: 'Tired of shaky footage ruining your shots? The ApexPro aluminum tripod guarantees rock-solid stability for silky smooth pans and professional-grade framing.',
      features: ['3-Way Pan Head', 'Quick-Release Plate', 'Bubble Level', 'Extends to 170cm'],
    },
    'digitek-dtr-550-tripod': { 
      id: 'digitek-dtr-550-tripod', 
      name: 'Digitek DTR 550 LW Tripod', 
      subtitle: 'HEAVY-DUTY ALUMINUM TRIPOD', 
      price: 1999, 
      mrp: 2499, 
      discount: '20% OFF', 
      rating: 4.9, 
      reviews: '890 reviews', 
      sold: '800+ sold',
      image: '/tripod.jpg', 
      images: ['/tripod.jpg', '/tripod1.png', '/tripod2.png', '/tripod3.png'], 
      description: 'Tired of shaky footage ruining your shots? The ApexPro aluminum tripod guarantees rock-solid stability for silky smooth pans and professional-grade framing.',
      features: ['3-Way Pan Head', 'Quick-Release Plate', 'Bubble Level', 'Extends to 170cm'],
    },
    '3': { 
      id: '3', 
      name: 'ChromaKey Portable Green Screen Backdrop', 
      subtitle: 'PORTABLE CHROMA KEY BACKDROP', 
      price: 799, 
      mrp: 1299, 
      discount: '38% OFF', 
      rating: 4.7, 
      reviews: '560 reviews', 
      sold: '500+ sold',
      image: '/chorma.jpg', 
      images: ['/chorma.jpg', '/chorma1.png', '/chorma2.png'], 
      description: 'Transport your audience anywhere instantly. This portable, wrinkle-resistant green screen gives you the perfect canvas for professional background replacement and streaming overlays.',
      features: ['Matte Non-Reflective', 'Pure Muslin Fabric', 'Wrinkle Resistant', 'Clamps Included'],
    },
    'green-screen-backdrop': { 
      id: 'green-screen-backdrop', 
      name: 'Green Screen Backdrop', 
      subtitle: 'PORTABLE CHROMA KEY BACKDROP', 
      price: 799, 
      mrp: 1299, 
      discount: '38% OFF', 
      rating: 4.7, 
      reviews: '560 reviews', 
      sold: '500+ sold',
      image: '/chorma.jpg', 
      images: ['/chorma.jpg', '/chorma1.png', '/chorma2.png'], 
      description: 'Transport your audience anywhere instantly. This portable, wrinkle-resistant green screen gives you the perfect canvas for professional background replacement and streaming overlays.',
      features: ['Matte Non-Reflective', 'Pure Muslin Fabric', 'Wrinkle Resistant', 'Clamps Included'],
    },
    '4': { 
      id: '4', 
      name: 'Creators Kit Studio Condenser Microphone', 
      subtitle: 'STUDIO-GRADE WIRELESS AUDIO', 
      price: 24999, 
      mrp: 29999, 
      discount: '16% OFF', 
      rating: 4.8, 
      reviews: '1,120 reviews', 
      sold: '1.2k+ sold',
      image: '/wireless-mic.jpg', 
      images: ['/wireless-mic.jpg', '/wireless-mic1.png', '/wireless-mic2.png'], 
      description: 'Capture crisp, broadcast-quality audio without the hassle of tangled cables. Features real-time noise reduction, ultra-low latency, and dual-channel wireless transmission.',
      features: ['Dual-Channel Wireless', 'Series IV 2.4GHz', 'Over 40h Recording', 'USB-C Digital Output'],
    },
    'rode-wireless-go-ii': { 
      id: 'rode-wireless-go-ii', 
      name: 'Creators Kit Studio Condenser Microphone', 
      subtitle: 'STUDIO-GRADE WIRELESS AUDIO', 
      price: 24999, 
      mrp: 29999, 
      discount: '16% OFF', 
      rating: 4.8, 
      reviews: '1,120 reviews', 
      sold: '1.2k+ sold',
      image: '/wireless-mic.jpg', 
      images: ['/wireless-mic.jpg', '/wireless-mic1.png', '/wireless-mic2.png'], 
      description: 'Capture crisp, broadcast-quality audio without the hassle of tangled cables. Features real-time noise reduction, ultra-low latency, and dual-channel wireless transmission.',
      features: ['Dual-Channel Wireless', 'Series IV 2.4GHz', 'Over 40h Recording', 'USB-C Digital Output'],
    },
  };

  const defaultSpecifications = [
    { label: 'Brand', value: 'Creators Kit' },
    { label: 'Model', value: 'Pro Creator Bundle V2' },
    { label: 'Kit Type', value: 'All-in-One Studio & Lighting Setup' },
    { label: 'Lighting Range', value: 'Adjustable Brightness & Color Temp' },
    { label: 'Power Source', value: 'USB Powered / Adapter Included' },
    { label: 'Compatibility', value: 'DSLR, Mirrorless, Smartphones & Laptops' },
    { label: 'Warranty', value: '1 Year Official Brand Warranty' }
  ];

  const defaultWhatsInTheBox = [
    { name: '1 × 18-Inch Professional Ring Light' },
    { name: '1 × Heavy-Duty Studio Tripod Stand' },
    { name: '1 × Smartphone & Camera Mount Holder' },
    { name: '1 × Green Screen Backdrop (Optional)' },
    { name: '1 × Professional Studio Condenser Microphone' },
    { name: '1 × Portable RGB Tube Light for Background' },
    { name: '3 × Free Masterclass Video Courses (100% Free)' }
  ];

  const initialBundles = [
    {
      id: 'pro-creator-kit',
      name: 'Pro Creator Kit',
      price: 9999,
      image: '/pro1.png',
    },
    {
      id: 'basic-creator-kit',
      name: 'Basic Creator Kit',
      price: 5999,
      image: '/basic1.png',
    },
    {
      id: 'starter-vlogger-kit',
      name: 'Starter Vlogger Kit',
      price: 3499,
      image: '/starter1.png',
    }
  ];

  const searchParams = useSearchParams();
  const queryTitle = searchParams.get('title');
  const queryPrice = searchParams.get('price');

  const defaultBase = fallbackProductsMap[productId] || fallbackProductsMap['1'];
  const [productData, setProductData] = useState({
    ...defaultBase,
    name: queryTitle || defaultBase.name,
    displayPrice: queryPrice || null,
    includeBonusCourses: defaultBase.includeBonusCourses !== undefined ? defaultBase.includeBonusCourses : true,
    bonusMasterclasses: defaultBase.bonusMasterclasses || defaultBonusMasterclasses,
    specifications: defaultBase.specifications || defaultSpecifications,
    whatsInTheBox: defaultBase.whatsInTheBox || defaultWhatsInTheBox,
  });

  const [bundles, setBundles] = useState(initialBundles);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product from database dynamically
  useEffect(() => {
    async function fetchDbProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const json = await res.json();
          const p = json.data;
          if (p) {
            const priceNum = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
            const mrpNum = p.originalPrice || Math.round(priceNum * 1.35);
            let discountStr = p.discount || '';
            if (!discountStr && mrpNum > priceNum) {
              discountStr = `${Math.round(((mrpNum - priceNum) / mrpNum) * 100)}% OFF`;
            }

            const rawImages = (Array.isArray(p.images) && p.images.length > 0)
              ? p.images
              : [
                  {
                    src: p.image || '/ring.jpg',
                    title: p.name,
                    subtitle: p.subheading || p.category || '',
                    description: p.description || '',
                    price: priceNum,
                    originalPrice: mrpNum,
                  },
                ];

            const parsedImages = rawImages.map((im) => {
              if (typeof im === 'string') {
                return {
                  src: im,
                  title: p.name,
                  subtitle: p.subheading || p.category || '',
                  description: p.description || '',
                  price: priceNum,
                  originalPrice: mrpNum,
                };
              }
              const vPrice = im.price !== undefined && im.price !== null && im.price !== '' ? Number(im.price) : priceNum;
              const vMrp = im.originalPrice !== undefined && im.originalPrice !== null && im.originalPrice !== '' ? Number(im.originalPrice) : mrpNum;
              return {
                src: im.src || p.image || '/ring.jpg',
                title: im.title || p.name,
                subtitle: im.subtitle || p.subheading || '',
                description: im.description || p.description || '',
                price: vPrice,
                originalPrice: vMrp,
                discount: vMrp && vPrice && vMrp > vPrice ? `${Math.round(((vMrp - vPrice) / vMrp) * 100)}% OFF` : discountStr,
              };
            });

            setProductData({
              id: p.id || p._id,
              _id: p._id,
              name: p.name,
              subtitle: p.subheading || p.category || 'Professional Studio Gear',
              price: priceNum,
              mrp: mrpNum,
              discount: discountStr || '15% OFF',
              rating: p.rating || 4.9,
              reviews: `${p.reviewsCount || 120} reviews`,
              sold: p.stock ? `${p.stock} units available` : 'In Stock',
              image: p.image || parsedImages[0]?.src || '/ring.jpg',
              images: parsedImages,
              description: p.description || 'High-performance gear engineered for digital creators.',
              features: Array.isArray(p.features) && p.features.length > 0
                ? p.features
                : ['Professional Grade Material', 'Creator Tested & Approved', '1-Year Official Warranty'],
              isBundle: p.isBundle,
              includeBonusCourses: p.includeBonusCourses !== undefined ? p.includeBonusCourses : true,
              bonusMasterclasses: Array.isArray(p.bonusMasterclasses) && p.bonusMasterclasses.length > 0
                ? p.bonusMasterclasses
                : defaultBonusMasterclasses,
              specifications: (Array.isArray(p.specifications) && p.specifications.length > 0)
                ? p.specifications
                : defaultSpecifications,
              whatsInTheBox: (Array.isArray(p.whatsInTheBox) && p.whatsInTheBox.length > 0)
                ? p.whatsInTheBox
                : defaultWhatsInTheBox,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic product from API:', err);
      }
    }

    if (productId) {
      fetchDbProduct();
    }

    // Fetch bundles for the bundle section
    fetch('/api/bundles')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setBundles(data.data);
        }
      })
      .catch(() => {});
  }, [productId]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('creatorsKitTheme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const activeVariant =
    (Array.isArray(productData.images) && productData.images[selectedImageIndex]) ||
    (Array.isArray(productData.images) && productData.images[0]) ||
    {
      src: productData.image || '/ring.jpg',
      title: productData.name,
      subtitle: productData.subtitle,
      price: productData.price,
      originalPrice: productData.mrp,
      description: productData.description,
    };

  const activeSrc = typeof activeVariant === 'string' ? activeVariant : activeVariant.src;
  const activeTitle = typeof activeVariant === 'object' && activeVariant.title ? activeVariant.title : productData.name;
  const activeSubtitle = typeof activeVariant === 'object' && activeVariant.subtitle ? activeVariant.subtitle : productData.subtitle;
  const activePrice = typeof activeVariant === 'object' && activeVariant.price ? activeVariant.price : productData.price;
  const activeMrp = typeof activeVariant === 'object' && activeVariant.originalPrice ? activeVariant.originalPrice : productData.mrp;
  const activeDiscount = typeof activeVariant === 'object' && activeVariant.discount
    ? activeVariant.discount
    : (activeMrp && activePrice && activeMrp > activePrice
        ? `${Math.round(((activeMrp - activePrice) / activeMrp) * 100)}% OFF`
        : productData.discount);
  const activeDescription = typeof activeVariant === 'object' && activeVariant.description ? activeVariant.description : productData.description;

  const activeBonusCourses = (
    Array.isArray(productData.bonusMasterclasses) && productData.bonusMasterclasses.length > 0
      ? productData.bonusMasterclasses
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

  const shouldShowBonus = productData.includeBonusCourses !== false && activeBonusCourses.length > 0;

  const handleAddToCart = () => {
    addToCart({
      id: `${productData.id}-${selectedImageIndex}`,
      name: activeTitle,
      price: activePrice,
      quantity: 1,
      img: activeSrc,
      image: activeSrc,
    });
    router.push('/cart');
  };

  const handleBuyNow = () => {
    buyNow({
      id: `${productData.id}-${selectedImageIndex}`,
      name: activeTitle,
      price: activePrice,
      quantity: 1,
      img: activeSrc,
      image: activeSrc,
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
    <div className={`flex flex-col ${isDarkMode ? 'bg-[#0B0F19] text-neutral-100' : 'bg-[#FBFBF7] text-neutral-900'} font-sans w-full pt-18 sm:pt-24 md:pt-28 pb-12 md:pb-16`}>
      <main className="w-full max-w-[150rem] mx-auto px-6 sm:px-8 lg:px-10">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${isDarkMode ? 'bg-[#131C2E] border-neutral-700 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-100'} shadow-sm cursor-pointer`}
          >
            <span>←</span> Back to Store
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-16 items-start w-full">
          
          {/* LEFT: Vertical Thumbnails + Main Image Showcase */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5 lg:gap-3 w-full">
            
            {/* Vertical Thumbnails on the left */}
            <div className="flex sm:flex-col gap-1.5 sm:gap-2 md:gap-2 shrink-0 overflow-x-auto sm:overflow-visible no-scrollbar py-0.5 w-full sm:w-[160px] md:w-[160px] lg:w-[180px] xl:w-[200px] justify-start">
              {productData.images?.map((im, idx) => {
                const src = typeof im === 'string' ? im : im.src;
                const title = typeof im === 'string' ? `Thumbnail ${idx + 1}` : (im.title || `Thumbnail ${idx + 1}`);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-1 min-w-[84px] max-w-[108px] sm:max-w-none h-[72px] sm:h-[82px] md:h-[105px] lg:h-[115px] xl:h-[125px] sm:w-[160px] md:w-[160px] lg:w-[180px] xl:w-[200px] rounded-xl sm:rounded-2xl border-2 md:border-[2.5px] transition-all shrink-0 bg-white dark:bg-[#131C2E] flex items-center justify-center overflow-hidden cursor-pointer ${
                      selectedImageIndex === idx 
                        ? 'border-[#900606] shadow-md ring-2 ring-[#900606]/20 scale-[1.02]' 
                        : 'border-neutral-200 dark:border-neutral-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={getImageUrl(src)}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 30vw, 220px"
                        className="object-cover object-center"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Image Container */}
            <div className="relative flex-1 aspect-square rounded-2xl sm:rounded-[2rem] bg-white dark:bg-[#131C2E] overflow-hidden flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shadow-sm group">
              {/* Bestseller Badge */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 flex gap-2 z-20">
                <span className="bg-[#900606] text-white text-[10px] font-extrabold px-2.5 sm:px-3 py-1 rounded-full shadow-sm">
                  {productData.isBundle ? 'CREATOR BUNDLE' : 'BESTSELLER'}
                </span>
              </div>

              <div className="relative w-full h-full flex items-center justify-center z-10">
                <Image
                  src={getImageUrl(activeSrc)}
                  alt={activeTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center transition-all duration-300"
                  priority
                />
              </div>
            </div>

          </div>

          {/* RIGHT: Product Info & Actions */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Title & Subtitle */}
            <div className="space-y-1.5 sm:space-y-2 font-sans">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 leading-tight">
                {activeTitle}
              </h1>
              {activeSubtitle && (
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} font-medium`}>
                  {activeSubtitle}
                </p>
              )}
            </div>

            {/* Rating & Sold count */}
            <div className="flex items-center gap-3 mt-3 mb-3 sm:mt-4 sm:mb-4 flex-wrap text-xs">
              <span className="flex items-center gap-1 font-bold text-yellow-500">
                ★ {productData.rating}
              </span>
              <span className="text-neutral-500">({productData.reviews})</span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-500 font-medium">{productData.sold}</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap pt-1 mb-2 sm:mb-3">
              <span className="text-2xl sm:text-3xl font-black text-[#900606]">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {activeMrp && (
                <span className="text-sm text-neutral-400 line-through font-medium">₹{activeMrp.toLocaleString('en-IN')}</span>
              )}
              {activeDiscount && (
                <span className="text-[11px] sm:text-xs font-bold text-[#900606] bg-red-100/80 dark:bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                  {activeDiscount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mb-3">Inclusive of all taxes</p>

            {/* In Stock Badge */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 sm:py-2 rounded-xl w-fit mb-5 border border-emerald-100 dark:border-emerald-900/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              In Stock - Ready to Ship
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 font-normal">
              {activeDescription}
            </p>

            {/* Key Features List */}
            {productData.features && productData.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                {productData.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#131C2E] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                    <span className="text-[#900606] font-bold text-xs sm:text-sm">✓</span>
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* FREE MASTERCLASSES BUNDLE OFFER (CLEAN 3 COURSE CARDS) */}
            {shouldShowBonus && (
              <div className="mb-6 sm:mb-8 rounded-2xl border-2 border-red-200/90 dark:border-red-900/50 bg-gradient-to-br from-red-50/70 via-white to-amber-50/30 dark:from-[#171216] dark:via-[#131C2E] dark:to-[#171216] p-3.5 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#900606] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                    🎁 FREE BUNDLE OFFER
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-[#900606] dark:text-red-400 bg-red-100/90 dark:bg-red-950/80 px-2.5 sm:px-3 py-1 rounded-full border border-red-300 dark:border-red-800 shadow-2xs">
                    Worth ₹{totalBonusValue ? totalBonusValue.toLocaleString('en-IN') : '4,997'} • 100% Free
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white tracking-tight">
                  Includes {activeBonusCourses.length === 1 ? 'Masterclass Free' : `${activeBonusCourses.length} Masterclasses Free`}
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Purchasing this product automatically unlocks lifetime access to all courses directly inside your account:
                </p>

                {/* Clean 3 Course Thumbnail Cards */}
                <div className={`grid ${activeBonusCourses.length === 1 ? 'grid-cols-1' : activeBonusCourses.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2 sm:gap-3 mt-3`}>
                  {activeBonusCourses.map((c) => (
                    <div
                      key={c.id || c.title}
                      className="group flex flex-col items-center text-center cursor-pointer p-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-red-100/60 dark:border-red-900/40 shadow-2xs transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <div className="w-full h-20 sm:h-24 md:h-26 rounded-lg overflow-hidden relative mb-1.5 flex items-center justify-center">
                        <Image
                          src={getImageUrl(c.image || '/video.webp')}
                          alt={c.title}
                          fill
                          sizes="(max-width: 640px) 30vw, 150px"
                          className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-bold text-[10px] sm:text-xs text-[#111827] dark:text-neutral-200 line-clamp-2 leading-tight group-hover:text-[#900606] transition-colors text-center">
                        {c.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Action Buttons (inline below bundle) */}
            <div className="hidden md:block font-sans mb-6 sm:mb-8 mt-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="py-3 px-4 bg-white dark:bg-[#131C2E] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-neutral-700 font-medium text-xs sm:text-sm rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  type="button"
                  className="py-3 px-4 bg-[#900606] hover:bg-[#7a0505] text-white font-semibold text-xs sm:text-sm rounded-lg active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-800 text-left sm:text-center">
              {[
                { title: 'Free Delivery', sub: '2-3 days', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /> },
                { title: '7 Days Returns', sub: 'Easy replacement', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> },
                { title: 'Secure Payment', sub: '100% safe', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> },
                { title: 'Genuine Product', sub: 'Official warranty', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> }
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center sm:flex-col sm:justify-center gap-2 sm:gap-1.5 p-2 sm:p-1.5 rounded-xl bg-white dark:bg-[#131C2E] sm:bg-transparent sm:dark:bg-transparent border border-neutral-100 dark:border-neutral-800 sm:border-0 shadow-2xs sm:shadow-none">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 dark:bg-red-950/40 text-[#900606] dark:text-red-400 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{badge.icon}</svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold text-neutral-800 dark:text-neutral-200 leading-tight">{badge.title}</span>
                    <span className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">{badge.sub}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </main>

      {/* PRODUCT SPECIFICATIONS & WHAT'S IN THE BOX */}
      <section className="w-full py-4 sm:py-8 lg:py-12 bg-[#FBFBF7] dark:bg-[#0E1524] border-t border-neutral-200/80 dark:border-neutral-800 transition-colors">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
              Product <span className="text-[#900606] whitespace-nowrap">Specifications</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#131C2E] overflow-hidden shadow-sm divide-y divide-neutral-200/70 dark:divide-neutral-800">
                {(productData.specifications || defaultSpecifications).map((spec, idx) => (
                  <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 text-xs sm:text-sm ${idx % 2 === 0 ? 'bg-white dark:bg-[#131C2E]' : 'bg-[#F9F9F5] dark:bg-[#172236]'}`}>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 sm:w-2/5">{spec.label}</span>
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium sm:text-right sm:w-3/5">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-2.5">
              {(productData.whatsInTheBox || defaultWhatsInTheBox).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-[#131C2E] rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#900606] shrink-0"></span>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GET MORE WITH BUNDLE */}
      <section className="w-full py-4 sm:py-8 lg:py-12 bg-[#FBFBF7] dark:bg-[#0B0F19] border-t border-neutral-200/80 dark:border-neutral-800 transition-colors">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 text-left">
              <h2 className="text-3xl pb-5 md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
                Get More with <span className="text-[#900606] whitespace-nowrap">Bundle</span>
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-normal leading-relaxed mb-6">
                Upgrade your modern creator studio with our all-in-one professional bundles. Carefully curated for YouTubers, podcasters, livestreamers, and digital storytellers, each complete setup integrates broadcast-grade lighting, crystal-clear audio, heavy-duty tripod stability, and premium backdrops. Save more on essential studio gear while gaining instant, lifetime access to our 3 exclusive creator masterclasses 100% free with every bundle.
              </p>
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-7">
              {bundles.map((bundle) => (
                <div key={bundle.id || bundle._id} className="group relative bg-white dark:bg-[#131C2E] rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div className="relative w-full h-80 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <Image 
                      src={getImageUrl(bundle.image)} 
                      alt={bundle.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 350px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-extrabold text-[#111827] dark:text-white text-xl mb-2">{bundle.name}</h3>
                      <span className="font-black text-2xl text-[#900606]">₹{bundle.price?.toLocaleString()}</span>
                    </div>
                    <Link 
                      href={`/bundle/${bundle.id || bundle._id}`}
                      className="group/btn relative mt-4 py-3.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm text-center overflow-hidden transition-all duration-300 block cursor-pointer hover:border-[#900606] shadow-2xs"
                    >
                      <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                      <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FREE MASTERCLASSES TRILOGY SHOWCASE (DYNAMIC FROM DB / ADMIN) */}
      {shouldShowBonus && (
        <section className="w-full py-10 sm:py-14 bg-white dark:bg-[#0B0F19] border-t border-neutral-200/80 dark:border-neutral-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#900606] uppercase mb-2">
                  <span className="w-2.5 h-2.5 bg-[#900606] rounded-xs inline-block"></span>
                  <span>BONUS INCLUDED WITH PURCHASE</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
                  Free Masterclasses <span className="text-[#900606] whitespace-nowrap">Bundle</span>
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-normal mt-2 max-w-2xl leading-relaxed">
                  Purchasing this product includes {activeBonusCourses.length === 1 ? 'this expert creator course' : `all ${activeBonusCourses.length} expert creator courses`} completely free. Courses are automatically granted to your account upon checkout for lifetime streaming.
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-200 dark:border-emerald-800">
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
                  className="bg-white dark:bg-[#131C2E] rounded-3xl p-6 sm:p-7 border border-neutral-200/90 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-center items-center group"
                >
                  <div className="w-full h-52 sm:h-56 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 overflow-hidden relative mb-5 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-center p-3">
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
                      <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-2 group-hover:text-[#900606] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 font-normal text-sm leading-relaxed mb-6">
                        {course.description}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#900606]">
                          {course.badge || '100% Free Included'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* MOBILE FIXED STICKY BOTTOM BAR (FLIPKART STYLE) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0B0F19] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 w-full max-w-md mx-auto">
          <button
            onClick={handleAddToCart}
            type="button"
            className="flex-1 py-3 px-4 bg-white dark:bg-[#131C2E] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-neutral-700 font-medium text-sm rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            type="button"
            className="flex-1 py-3 px-4 bg-[#900606] hover:bg-[#7a0505] text-white font-semibold text-sm rounded-lg active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}