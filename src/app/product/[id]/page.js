'use client';

import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mov') ||
    clean.includes('/video/') ||
    clean.includes('youtube.com') ||
    clean.includes('youtu.be') ||
    clean.includes('vimeo.com')
  );
};

const isEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
};

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch')) {
    const vMatch = url.match(/[?&]v=([^&]+)/);
    const id = vMatch ? vMatch[1] : '';
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  }
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1`;
  }
  return url;
};

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
  const productId = params?.id;

  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToCart, buyNow } = useCart();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product strictly from MongoDB API
  useEffect(() => {
    let isCancelled = false;

    async function fetchDbProduct() {
      if (!productId) {
        setLoading(false);
        setError('No product specified');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/products/${encodeURIComponent(productId)}`);

        if (!res.ok) {
          if (!isCancelled) {
            setProductData(null);
            setError('Product not found');
            setLoading(false);
          }
          return;
        }

        const json = await res.json();
        const p = json.data;
        if (!p) {
          if (!isCancelled) {
            setProductData(null);
            setError('Product not found');
            setLoading(false);
          }
          return;
        }

        const priceNum = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
        const mrpNum = p.originalPrice ? Number(p.originalPrice) : Math.round(priceNum * 1.35);
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

        const parsedImages = rawImages.map((im, idx) => {
          if (typeof im === 'string') {
            return {
              src: im,
              title: `${p.name} View ${idx + 1}`,
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

        const productVideo = (p.video || p.videoUrl || '').trim();
        if (productVideo && !parsedImages.some(im => (typeof im === 'string' ? im : im.src) === productVideo)) {
          parsedImages.push({
            src: productVideo,
            title: `${p.name} (Video)`,
            subtitle: 'Watch Product Video Demo',
            description: p.description || '',
            price: priceNum,
            originalPrice: mrpNum,
            isVideo: true,
          });
        }

        if (!isCancelled) {
          setProductData({
            id: p.id || p.slug || p._id,
            _id: p._id,
            name: p.name,
            video: productVideo,
            subtitle: p.subheading || p.category || '',
            price: priceNum,
            mrp: mrpNum,
            discount: discountStr || '',
            rating: p.rating || 4.8,
            reviews: `${p.reviewsCount || 120} reviews`,
            sold: p.stock ? `${p.stock} units available` : 'In Stock',
            image: p.image || parsedImages[0]?.src || '/ring.jpg',
            images: parsedImages,
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features : [],
            specifications: Array.isArray(p.specifications) ? p.specifications : [],
            whatsInTheBox: Array.isArray(p.whatsInTheBox) ? p.whatsInTheBox : [],
            isBundle: Boolean(p.isBundle),
            productType: p.productType || (p.isBundle ? 'bundle' : 'individual'),
            includeBonusCourses: p.includeBonusCourses !== undefined ? p.includeBonusCourses : (p.productType === 'bundle' || p.productType === 'thumbnail-bundle'),
            bonusMasterclasses: (Array.isArray(p.bonusMasterclasses) && p.bonusMasterclasses.length > 0)
              ? p.bonusMasterclasses
              : defaultBonusMasterclasses,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load dynamic product from API:', err);
        if (!isCancelled) {
          setProductData(null);
          setError('Failed to load product');
          setLoading(false);
        }
      }
    }

    fetchDbProduct();

    return () => {
      isCancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('creatorsKitTheme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/product');
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col min-h-[85vh] ${isDarkMode ? 'bg-[#0B0F19] text-neutral-100' : 'bg-[#FBFBF7] text-neutral-900'} font-sans w-full pt-20 sm:pt-28 pb-16`}>
        <div className="w-full max-w-[150rem] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${isDarkMode ? 'bg-[#131C2E] border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'} shadow-sm cursor-pointer`}
            >
              <span>←</span> Back
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full animate-pulse">
            <div className="lg:col-span-6 aspect-square rounded-2xl sm:rounded-[2rem] bg-neutral-200/60 dark:bg-neutral-800/60"></div>
            <div className="lg:col-span-6 space-y-4">
              <div className="h-8 bg-neutral-200/70 dark:bg-neutral-800/70 rounded-xl w-3/4"></div>
              <div className="h-4 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg w-1/2"></div>
              <div className="h-10 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl w-1/3 mt-6"></div>
              <div className="h-24 bg-neutral-200/40 dark:bg-neutral-800/40 rounded-2xl w-full mt-4"></div>
              <div className="h-12 bg-neutral-200/70 dark:bg-neutral-800/70 rounded-xl w-full mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData || error) {
    return (
      <div className={`flex flex-col min-h-[85vh] ${isDarkMode ? 'bg-[#0B0F19] text-neutral-100' : 'bg-[#FBFBF7] text-neutral-900'} font-sans w-full pt-24 pb-20 justify-center items-center px-4`}>
        <div className="max-w-md w-full bg-white dark:bg-[#131C2E] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 text-center shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#900606] flex items-center justify-center mb-5 border border-red-100 dark:border-red-900/50">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-[11px] font-extrabold tracking-widest text-[#900606] uppercase mb-1.5">CATALOG ITEM NOT FOUND</span>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Product Not Found</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
            The equipment or creator kit you are looking for does not exist in our database or may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => router.push('/product')}
              className="flex-1 py-3 px-4 bg-[#900606] hover:bg-[#7a0505] text-white font-semibold text-xs rounded-xl transition cursor-pointer shadow-sm text-center"
            >
              Browse Studio Gear
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-xl transition cursor-pointer text-center"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

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
  const isThumbnailBundle = productData.productType === 'thumbnail-bundle';
  const activeTitle = isThumbnailBundle
    ? (typeof activeVariant === 'object' && activeVariant.title ? activeVariant.title : productData.name)
    : productData.name;
  const activeSubtitle = isThumbnailBundle
    ? (typeof activeVariant === 'object' && activeVariant.subtitle ? activeVariant.subtitle : productData.subtitle)
    : productData.subtitle;
  const activePrice = (isThumbnailBundle || productData.isBundle)
    ? productData.price
    : (typeof activeVariant === 'object' && activeVariant.price ? activeVariant.price : productData.price);
  const activeMrp = (isThumbnailBundle || productData.isBundle)
    ? productData.mrp
    : (typeof activeVariant === 'object' && activeVariant.originalPrice ? activeVariant.originalPrice : productData.mrp);
  const activeDiscount = typeof activeVariant === 'object' && activeVariant.discount
    ? activeVariant.discount
    : (activeMrp && activePrice && activeMrp > activePrice
      ? `${Math.round(((activeMrp - activePrice) / activeMrp) * 100)}% OFF`
      : productData.discount);
  const activeDescription = isThumbnailBundle
    ? (typeof activeVariant === 'object' && activeVariant.description ? activeVariant.description : productData.description)
    : productData.description;

  const activeBonusCourses = Array.isArray(productData.bonusMasterclasses) && productData.bonusMasterclasses.length > 0
    ? productData.bonusMasterclasses.filter((c) => c.active !== false)
    : defaultBonusMasterclasses;
  const totalBonusValue = activeBonusCourses.reduce((sum, c) => sum + (Number(c.originalPrice) || 1999), 0);
  const shouldShowBonus = productData.includeBonusCourses !== false && activeBonusCourses.length > 0;

  const handleAddToCart = () => {
    const cartImg = isVideoUrl(activeSrc) ? (productData.image || '/ring.jpg') : activeSrc;
    addToCart({
      id: `${productData.id}-${selectedImageIndex}`,
      name: activeTitle,
      price: activePrice,
      quantity: 1,
      img: cartImg,
      image: cartImg,
    });
    router.push('/cart');
  };

  const handleBuyNow = () => {
    const cartImg = isVideoUrl(activeSrc) ? (productData.image || '/ring.jpg') : activeSrc;
    buyNow({
      id: `${productData.id}-${selectedImageIndex}`,
      name: activeTitle,
      price: activePrice,
      quantity: 1,
      img: cartImg,
      image: cartImg,
    });

    const rawUser = typeof window !== 'undefined' ? localStorage.getItem('creatorsKitUserInfo') : null;
    const sessionEmail = typeof window !== 'undefined' ? (sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail')) : null;
    const userRole = typeof window !== 'undefined' ? (sessionStorage.getItem('userRole') || localStorage.getItem('userRole')) : null;
    let user = null;
    if (rawUser) {
      try {
        user = JSON.parse(rawUser);
      } catch (e) { }
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
      <main className="w-full max-w-[100rem] mx-auto px-6 sm:px-8 lg:px-10">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${isDarkMode ? 'bg-[#131C2E] border-neutral-700 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-100'} shadow-sm cursor-pointer`}
          >
            <span>←</span> Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-16 items-start w-full">

          {/* LEFT: Vertical Thumbnails + Main Image Showcase */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-5 sm:gap-6 lg:gap-8 w-full items-start">

            {/* Thumbnails list */}
            {productData.images && productData.images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 shrink-0 overflow-x-auto sm:overflow-y-auto sm:max-h-[480px] lg:max-h-[510px] no-scrollbar py-0.5 w-full sm:w-auto justify-start">
                {productData.images.map((im, idx) => {
                  const src = typeof im === 'string' ? im : im.src;
                  const title = typeof im === 'string' ? `Thumbnail ${idx + 1}` : (im.title || `Thumbnail ${idx + 1}`);
                  const isSelected = selectedImageIndex === idx;
                  const isItemVideo = isVideoUrl(src);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl sm:rounded-2xl border-2 transition-all shrink-0 bg-white dark:bg-[#131C2E] flex items-center justify-center overflow-hidden cursor-pointer ${isSelected
                        ? 'border-[#900606] shadow-md ring-2 ring-[#900606]/30 scale-[1.03]'
                        : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-300'
                        }`}
                      title={title}
                    >
                      <div className="relative w-full h-full p-1.5 flex items-center justify-center">
                        {isItemVideo ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white rounded-lg">
                            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span className="text-[8px] font-black tracking-wider uppercase mt-0.5 text-neutral-300">Video</span>
                          </div>
                        ) : (
                          <Image
                            src={getImageUrl(src)}
                            alt={title}
                            fill
                            sizes="96px"
                            className="object-contain object-center"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Image Container */}
            <div className="relative flex-1 aspect-square max-h-[460px] sm:max-h-[490px] lg:max-h-[510px] rounded-xl sm:rounded-[2rem] bg-white dark:bg-[#131C2E] overflow-hidden flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shadow-sm group w-full">
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 flex gap-2 z-20">
                <span className="bg-[#900606] text-white text-[10px] font-extrabold px-2.5 sm:px-3 py-1 rounded-full shadow-sm">
                  {productData.isBundle ? 'CREATOR BUNDLE' : 'BESTSELLER'}
                </span>
              </div>

              <div className="relative w-full h-full flex items-center justify-center z-10">
                {isEmbedUrl(activeSrc) ? (
                  <iframe
                    src={getEmbedUrl(activeSrc)}
                    title={activeTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : isVideoUrl(activeSrc) ? (
                  <video
                    src={activeSrc}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={getImageUrl(activeSrc)}
                    alt={activeTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-center transition-all duration-300"
                    priority
                  />
                )}
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
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 font-normal">
              {activeDescription}
            </p>

            {/* FREE MASTERCLASSES BUNDLE OFFER (MATCHING REFERENCE SCREENSHOT) */}
            {shouldShowBonus && (
              <div className="mt-2 mb-6 rounded-2xl border-2 border-red-200/90 dark:border-red-900/60 bg-gradient-to-br from-red-50/70 via-white to-amber-50/30 dark:from-red-950/30 dark:via-[#131C2E] dark:to-amber-950/20 p-4 sm:p-5 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-[#900606] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded tracking-wide">
                    <span>🎁</span> FREE BUNDLE OFFER
                  </span>
                  <span className="inline-flex items-center text-[10px] font-bold text-[#900606] bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 px-2 py-0.5 rounded-full">
                    Worth ₹{totalBonusValue.toLocaleString('en-IN')} • 100% Free
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white tracking-tight">
                  Free Masterclasses Bundle
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Purchasing this product automatically unlocks lifetime access to all courses directly inside your account:
                </p>

                {/* Clean 3 Course Thumbnail Cards */}
                <div className={`grid ${activeBonusCourses.length === 1 ? 'grid-cols-1' : activeBonusCourses.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2.5 sm:gap-3 mt-3.5`}>
                  {activeBonusCourses.map((c) => (
                    <div
                      key={c.id || c.title}
                      className="group flex flex-col items-center text-center cursor-pointer"
                    >
                      <div className="w-full h-20 sm:h-24 md:h-28 rounded-xl overflow-hidden relative mb-2 flex items-center justify-center p-1 bg-white dark:bg-[#1a253c] border border-neutral-100 dark:border-neutral-800 shadow-2xs">
                        <Image
                          src={getImageUrl(c.image || '/video 2.webp')}
                          alt={c.title}
                          fill
                          sizes="(max-width: 768px) 33vw, 150px"
                          className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-bold text-[11px] sm:text-xs text-[#111827] dark:text-neutral-200 line-clamp-1 group-hover:text-[#900606] transition-colors">
                        {c.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Action Buttons (Add to Cart & Buy Now) */}
            <div className="font-sans mt-5 sm:mt-6 w-full">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="py-3 px-4 bg-white dark:bg-[#131C2E] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-neutral-700 font-semibold text-xs sm:text-sm rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  type="button"
                  className="py-3 px-4 bg-[#900606] hover:bg-[#7a0505] text-white font-semibold text-xs sm:text-sm rounded-xl active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* PRODUCT SPECIFICATIONS & WHAT'S IN THE BOX */}
      {((productData.specifications && productData.specifications.length > 0) || (productData.whatsInTheBox && productData.whatsInTheBox.length > 0)) && (
        <section className="w-full py-4 sm:py-8 lg:py-12 bg-[#FBFBF7] dark:bg-[#0E1524] border-t border-neutral-200/80 dark:border-neutral-800 transition-colors">
          <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col items-center text-center mb-8">
              <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
                Product <span className="text-[#900606] whitespace-nowrap">Specifications</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {productData.specifications && productData.specifications.length > 0 && (
                <div className={productData.whatsInTheBox && productData.whatsInTheBox.length > 0 ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl mx-auto w-full"}>
                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#131C2E] overflow-hidden shadow-sm divide-y divide-neutral-200/70 dark:divide-neutral-800">
                    {productData.specifications.map((spec, idx) => (
                      <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 text-xs sm:text-sm ${idx % 2 === 0 ? 'bg-white dark:bg-[#131C2E]' : 'bg-[#F9F9F5] dark:bg-[#172236]'}`}>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 sm:w-2/5">{spec.label}</span>
                        <span className="text-neutral-600 dark:text-neutral-400 font-medium sm:text-right sm:w-3/5">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {productData.whatsInTheBox && productData.whatsInTheBox.length > 0 && (
                <div className={productData.specifications && productData.specifications.length > 0 ? "lg:col-span-5 space-y-2.5" : "lg:col-span-12 max-w-2xl mx-auto w-full space-y-2.5"}>
                  {productData.whatsInTheBox.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-[#131C2E] rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#900606] shrink-0"></span>
                      <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}