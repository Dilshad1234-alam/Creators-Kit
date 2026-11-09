'use client';

import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Camera,
  ThumbsUp,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

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

const defaultCustomerReviews = [
  {
    id: 1,
    name: 'Vijay Jalaki',
    verified: true,
    rating: 5,
    date: '10/22/2026',
    comment:
      'Comprehensive studio gear that actually feels premium. The fluid head tripod alone is worth the entry price point. Holds my DSLR and phone with zero wobble even at full height.',
  },
  {
    id: 2,
    name: 'Jasmine Singh',
    verified: true,
    rating: 5,
    date: '10/20/2026',
    comment:
      'It was good very comfortable to use i love it. The quick-release plate makes switching angles super quick for Instagram reels and YouTube shorts.',
  },
  {
    id: 3,
    name: 'Rishi Aditya',
    verified: true,
    rating: 5,
    date: '10/18/2026',
    comment:
      'The best purchase for run-and-gun content! Lightweight to carry outdoors and the phone mount holds super tight. Highly recommended for every Indian content creator.',
  },
];

const customerPhotos = [
  { src: '/tripod6.png', title: 'Unboxing setup' },
  { src: '/tripod1.png', title: 'Outdoor shoot' },
  { src: '/tripod2.png', title: 'Pan head close-up' },
  { src: '/tripod4.png', title: 'Studio recording' },
];

const defaultFaqs = [
  {
    q: 'Is this tripod compatible with both smartphones and DSLR cameras?',
    a: 'Yes! It features a universal standard 1/4-inch mounting screw and comes with a 360-degree rotating smartphone clamp suitable for all iPhone and Android devices, plus mirrorless and DSLR cameras.',
  },
  {
    q: 'What is the maximum height and folded length?',
    a: 'The tripod extends up to 170cm (5.57 Feet) for eye-level recording and folds compactly to just 50cm, fitting easily into the included travel carry bag.',
  },
  {
    q: 'Does it come with an official manufacturer warranty?',
    a: 'Yes, every genuine Creators Kit item includes an official 1-Year Brand Warranty covering all manufacturing and hardware defects.',
  },
  {
    q: 'How long does shipping and delivery take across India?',
    a: 'We provide Free Express Delivery across India. Orders are dispatched within 24 hours and delivered in 2–3 business days with real-time SMS & WhatsApp tracking.',
  },
  {
    q: 'What is the return and replacement policy?',
    a: 'We offer a 7-day hassle-free replacement guarantee. If your gear arrives damaged or defective, we provide an immediate free doorstep replacement.',
  },
  {
    q: 'How do I access the Free Masterclasses Bundle courses?',
    a: 'Once your purchase is completed, the 3 masterclasses (Instagram Mastery, YouTube Mastery, Filmora Mastery) are automatically unlocked in your Creators Kit account dashboard with lifetime access.',
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

  // Flow State from Wireframe
  const [quantity, setQuantity] = useState(1);
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    specification: false,
    delivery: false,
  });
  const [openFaq, setOpenFaq] = useState(null);

  // Reviews State & Modal
  const [reviewsList, setReviewsList] = useState(defaultCustomerReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [selectedReviewPhoto, setSelectedReviewPhoto] = useState(null);
  const [activeReelVideo, setActiveReelVideo] = useState(null);

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('creatorsKitTheme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

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

        const priceNum = typeof p.price === 'number' ? p.price : Number(p.price) || 999;
        const mrpNum = p.originalPrice ? Number(p.originalPrice) : Math.round(priceNum * 1.3);
        let discountStr = p.discount || '';
        if (!discountStr && mrpNum > priceNum) {
          discountStr = `${Math.round(((mrpNum - priceNum) / mrpNum) * 100)}% OFF`;
        }

        const rawImages = (Array.isArray(p.images) && p.images.length > 0)
          ? p.images
          : [
              {
                src: p.image || '/tripod6.png',
                title: p.name,
                subtitle: p.subheading || p.category || '',
                description: p.description || '',
                price: priceNum,
                originalPrice: mrpNum,
              },
            ];

        // Ensure at least 3-4 multi-angle views for single products like Tripod
        let parsedImages = rawImages.map((im, idx) => {
          if (typeof im === 'string') {
            return {
              src: im,
              title: `${p.name} Angle ${idx + 1}`,
              subtitle: p.subheading || p.category || '',
              description: p.description || '',
              price: priceNum,
              originalPrice: mrpNum,
            };
          }
          return {
            src: im.src || p.image || '/tripod6.png',
            title: im.title || p.name,
            subtitle: im.subtitle || p.subheading || '',
            description: im.description || p.description || '',
            price: im.price || priceNum,
            originalPrice: im.originalPrice || mrpNum,
            discount: im.discount || discountStr,
          };
        });

        // Add additional sample angles if only 1 image exists for an individual tripod/product
        if (parsedImages.length === 1 && (p.name?.toLowerCase().includes('tripod') || p.slug === 'tripod')) {
          parsedImages = [
            { src: '/tripod6.png', title: 'Foldable Tripod Front View' },
            { src: '/tripod1.png', title: 'Adjustable Phone & Camera Mount' },
            { src: '/tripod2.png', title: '3-Way Pan Head & Bubble Level' },
            { src: '/tripod4.png', title: 'Full Height Extended Setup' },
          ];
        }

        const productVideo = (p.video || p.videoUrl || '').trim();
        if (productVideo && !parsedImages.some((im) => im.src === productVideo)) {
          parsedImages.push({
            src: productVideo,
            title: `${p.name} (Video)`,
            subtitle: 'Watch Product Demo',
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
            slug: p.slug || p.id,
            category: p.category || 'Stands & Mounts',
            video: productVideo,
            subtitle: p.subheading || p.category || 'Heavy-duty lightweight aluminum studio setup',
            price: priceNum,
            mrp: mrpNum,
            discount: discountStr || '23% OFF',
            rating: p.rating || 4.8,
            reviewsCount: p.reviewsCount || 120,
            stock: p.stock || 10,
            sold: p.stock ? `${p.stock} units available` : 'In Stock – Ready to Ship',
            image: p.image || parsedImages[0]?.src || '/tripod6.png',
            images: parsedImages,
            description:
              p.description ||
              'Creator Kit Lightweight Aluminium Tripod designed for smartphones and cameras with 3-Way Pan Head, Bubble Level, Quick-Release Plate and standard 1/4 inch screw. Engineered for smooth pans and ultra-stable shoots.',
            features:
              Array.isArray(p.features) && p.features.length > 0
                ? p.features
                : [
                    '3-Way Smooth Pan Head with 360° Horizontal Swivel',
                    'Built-in Bubble Level for perfect framing & alignment',
                    'Quick-Release Plate with Standard 1/4" Mounting Screw',
                    'Multi-section Aluminum Legs with Quick-Flip Locks',
                  ],
            specifications:
              Array.isArray(p.specifications) && p.specifications.length > 0
                ? p.specifications
                : [
                    { label: 'Brand', value: 'Creators Kit' },
                    { label: 'Model', value: 'DTR 555 SS Foldable Pro' },
                    { label: 'Material', value: 'Premium Aerospace-Grade Aluminum Alloy' },
                    { label: 'Maximum Height', value: '170 cm (5.57 Feet)' },
                    { label: 'Folded Length', value: '50 cm (Compact Travel Size)' },
                    { label: 'Max Load Capacity', value: 'Up to 3.5 kg' },
                    { label: 'Mounting Screw', value: 'Standard 1/4" Universal Thread' },
                    { label: 'Phone Holder', value: 'Included 360° Rotating Smartphone Mount' },
                    { label: 'Warranty', value: '1 Year Official Manufacturer Warranty' },
                  ],
            whatsInTheBox:
              Array.isArray(p.whatsInTheBox) && p.whatsInTheBox.length > 0
                ? p.whatsInTheBox
                : [
                    { name: '1 × Heavy-Duty Professional Tripod Stand' },
                    { name: '1 × Universal Smartphone Mount Holder' },
                    { name: '1 × Quick-Release Base Plate' },
                    { name: '1 × Durable Shoulder Travel Carry Bag' },
                  ],
            isBundle: Boolean(p.isBundle),
            productType: p.productType || 'individual',
            includeBonusCourses: p.includeBonusCourses !== undefined ? p.includeBonusCourses : true,
            bonusMasterclasses:
              Array.isArray(p.bonusMasterclasses) && p.bonusMasterclasses.length > 0
                ? p.bonusMasterclasses
                : defaultBonusMasterclasses,
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
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

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/product');
    }
  };

  const activeVariant = useMemo(() => {
    if (!productData?.images || productData.images.length === 0) return {};
    return productData.images[selectedImageIndex] || productData.images[0] || {};
  }, [productData, selectedImageIndex]);

  const activeSrc = activeVariant.src || productData?.image || '/tripod6.png';
  const activeTitle = activeVariant.title || productData?.name || 'Tripod';
  const activePrice = activeVariant.price || productData?.price || 999;
  const activeMrp = activeVariant.originalPrice || productData?.mrp || 1299;
  const activeDiscount = activeVariant.discount || productData?.discount || '23% OFF';

  const activeBonusCourses = useMemo(() => {
    if (!productData?.bonusMasterclasses) return defaultBonusMasterclasses;
    return productData.bonusMasterclasses.filter((c) => c.active !== false);
  }, [productData]);

  const totalBonusValue = activeBonusCourses.reduce((sum, c) => sum + (Number(c.originalPrice) || 1999), 0);

  const handleAddToCart = () => {
    if (!productData) return;
    const cartImg = isVideoUrl(activeSrc) ? productData.image || '/tripod6.png' : activeSrc;
    addToCart({
      id: `${productData.id}-${selectedImageIndex}`,
      name: productData.name,
      price: activePrice,
      quantity: quantity,
      img: cartImg,
      image: cartImg,
    });
    router.push('/cart');
  };

  const handleBuyNow = () => {
    if (!productData) return;
    const cartImg = isVideoUrl(activeSrc) ? productData.image || '/tripod6.png' : activeSrc;
    buyNow({
      id: `${productData.id}-${selectedImageIndex}`,
      name: productData.name,
      price: activePrice,
      quantity: quantity,
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
      } catch (e) {}
    }
    const isLoggedIn = (user?.email || sessionEmail) && userRole !== 'admin' && user?.role !== 'admin';

    if (!isLoggedIn) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('creatorskit-open-auth', {
            detail: { mode: 'register', redirectUrl: '/checkout' },
          })
        );
      }
    } else {
      router.push('/checkout');
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: newReviewAuthor.trim(),
      verified: true,
      rating: Number(newReviewRating) || 5,
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      comment: newReviewComment.trim(),
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setIsReviewModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FBFBF7] text-neutral-900 font-sans w-full pt-20 sm:pt-28 pb-16">
        <div className="w-full max-w-[1400px] 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="h-6 w-32 bg-neutral-200 rounded-md mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="aspect-square rounded-3xl bg-neutral-200/80 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 rounded-xl w-3/4 animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded-md w-1/3 animate-pulse" />
              <div className="h-10 bg-neutral-200 rounded-xl w-1/2 mt-6 animate-pulse" />
              <div className="h-14 bg-neutral-200 rounded-2xl w-full mt-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData || error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FBFBF7] text-neutral-900 font-sans w-full pt-24 pb-20 justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#900606] flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</h1>
          <p className="text-sm text-neutral-500 mb-6">The equipment or creator item you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/product')}
            className="w-full py-3 bg-[#900606] text-white font-bold text-sm rounded-xl hover:bg-[#7a0505] transition shadow-md"
          >
            Browse All Studio Gear
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-[#111827] font-sans pt-24 sm:pt-28 md:pt-32 pb-24 md:pb-16 selection:bg-[#900606] selection:text-white">
      <main className="w-full max-w-[1400px] 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">

        {/* 1. TOP BREADCRUMBS & BACK BUTTON */}
        <div className="flex items-center justify-between gap-4 py-3 sm:py-4 text-xs font-medium text-neutral-500">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Back</span>
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 truncate text-[11px] sm:text-xs">
            <Link href="/" className="hover:text-[#900606] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/product" className="hover:text-[#900606] transition-colors">Products</Link>
            <span>/</span>
            <span className="text-neutral-900 font-semibold truncate max-w-[200px] md:max-w-xs">{productData.name}</span>
          </nav>
        </div>

        {/* 2. RESPONSIVE HERO SECTION (DESKTOP: 2-COLUMN BALANCED | MOBILE: STACKED) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-start w-full pt-1 pb-8">

          {/* LEFT: PRODUCT IMAGE GALLERY & MOBILE CAROUSEL */}
          <div className="w-full flex flex-col gap-3">
            {/* Main Showcase Card */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square lg:h-[500px] xl:h-[540px] rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/90 shadow-sm overflow-hidden flex items-center justify-center group">
              <span className="absolute top-3.5 left-3.5 z-20 bg-[#900606] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                {productData.isBundle ? 'CREATOR BUNDLE' : 'BESTSELLER'}
              </span>

              {activeDiscount && (
                <span className="absolute top-3.5 right-3.5 z-20 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                  {activeDiscount}
                </span>
              )}

              {/* Navigation Arrows */}
              {productData.images && productData.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + productData.images.length) % productData.images.length)}
                    aria-label="Previous Image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition border border-neutral-200 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % productData.images.length)}
                    aria-label="Next Image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition border border-neutral-200 cursor-pointer active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </>
              )}

              {/* Media Container */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {isEmbedUrl(activeSrc) ? (
                  <iframe
                    src={getEmbedUrl(activeSrc)}
                    title={activeTitle}
                    className="w-full h-full border-0 rounded-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : isVideoUrl(activeSrc) ? (
                  <video src={activeSrc} controls autoPlay muted loop playsInline className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Image
                    src={getImageUrl(activeSrc)}
                    alt={activeTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                )}
              </div>

              {/* Mobile Carousel Pagination Dots */}
              {productData.images && productData.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  {productData.images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        selectedImageIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Thumbnails Row */}
            {productData.images && productData.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
                {productData.images.map((im, idx) => {
                  const src = typeof im === 'string' ? im : im.src;
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#900606] shadow-sm ring-2 ring-[#900606]/20 scale-102'
                          : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <Image src={getImageUrl(src)} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover object-center" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS, PRICING, STOCK, ACTIONS & ACCORDIONS */}
          <div className="w-full flex flex-col justify-start">
            
            {/* Title & Category Subtitle */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
              {productData.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
              {productData.category} • {productData.subtitle}
            </p>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <span className="font-bold text-neutral-900">{productData.rating} ({productData.reviewsCount} reviews)</span>
              <span className="text-neutral-300">|</span>
              <span className="text-neutral-500 font-medium">{productData.stock} units available</span>
            </div>

            {/* Price Box */}
            <div className="mt-4 pt-3 border-t border-neutral-200">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-[#900606]">
                  ₹{Number(activePrice).toLocaleString('en-IN')}
                </span>
                {activeMrp > activePrice && (
                  <span className="text-lg text-neutral-400 line-through font-normal">
                    ₹{Number(activeMrp).toLocaleString('en-IN')}
                  </span>
                )}
                {activeDiscount && (
                  <span className="bg-[#900606] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {activeDiscount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Tax included. <span className="font-semibold text-neutral-700">Free Express Delivery across India.</span>
              </p>
            </div>

            {/* Quantity Selector & In-Stock Status */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-neutral-700">Quantity:</span>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-neutral-900 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="px-3 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>In Stock – Ready to Ship</span>
              </div>
            </div>

            {/* ACTION BUTTONS (ADD TO CART & BUY NOW) */}
            <div className="flex gap-3 mt-5 w-full">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-300 hover:border-neutral-400 font-bold text-xs sm:text-sm rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 text-neutral-700" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3 px-4 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs sm:text-sm rounded-xl active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now</span>
                <span className="text-white/80">➔</span>
              </button>
            </div>

            {/* COLLAPSIBLE ACCORDIONS (DESCRIPTION, SPECIFICATION, DELIVERY & RETURN) */}
            <div className="mt-6 border border-neutral-200 rounded-2xl bg-white overflow-hidden divide-y divide-neutral-200 shadow-2xs">
              
              {/* Accordion 1: Description */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span>Description</span>
                  {openAccordions.description ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>
                {openAccordions.description && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-[#FAF9F5]">
                    <p>{productData.description}</p>
                    {productData.features && productData.features.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {productData.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                            <span className="text-[#900606] font-bold mt-0.5">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Specification */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('specification')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span>Specification</span>
                  {openAccordions.specification ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>
                {openAccordions.specification && (
                  <div className="px-4 pb-4 pt-1 text-xs border-t border-neutral-100 bg-[#FAF9F5]">
                    <div className="divide-y divide-neutral-200/70 rounded-xl overflow-hidden border border-neutral-200 bg-white">
                      {productData.specifications.map((spec, idx) => (
                        <div key={idx} className="flex justify-between py-2 px-3 text-xs">
                          <span className="font-semibold text-neutral-800 w-1/2">{spec.label}</span>
                          <span className="text-neutral-600 font-medium text-right w-1/2">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Delivery and Return */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span>Delivery and Return</span>
                  {openAccordions.delivery ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>
                {openAccordions.delivery && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-[#FAF9F5] space-y-2">
                    <p>• <strong>Free Express Delivery:</strong> Dispatched within 24 hours. Delivery in 2–3 business days across all India PIN codes.</p>
                    <p>• <strong>7-Day Replacement Guarantee:</strong> Hassle-free replacement if damaged during transit or defective on arrival.</p>
                    <p>• <strong>1-Year Manufacturer Warranty:</strong> 100% genuine guaranteed with official support and claim assistance.</p>
                  </div>
                )}
              </div>

            </div>

            {/* TRUST BADGES ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 border-t border-neutral-200 text-center mt-5">
              {[
                { icon: Truck, title: 'Free Delivery', sub: '2-3 days' },
                { icon: RotateCcw, title: '7 Days Returns', sub: 'Easy replacement' },
                { icon: ShieldCheck, title: 'Secure Payment', sub: '100% safe' },
                { icon: Award, title: 'Quality Assured', sub: 'Official warranty' },
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <Icon className="w-4 h-4 text-[#900606] mb-1 stroke-[1.8]" />
                    <span className="text-xs font-bold text-neutral-800">{badge.title}</span>
                    <span className="text-[10px] text-neutral-400 font-medium">{badge.sub}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 3. CUSTOMER REVIEWS SECTION (FROM WIREFRAME COLUMN 3) */}
        <section className="w-full py-8 sm:py-12 border-t border-neutral-200 bg-[#FBFBF7]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Customer <span className="text-[#900606]">Reviews</span>
              </h2>
              <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm">
                <div className="flex text-amber-400 text-base">★★★★★</div>
                <span className="font-extrabold text-neutral-900">{productData.rating} out of 5</span>
                <span className="text-neutral-400">• Based on {reviewsList.length + 117} verified ratings</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Customer Unboxing / Review Photos Gallery */}
          <div className="mb-6 w-full">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#900606]" />
              <span>Customer Photos & Setups ({customerPhotos.length})</span>
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 sm:gap-3 w-full">
              {customerPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedReviewPhoto(photo.src)}
                  className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-white hover:border-[#900606] transition shadow-2xs group cursor-pointer"
                >
                  <Image src={getImageUrl(photo.src)} alt={photo.title} fill sizes="120px" className="object-cover group-hover:scale-110 transition duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-[#900606] font-bold text-xs flex items-center justify-center border border-red-100">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">{rev.name}</h4>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          ✓ Verified Buyer
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400 text-xs mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-neutral-100 text-[10px] text-neutral-400">
                  <ThumbsUp className="w-3 h-3 text-neutral-400" />
                  <span>Helpful (12)</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BANNER: "BUILT FOR BETTER FRAMING" / "ONE TRIPOD. ENDLESS POSSIBILITIES" */}
        <section className="w-full py-8 sm:py-12 border-t border-neutral-200 bg-[#FBFBF7]">
          <div className="max-w-4xl mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#900606] bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
              Built for better framing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mt-2.5">
              One tripod. <span className="text-[#900606]">Endless possibilities.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-600 mt-2 leading-relaxed">
              For reels, tutorials, overhead unboxings, and moments worth capturing. Engineered for high-retention creator workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs flex flex-col justify-between group">
              <div>
                <div className="relative w-full h-52 sm:h-60 md:h-64 lg:h-72 rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                  <Image src={getImageUrl('/tripod6.png')} alt="Reels & Content" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 mb-1">Reels & Content</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Smooth 360-degree panning and seamless 90-degree portrait orientation switch for viral TikTok & Instagram Reels.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs flex flex-col justify-between group">
              <div>
                <div className="relative w-full h-52 sm:h-60 md:h-64 lg:h-72 rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                  <Image src={getImageUrl('/tripod1.png')} alt="Built for Stability" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 mb-1">Heavy-Duty Stability</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Reinforced aluminum leg locks eliminate jitter and micro-shakes even during intense streaming and windy outdoor vlogging.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs flex flex-col justify-between group">
              <div>
                <div className="relative w-full h-52 sm:h-60 md:h-64 lg:h-72 rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                  <Image src={getImageUrl('/tripod4.png')} alt="Universal Compatibility" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 mb-1">Universal Compatibility</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  Quick-release mounting plate with standard 1/4&quot; screw compatible with all smartphones, DSLRs, ring lights, and microphones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FREE BUNDLE: FREE MASTERCLASSES OFFER */}
        {productData.includeBonusCourses && activeBonusCourses.length > 0 && (
          <section className="w-full py-8 sm:py-10 border-t border-neutral-200 bg-[#FBFBF7]">
            <div className="rounded-3xl border-2 border-red-200/90 bg-gradient-to-br from-red-50/70 via-white to-amber-50/30 p-6 sm:p-8 lg:p-10 shadow-sm w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#900606] text-white text-[11px] font-extrabold px-3 py-1 rounded tracking-wide shadow-xs uppercase">
                    <span>🎁</span> FREE BUNDLE OFFER
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight mt-2">
                    Free Creator Masterclasses Bundle
                  </h2>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-[#900606] bg-red-100/80 border border-red-200 px-3.5 py-1.5 rounded-full w-fit">
                  Worth ₹{totalBonusValue.toLocaleString('en-IN')} • 100% Free
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 max-w-3xl leading-relaxed mb-6">
                Purchasing this product automatically unlocks lifetime access to our 3 premium masterclasses directly inside your account. Master content creation from scratch.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 w-full">
                {activeBonusCourses.map((c) => (
                  <div key={c.id || c.title} className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="relative w-full h-36 lg:h-44 rounded-xl overflow-hidden bg-neutral-100 mb-3 flex items-center justify-center p-2">
                        <Image src={getImageUrl(c.image || '/video 2.webp')} alt={c.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain" />
                      </div>
                      <div className="inline-block bg-red-50 text-[#900606] text-[10px] font-bold px-2 py-0.5 rounded mb-1">
                        100% Free With Gear
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#111827]">{c.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. FAQ SEGMENT (FULL WIDTH 2-COLUMN GRID) */}
        <section className="w-full py-8 sm:py-12 border-t border-neutral-200 bg-[#FBFBF7]">
          <div className="text-center mb-8 sm:mb-10 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight">
              Frequently Asked <span className="text-[#900606] whitespace-nowrap">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-500 mt-2 max-w-2xl mx-auto">
              Everything you need to know about compatibility, warranty, and fast shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {defaultFaqs.map((faq, idx) => (
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
        </section>

        {/* 7. CONNECT WITH INFLUENCER: CREATORS IN ACTION REELS */}
        <section className="w-full py-8 sm:py-12 border-t border-neutral-200 bg-[#FBFBF7]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 max-w-4xl lg:max-w-[960px] mx-auto w-full">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#900606] bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                Creators in action
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight mt-2">
                Loved by 500+ <span className="text-[#900606]">Indian Creators</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
              Watch real creators test and review Creators Kit gear live in their home studios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-4xl lg:max-w-[960px] mx-auto w-full">
            {[
              {
                name: 'Kunal Verma',
                handle: '@kunal.tech',
                followers: '240K Followers',
                img: '/about1.png',
                video: '/videos/masterclass-sample.mp4',
                quote: 'The smoothest fluid-head tripod under ₹1,000 in India. Zero micro-jitters!',
              },
              {
                name: 'Tanvi Malhotra',
                handle: '@tanvi.creates',
                followers: '115K Followers',
                img: '/about2.png',
                video: '/videos/filmora-masterclass.mp4',
                quote: 'My overhead recipe and unboxing shoots leveled up instantly with this setup.',
              },
              {
                name: 'Aman Sharma',
                handle: '@aman.vlogs',
                followers: '320K Followers',
                img: '/about4.png',
                video: '/videos/youtube-masterclass.mp4',
                quote: 'Super lightweight to carry outdoors, yet holds my Sony camera steady on windy days.',
              },
            ].map((inf, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs flex flex-col justify-between group max-w-[300px] sm:max-w-none mx-auto w-full">
                <div className="relative h-64 sm:h-72 md:h-80 w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
                  <Image src={getImageUrl(inf.img)} alt={inf.name} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover group-hover:scale-105 transition duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button */}
                  <button
                    type="button"
                    onClick={() => setActiveReelVideo(inf.video)}
                    aria-label={`Play review by ${inf.name}`}
                    className="absolute z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#900606] shadow-xl flex items-center justify-center transition-all group-hover:scale-110 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>

                  {/* Creator Info Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10 text-white">
                    <p className="font-bold text-xs sm:text-sm leading-tight">{inf.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-neutral-300">{inf.handle} • {inf.followers}</p>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 bg-white">
                  <p className="text-xs text-neutral-600 italic leading-relaxed line-clamp-3">
                    &ldquo;{inf.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. BANNER OF CREATOR MARKET (BOTTOM STUDIO CTA) */}
        <section className="w-full my-8 sm:my-12 rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-[#5a0404] text-white p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-3">
              CREATORS MARKET
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Equip Your Studio. <br className="hidden sm:block" />
              <span className="text-amber-400">Level Up Your Reach.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-300 mt-3 leading-relaxed">
              Join 50,000+ creators turning passion into high-retention content. Complete creator kits, studio lighting, and audio gear shipped across India.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/product"
                className="px-6 py-3 bg-[#900606] hover:bg-[#a50707] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Explore Studio Gear ➔
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* 9. MOBILE FIXED STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.08)] p-3 border-t border-neutral-200">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] text-neutral-400 font-medium block">Total Price:</span>
            <span className="text-lg font-black text-[#900606]">
              ₹{(activePrice * quantity).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="py-2.5 px-3 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-xs rounded-xl active:scale-95 transition-all shadow-2xs"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="py-2.5 px-4 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs rounded-xl active:scale-95 transition-all shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* 10. WRITE A REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-neutral-200 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-1">Write a Review</h3>
            <p className="text-xs text-neutral-500 mb-4">Share your setup experience with other creators.</p>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kunal Sharma"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Rating</label>
                <div className="flex gap-1 text-2xl text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`cursor-pointer ${star <= newReviewRating ? 'text-amber-400' : 'text-neutral-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Review</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you liked about the build quality, stability, or customer service..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#900606]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-100 text-neutral-700 font-bold text-xs rounded-xl hover:bg-neutral-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#900606] text-white font-bold text-xs rounded-xl hover:bg-[#780505] transition shadow-md cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. CUSTOMER PHOTO LIGHTBOX MODAL */}
      {selectedReviewPhoto && (
        <div
          onClick={() => setSelectedReviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl w-full aspect-square bg-white rounded-3xl overflow-hidden p-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedReviewPhoto(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image src={getImageUrl(selectedReviewPhoto)} alt="Customer unboxing photo" fill sizes="600px" className="object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* 12. INFLUENCER REEL PLAYBACK MODAL */}
      {activeReelVideo && (
        <div
          onClick={() => setActiveReelVideo(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-sm w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveReelVideo(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <video src={activeReelVideo} controls autoPlay playsInline className="w-full h-full object-cover" />
          </div>
        </div>
      )}

    </div>
  );
}
