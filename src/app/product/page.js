'use client';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
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

const defaultProduct = {
  id: 'rode-wireless-go-2',
  name: 'Creators Studio Gear',
  rating: 4.8,
  reviewsCount: 120,
  soldCount: '1k+',
  price: 3999,
  originalPrice: 4999,
  discount: '17% OFF',
  inStock: true,
  includeBonusCourses: true,
  bonusMasterclasses: defaultBonusMasterclasses,
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
    {
      title: 'Dual Channel Wireless System',
      desc: 'Record two people simultaneously with crystal-clear audio.'
    },
    {
      title: '200m Transmission Range',
      desc: 'Stable wireless connection even in challenging environments.'
    },
    {
      title: 'Up to 7 Hours Battery Life',
      desc: 'Create for longer with reliable built-in battery.'
    },
    {
      title: 'Compact & Lightweight',
      desc: 'Ultra-portable design that fits in your pocket.'
    }
  ],
  specifications: [
    { label: 'Brand', value: 'Creators Kit' },
    { label: 'Model', value: 'Pro Creator Bundle V2' },
    { label: 'Kit Type', value: 'All-in-One Studio & Lighting Setup' },
    { label: 'Lighting Range', value: 'Adjustable Brightness & Color Temp' },
    { label: 'Power Source', value: 'USB Powered / Adapter Included' },
    { label: 'Compatibility', value: 'DSLR, Mirrorless, Smartphones & Laptops' },
    { label: 'Warranty', value: '1 Year Official Brand Warranty' }
  ],
  whatsInTheBox: [
    { name: '1 × 18-Inch Professional Ring Light' },
    { name: '1 × Heavy-Duty Studio Tripod Stand' },
    { name: '1 × Smartphone & Camera Mount Holder' },
    { name: '1 × Green Screen Backdrop (Optional)' },
    { name: '1 × Professional Studio Condenser Microphone' },
    { name: '1 × Portable RGB Tube Light for Background' },
    { name: '3 × Free Masterclass Video Courses (100% Free)' }
  ]
};

export default function ProductPage() {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistToast, setWishlistToast] = useState(false);
  const [product, setProduct] = useState(defaultProduct);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialBundles = [
    {
      id: 'pro-creator-kit',
      name: 'Pro Creator Kit',
      price: 9999,
      oldPrice: 14999,
      discount: '33% OFF',
      image: '/pro1.png',
      popular: true,
      tag: 'Most Popular',
      items: ['Rode Wireless GO II', 'Ring Light with Stand', 'Tripod Stand', 'Green Screen', 'Carry Bag']
    },
    {
      id: 'basic-creator-kit',
      name: 'Basic Creator Kit',
      price: 4999,
      oldPrice: 6999,
      discount: '28% OFF',
      image: '/pro.png',
      popular: false,
      items: ['Wireless Mic (Basic)', 'Tripod Stand', 'Ring Light', 'Carry Bag']
    },
    {
      id: 'ultimate-creator-kit',
      name: 'Ultimate Creator Kit',
      price: 14999,
      oldPrice: 24999,
      discount: '40% OFF',
      image: '/pro2.png',
      popular: false,
      items: ['Dual RGB Panels', 'Boom Arm Mic System', 'Carbon Fiber Tripod', 'Chroma Key Curtain', 'Hard Case']
    }
  ];

  const initialRelated = [
    { id: 'digitek-ring-light-18', name: 'Digitek Ring Light 18"', price: 2499, mrp: 3499, discount: '28% OFF', image: '/ring.jpg' },
    { id: 'digitek-dtr-550-tripod', name: 'Digitek DTR 550 LW Tripod', price: 1999, mrp: 2499, discount: '20% OFF', image: '/tripod.jpg' },
    { id: 'green-screen-backdrop', name: 'Green Screen Backdrop', price: 799, mrp: 1299, discount: '38% OFF', image: '/chorma2.png' },
    { id: 'rode-wireless-go-ii', name: 'Rode Wireless GO II', price: 24999, mrp: 29999, discount: '16% OFF', image: '/wireless-mic.jpg' }
  ];

  const faqs = [
    { q: 'Is this compatible with smartphones?', a: 'Yes, it comes with cables compatible with both Android and iOS smartphones.' },
    { q: 'Does it come with warranty?', a: 'Yes, includes a 1-year official manufacturer warranty.' },
    { q: 'What is the battery life?', a: 'Up to 7 hours of continuous recording on a single charge.' },
    { q: 'Is it suitable for interviews?', a: 'Yes, dual channel recording makes it ideal for two-person interviews.' },
    { q: 'Can I use it for live streaming?', a: 'Absolutely, it plugs directly into computers and capture cards.' },
    { q: 'Can I connect it to a laptop?', a: 'Yes, via USB-C plug-and-play connectivity.' }
  ];

  const [bundles, setBundles] = useState(initialBundles);

  const [mobileBundleRef, mobileBundleEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollBundleNext = useCallback(() => {
    if (mobileBundleEmbla) mobileBundleEmbla.scrollNext();
  }, [mobileBundleEmbla]);

  const scrollBundlePrev = useCallback(() => {
    if (mobileBundleEmbla) mobileBundleEmbla.scrollPrev();
  }, [mobileBundleEmbla]);

  const mobileBundles = bundles && bundles.length > 0
    ? (bundles.length <= 4 ? [...bundles, ...bundles, ...bundles] : bundles)
    : [];

  const [mobileProdRef, mobileProdEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollProdNext = useCallback(() => {
    if (mobileProdEmbla) mobileProdEmbla.scrollNext();
  }, [mobileProdEmbla]);

  const scrollProdPrev = useCallback(() => {
    if (mobileProdEmbla) mobileProdEmbla.scrollPrev();
  }, [mobileProdEmbla]);

  const [relatedProducts, setRelatedProducts] = useState(initialRelated);

  const mobileFeaturedProducts = relatedProducts && relatedProducts.length > 0
    ? (relatedProducts.length <= 4 ? [...relatedProducts, ...relatedProducts, ...relatedProducts] : relatedProducts)
    : [];

  useEffect(() => {
    async function loadDynamicCatalog() {
      try {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const targetId = urlParams?.get('id') || urlParams?.get('productId') || 'rode-wireless-go-2';

        const [bundleRes, prodRes, heroRes] = await Promise.all([
          fetch('/api/bundles').catch(() => null),
          fetch('/api/products?type=individual').catch(() => null),
          fetch(`/api/products/${targetId}`).catch(() => null),
        ]);

        let productItem = null;
        if (heroRes && heroRes.ok) {
          const heroData = await heroRes.json();
          productItem = heroData.data;
        } else if (targetId !== 'rode-wireless-go-2') {
          // Fallback to flagship gear if specific id failed
          const fallbackRes = await fetch('/api/products/rode-wireless-go-2').catch(() => null);
          if (fallbackRes && fallbackRes.ok) {
            const fbData = await fallbackRes.json();
            productItem = fbData.data;
          }
        }

        if (productItem) {
          const rawImages = (Array.isArray(productItem.images) && productItem.images.length > 0)
            ? productItem.images
            : [
                {
                  src: productItem.image || '/pro1.png',
                  title: productItem.name,
                  subtitle: productItem.subheading || '',
                  description: productItem.description || '',
                  price: productItem.price,
                  originalPrice: productItem.originalPrice,
                },
              ];

          setProduct((prev) => ({
            ...prev,
            id: productItem.id || productItem._id,
            name: productItem.name || prev.name,
            price: productItem.price || prev.price,
            originalPrice: productItem.originalPrice || prev.originalPrice,
            discount: productItem.discount || prev.discount,
            rating: productItem.rating || prev.rating,
            reviewsCount: productItem.reviewsCount || prev.reviewsCount,
            includeBonusCourses: productItem.includeBonusCourses !== undefined ? productItem.includeBonusCourses : true,
            bonusMasterclasses: (Array.isArray(productItem.bonusMasterclasses) && productItem.bonusMasterclasses.length > 0)
              ? productItem.bonusMasterclasses
              : defaultBonusMasterclasses,
            images: rawImages.map((im) => ({
              src: im.src || productItem.image || '/pro1.png',
              title: im.title || productItem.name,
              subtitle: im.subtitle || productItem.subheading || '',
              description: im.description || productItem.description || '',
              price: im.price || productItem.price,
              originalPrice: im.originalPrice || productItem.originalPrice,
              discount: im.originalPrice && im.price && im.originalPrice > im.price
                ? `${Math.round(((im.originalPrice - im.price) / im.originalPrice) * 100)}% OFF`
                : (productItem.discount || prev.discount),
            })),
          }));
        }

        if (bundleRes && bundleRes.ok) {
          const bData = await bundleRes.json();
          if (bData.data && bData.data.length > 0) {
            setBundles(
              bData.data.map((b) => ({
                id: b.id || b._id,
                _id: b._id,
                name: b.name,
                price: typeof b.price === 'number' ? b.price : Number(b.price) || 0,
                oldPrice: b.originalPrice || '',
                discount: b.discount || '',
                image: b.image || '/pro1.png',
                popular: b.tag === 'Most Popular',
                items: b.items || b.features || [],
              }))
            );
          }
        }

        if (prodRes && prodRes.ok) {
          const pData = await prodRes.json();
          if (pData.data && pData.data.length > 0) {
            setRelatedProducts(
              pData.data.map((p) => {
                const priceNum = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
                const mrpNum = p.originalPrice || Math.round(priceNum * 1.3);
                return {
                  id: p.id || p._id,
                  _id: p._id,
                  name: p.name,
                  price: priceNum,
                  mrp: mrpNum,
                  discount: p.discount || `${Math.round(((mrpNum - priceNum) / mrpNum) * 100)}% OFF`,
                  image: p.image || '/ring.jpg',
                };
              })
            );
          }
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      }
    }
    loadDynamicCatalog();
  }, []);

  const activeVariant =
    (product.images && product.images[currentImageIndex]) ||
    (product.images && product.images[0]) ||
    defaultProduct.images[0];
  const activePrice = activeVariant.price || product.price;
  const activeOriginalPrice = activeVariant.originalPrice || product.originalPrice;
  const activeDiscount =
    activeVariant.discount ||
    (activeOriginalPrice && activePrice && activeOriginalPrice > activePrice
      ? `${Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)}% OFF`
      : product.discount);

  const activeBonusCourses = (product.bonusMasterclasses || defaultBonusMasterclasses)
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
  const totalBonusValue = activeBonusCourses.reduce((sum, c) => sum + (Number(c.originalPrice) || 1999), 0);
  const shouldShowBonus = product.includeBonusCourses !== false && activeBonusCourses.length > 0;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${currentImageIndex}`,
      name: activeVariant.title,
      price: activePrice,
      quantity,
      img: activeVariant.src,
      image: activeVariant.src
    });
    router.push('/cart');
  };

  const handleBuyNow = () => {
    buyNow({
      id: `${product.id}-${currentImageIndex}`,
      name: activeVariant.title,
      price: activePrice,
      quantity,
      img: activeVariant.src,
      image: activeVariant.src
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-[100svh] bg-[#FBFBF7] text-[#111827] font-sans pb-2 sm:pb-4">
      <main className="w-full pt-14 sm:pt-20 md:pt-24">
        
        {/* PRODUCT HERO SECTION */}
        <section className="w-full pt-0 pb-1.5 sm:pb-5 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-6 lg:gap-10 xl:gap-12 items-start">
            
            {/* THUMBNAILS + MAIN IMAGE */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-2 md:gap-2.5 lg:gap-3 items-start w-full">
              {/* THUMBNAILS */}
              <div className="flex md:flex-col gap-1.5 sm:gap-2 md:gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible no-scrollbar pb-0 md:pb-0 shrink-0 w-full md:w-[160px] lg:w-[180px] xl:w-[200px]">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-1 min-w-[84px] max-w-[108px] h-[72px] sm:h-[82px] md:h-[105px] lg:h-[115px] xl:h-[125px] md:w-[160px] lg:w-[180px] xl:w-[200px] md:flex-none rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-[2.5px] bg-white flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      currentImageIndex === idx
                        ? 'border-[#900606] shadow-sm ring-2 ring-[#900606]/20'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image src={getImageUrl(img.src)} alt={img.title} fill sizes="(max-width: 768px) 30vw, 220px" className="object-cover object-center" />
                  </button>
                ))}
              </div>

              {/* MAIN IMAGE SHOWCASE */}
              <div className="relative flex-1 min-w-0 w-full aspect-square sm:aspect-[4/3] md:aspect-auto md:h-[540px] lg:h-[600px] xl:h-[660px] rounded-2xl md:rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden order-1 md:order-2 group">
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex items-center gap-2">
                  <span className="bg-[#900606] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Bestseller
                  </span>
                </div>

                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200/80 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200/80 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>

                <Image
                  src={getImageUrl(activeVariant.src)}
                  alt={activeVariant.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-all duration-300"
                  priority
                />
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#111827] tracking-tight">
                  {activeVariant.title}
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-1.5 leading-snug">
                  {activeVariant.subtitle}
                </p>

                <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span className="font-bold text-neutral-800">{product.rating} ({product.reviewsCount} reviews)</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-500 font-medium">{product.soldCount} sold</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#900606]">₹{activePrice.toLocaleString()}</span>
                    <span className="text-lg text-neutral-400 line-through font-normal">₹{activeOriginalPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-normal mt-0.5">Inclusive of all taxes</p>
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-2">✓ In Stock - Ready to Ship</p>
                </div>

                <p className="text-neutral-600 text-xs sm:text-sm font-bold leading-relaxed mt-3">
                  {activeVariant.description}
                </p>
              </div>

              {/* FREE MASTERCLASSES BUNDLE OFFER (DYNAMICALLY LINKED TO MONGODB) */}
              {shouldShowBonus && (
                <div className="mt-5 rounded-2xl border-2 border-red-200/90 bg-gradient-to-br from-red-50/70 via-white to-amber-50/30 p-4 sm:p-5 shadow-sm relative overflow-hidden">

                  <h3 className="text-sm sm:text-base font-extrabold text-[#111827] tracking-tight">
                    Free Masterclasses Bundle 
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    Purchasing this product automatically unlocks lifetime access to all courses directly inside your account:
                  </p>

                  {/* Clean 3 Course Thumbnail Cards */}
                  <div className={`grid ${activeBonusCourses.length === 1 ? 'grid-cols-1' : activeBonusCourses.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2.5 sm:gap-3 mt-3.5`}>
                    {activeBonusCourses.map((c) => (
                      <div
                        key={c.id || c.title}
                        className="group flex flex-col items-center text-center cursor-pointer"
                      >
                        <div className="w-full h-20 sm:h-24 md:h-28 rounded-xl overflow-hidden relative mb-2 flex items-center justify-center">
                          <Image
                            src={getImageUrl(c.image || '/video.webp')}
                            alt={c.title}
                            fill
                            sizes="(max-width: 768px) 33vw, 150px"
                            className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-bold text-xs sm:text-[12px] text-[#111827] line-clamp-2 md:line-clamp-1 leading-tight group-hover:text-[#900606] transition-colors">
                          {c.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS (INLINE BELOW BUNDLE) */}
              <div className="flex gap-3 mt-2 mb-1 w-full">
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="flex-1 py-3 px-4 bg-white text-gray-800 border border-gray-300 font-medium text-xs sm:text-sm rounded-lg hover:bg-neutral-50 hover:border-neutral-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  type="button"
                  className="flex-1 py-3 px-4 bg-[#8B0000] hover:bg-[#720000] text-white font-semibold text-xs sm:text-sm rounded-lg active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 mt-1 border-t border-neutral-200 text-center">
                <div className="flex flex-col items-center"><span className="text-[11px] font-bold text-neutral-800">Free Delivery</span><span className="text-[9px] text-neutral-400">2-3 days</span></div>
                <div className="flex flex-col items-center"><span className="text-[11px] font-bold text-neutral-800">7 Days Returns</span><span className="text-[9px] text-neutral-400">Easy replacement</span></div>
                <div className="flex flex-col items-center"><span className="text-[11px] font-bold text-neutral-800">Secure Payment</span><span className="text-[9px] text-neutral-400">100% safe</span></div>
                <div className="flex flex-col items-center"><span className="text-[11px] font-bold text-neutral-800">Genuine Product</span><span className="text-[9px] text-neutral-400">Official warranty</span></div>
              </div>

            </div>

          </div>
        </section>

        {/* KEY FEATURES */}
        <section className="w-full pt-1 pb-2 sm:py-6 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight pb-1.5 sm:pb-4">
              Key <span className="text-[#900606] whitespace-nowrap">Features</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-start"
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-red-50 text-[#900606] flex items-center justify-center font-bold text-xs sm:text-base shrink-0 mb-2.5 sm:mb-3.5">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#080b11] text-xs sm:text-base lg:text-lg mb-1 sm:mb-1.5 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 text-[11px] sm:text-xs md:text-sm font-normal leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GET MORE WITH BUNDLE */}
        <section className="w-full pt-1 pb-3 sm:py-6 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-8 items-center">
              <div className="lg:col-span-3 text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight pb-1 sm:pb-4">
                  Get More with <span className="text-[#900606] whitespace-nowrap">Bundle</span>
                </h2>
                <p className="text-neutral-600 text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-2.5 lg:mb-6">
                  Upgrade your modern creator studio with our all-in-one professional bundles. Carefully curated for YouTubers, podcasters, livestreamers, and digital storytellers, each complete setup integrates broadcast-grade lighting, crystal-clear audio, heavy-duty tripod stability, and premium backdrops. Save more on essential studio gear while gaining instant, lifetime access to our 3 exclusive creator masterclasses 100% free with every bundle.
                </p>
              </div>

              <div className="lg:col-span-9 w-full">
                {/* MOBILE VIEW (block md:hidden) - EXACT 1 CARD SLIDER WITH ARROWS (HOMEPAGE STYLE) */}
                <div className="block md:hidden relative w-full px-2">
                  {/* Left Arrow Button */}
                  <button
                    type="button"
                    onClick={scrollBundlePrev}
                    aria-label="Previous bundle"
                    className="absolute left-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    type="button"
                    onClick={scrollBundleNext}
                    aria-label="Next bundle"
                    className="absolute right-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                  </button>

                  {/* Embla Viewport - 1 Card at a Time */}
                  <div className="overflow-hidden w-full px-1" ref={mobileBundleRef}>
                    <div className="flex">
                      {mobileBundles.map((bundle, idx) => {
                        const targetId = bundle.id || bundle._id;
                        const bundleTag = bundle.tag || (bundle.popular ? 'Best Seller' : 'Most Popular');
                        const bundlePrice = typeof bundle.price === 'number' ? `₹${bundle.price.toLocaleString('en-IN')}` : bundle.price;
                        const bundleOldPrice = bundle.oldPrice ? (String(bundle.oldPrice).startsWith('₹') ? bundle.oldPrice : `₹${Number(bundle.oldPrice).toLocaleString('en-IN')}`) : null;
                        const bundleItems = bundle.items || bundle.features || [];

                        return (
                          <div
                            key={`${targetId}-${idx}`}
                            className="flex-[0_0_100%] min-w-0 px-2 shrink-0"
                          >
                            <div className="group bg-white border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden flex flex-col transition-shadow duration-300 h-full justify-between">
                              <div>
                                {/* Image Container with aspect-[4/3] & Tag */}
                                <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                                  {bundleTag && (
                                    <div className="absolute top-3 left-3 z-20">
                                      <span className="bg-[#900606] text-white text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase shadow-md">
                                        {bundleTag}
                                      </span>
                                    </div>
                                  )}

                                  <Image
                                    src={getImageUrl(bundle.image)}
                                    alt={bundle.name}
                                    fill
                                    sizes="85vw"
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-5 flex flex-col">
                                  <h3 className="font-bold text-[#111827] text-lg mb-2">
                                    {bundle.name}
                                  </h3>

                                  {/* Pricing & Discount */}
                                  <div className="flex items-baseline gap-2 mb-3">
                                    <span className="font-bold text-2xl text-[#111827]">{bundlePrice}</span>
                                    {bundleOldPrice && (
                                      <span className="text-xs text-neutral-400 font-medium line-through">MRP {bundleOldPrice}</span>
                                    )}
                                  </div>

                                  {/* Features List */}
                                  {bundleItems.length > 0 && (
                                    <ul className="space-y-2 mb-4">
                                      {bundleItems.slice(0, 5).map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2.5 text-neutral-600 text-xs font-medium">
                                          <span className="text-[#900606] font-bold">✓</span>
                                          <span className="line-clamp-1">{feature}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>

                              {/* View Details Button with Slide-Up Hover Effect & rounded-xl */}
                              <div className="px-4 pb-4">
                                <Link 
                                  href={`/bundle/${targetId}`}
                                  className="relative isolate w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-xs sm:text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
                                >
                                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0 pointer-events-none"></span>
                                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                                    View Details
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* DESKTOP VIEW (hidden md:grid md:grid-cols-3) */}
                <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-7">
                  {bundles.map((bundle) => {
                    const targetId = bundle.id || bundle._id;
                    const bundleTag = bundle.tag || (bundle.popular ? 'Best Seller' : 'Most Popular');
                    const bundlePrice = typeof bundle.price === 'number' ? `₹${bundle.price.toLocaleString('en-IN')}` : bundle.price;
                    const bundleOldPrice = bundle.oldPrice ? (String(bundle.oldPrice).startsWith('₹') ? bundle.oldPrice : `₹${Number(bundle.oldPrice).toLocaleString('en-IN')}`) : null;
                    const bundleItems = bundle.items || bundle.features || [];

                    return (
                      <div key={targetId} className="group relative bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="relative w-full h-72 lg:h-80 bg-neutral-100 overflow-hidden">
                            {bundleTag && (
                              <div className="absolute top-3.5 left-3.5 z-20">
                                <span className="bg-[#900606] text-white text-[11px] font-extrabold tracking-wider px-3.5 py-1 rounded-full uppercase shadow-md">
                                  {bundleTag}
                                </span>
                              </div>
                            )}
                            <Image 
                              src={getImageUrl(bundle.image)} 
                              alt={bundle.name} 
                              fill 
                              sizes="(max-width: 1024px) 33vw, 25vw"
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                          <div className="p-6 pb-2">
                            <h3 className="font-extrabold text-[#111827] text-xl mb-2">{bundle.name}</h3>
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="font-black text-2xl text-[#900606]">{bundlePrice}</span>
                              {bundleOldPrice && (
                                <span className="text-xs text-neutral-400 font-medium line-through">MRP {bundleOldPrice}</span>
                              )}
                            </div>
                            {bundleItems.length > 0 && (
                              <ul className="space-y-2 my-4">
                                {bundleItems.slice(0, 4).map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2.5 text-neutral-600 text-xs font-medium">
                                    <span className="text-[#900606] font-bold">✓</span>
                                    <span className="line-clamp-1">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="p-6 pt-0">
                          <Link 
                            href={`/bundle/${targetId}`}
                            className="group/btn relative mt-2 py-3.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm text-center overflow-hidden transition-all duration-300 block cursor-pointer hover:border-[#900606] shadow-2xs"
                          >
                            <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                            <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">View Details</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIFICATIONS & WHAT'S IN THE BOX */}
        <section className="w-full pt-2 pb-3 sm:py-6 bg-[#FBFBF7]">
          <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col items-center text-center mb-3 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight pb-1.5 sm:pb-3">
                Product <span className="text-[#900606] whitespace-nowrap">Specifications</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start w-full">
              {/* Product Specifications Table */}
              <div className="w-full lg:col-span-7">
                <div className="w-full rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs divide-y divide-neutral-200/70">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 sm:py-3.5 text-xs sm:text-sm gap-1 sm:gap-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F5]'}`}
                    >
                      <span className="font-semibold text-neutral-800 sm:w-2/5 shrink-0 text-xs sm:text-sm">
                        {spec.label}
                      </span>
                      <span className="text-neutral-600 font-medium sm:text-right sm:w-3/5 break-words leading-relaxed text-xs sm:text-sm">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's in the Box List */}
              <div className="w-full lg:col-span-5 space-y-2.5 mt-2 lg:mt-0">
                <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-3 px-1">
                  What&apos;s in the Box
                </h3>
                {product.whatsInTheBox.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full flex items-center gap-3 p-3.5 sm:p-4 bg-white rounded-xl border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#900606] shrink-0"></span>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-800 leading-snug break-words w-full">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full pt-2 pb-3 sm:pt-6 sm:pb-6 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">        
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight pb-3 sm:pb-6">
              Features <span className="text-[#900606] whitespace-nowrap">Products</span>
            </h2>
                    
            {/* MOBILE VIEW (block md:hidden) - EXACTLY 1 CARD PER SCREEN WITH BOTH ARROWS (HOMEPAGE STYLE) */}
            <div className="block md:hidden relative w-full px-2">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={scrollProdPrev}
                aria-label="Previous product"
                className="absolute left-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={scrollProdNext}
                aria-label="Next product"
                className="absolute right-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
              </button>

              {/* Embla Viewport - 1 Card at a Time */}
              <div className="overflow-hidden w-full px-1" ref={mobileProdRef}>
                <div className="flex">
                  {mobileFeaturedProducts.map((rel, idx) => {
                    const priceVal = typeof rel.price === 'number' ? rel.price : Number(rel.price) || 0;
                    const mrpVal = rel.mrp ? Number(rel.mrp) : Math.round(priceVal * 1.3);
                    const savePercent = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 25;
                    const rating = rel.rating || (idx % 2 === 0 ? '4.6' : '4.8');

                    return (
                      <div
                        key={`${rel.id || rel._id || 'prod'}-${idx}`}
                        className="flex-[0_0_100%] min-w-0 px-2 shrink-0"
                      >
                        <div
                          onClick={() => router.push(`/product/${rel.id || rel._id}`)}
                          className="flex flex-col bg-white rounded-3xl p-4 border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.05)] cursor-pointer group h-full justify-between"
                        >
                          <div>
                            {/* Image Container with aspect-[4/5] and Badges */}
                            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                              {/* Save % Pill Badge (Top Left) */}
                              <span className="absolute top-3 left-3 z-10 bg-[#e11d48] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-tight">
                                Save {savePercent}%
                              </span>

                              {/* Rating Pill Badge (Bottom Right) */}
                              <span className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-sm text-neutral-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                <span className="text-amber-500 text-xs">★</span>
                                <span>{rating}</span>
                              </span>

                              <Image
                                src={getImageUrl(rel.image)}
                                alt={rel.name}
                                fill
                                sizes="90vw"
                                className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="pt-3.5 pb-1">
                              <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-[#900606] transition-colors">
                                {rel.name}
                              </h3>

                              <div className="flex items-baseline gap-2 mb-3">
                                <span className="font-bold text-base sm:text-lg text-neutral-900">
                                  ₹ {priceVal.toLocaleString()}
                                </span>
                                {mrpVal > priceVal && (
                                  <span className="text-xs text-neutral-400 font-medium line-through">
                                    MRP ₹ {mrpVal.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Button: rounded-xl */}
                          <div className="pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart({
                                  id: rel.id || rel._id,
                                  name: rel.name,
                                  price: priceVal,
                                  quantity: 1,
                                  img: rel.image
                                });
                                router.push('/cart');
                              }}
                              className="relative w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-xs sm:text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
                            >
                              <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                              <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                                Add to Cart
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DESKTOP VIEW (hidden md:grid) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id || rel._id}
                  onClick={() => router.push(`/product/${rel.id || rel._id}`)}
                  className="group flex flex-col bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer justify-between"
                >
                  <div>
                    {/* Product Image Container */}
                    <div className="relative w-full h-72 sm:h-80 md:h-88 lg:h-96 bg-neutral-100/90 overflow-hidden flex items-center justify-center p-3 sm:p-4 group">
                      <Image
                        src={getImageUrl(rel.image)}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                
                    {/* Product Info */}
                    <div className="p-5 sm:p-6 pb-2">
                      <h3 className="font-extrabold text-[#111827] text-base sm:text-lg mb-2 line-clamp-1 group-hover:text-[#900606] transition-colors">
                        {rel.name}
                      </h3>
                
                      <div className="flex items-baseline gap-2.5 flex-wrap mb-4">
                        <span className="font-black text-xl sm:text-2xl text-[#900606]">
                          ₹{rel.price.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-400 font-medium line-through">
                          MRP ₹{rel.mrp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div> 
                          
                  {/* Add to Cart Button */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: rel.id || rel._id,
                          name: rel.name,
                          price: rel.price,
                          quantity: 1,
                          img: rel.image
                        });
                        router.push('/cart');
                      }}
                      className="relative w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                      <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                        Add to Cart
                      </span>
                    </button>
                  </div>
                
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full py-3 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight pb-3 sm:pb-6">
              Frequently Asked <span className="text-[#900606] whitespace-nowrap">Questions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border rounded-2xl p-5 cursor-pointer shadow-sm border-neutral-200" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <div className="flex items-center justify-between gap-4 font-bold text-[#111827] text-sm">
                    <span>{faq.q}</span>
                    <span>{openFaq === index ? '−' : '∨'}</span>
                  </div>
                  {openFaq === index && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 text-neutral-600 text-xs font-medium">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}