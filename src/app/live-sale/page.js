'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Star,
  Check,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Tag,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Mail,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Flame,
  Gift
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/lib/imagekit';
import FestivalOffersSection from '@/components/FestivalOffersSection';

// =============================================================================
// DATA: CATEGORIES, STANDOUT GEAR, BUNDLES, COURSES, TESTIMONIALS, FAQS
// =============================================================================

const HERO_SLIDES = [
  {
    image: '/img-kit8.png',
    alt: 'Digitek Festive Creator Sale - Up to 70% Off',
    link: '#standout-gear',
  },
  {
    image: '/img-kit6.png',
    alt: 'Creator Studio Gear Setup',
    link: '#standout-gear',
  },
  {
    image: '/img-kit7.png',
    alt: 'Ultimate Creator Kits',
    link: '#bundles-section',
  },
];

const CATEGORIES = [
  {
    id: 'mics',
    name: 'Microphones',
    itemCount: 'Wireless Audio',
    image: '/wireless-mic.jpg',
    discount: 'UP TO 65% OFF',
    startingPrice: '₹799',
    badge: 'HOT DEAL',
  },
  {
    id: 'tripods',
    name: 'Pro Tripods',
    itemCount: 'Heavy Duty Stands',
    image: '/tripod.jpg',
    discount: 'UP TO 50% OFF',
    startingPrice: '₹999',
    badge: 'BESTSELLER',
  },
  {
    id: 'lighting',
    name: 'Lights',
    itemCount: 'Studio Lighting',
    image: '/ring.jpg',
    discount: 'UP TO 55% OFF',
    startingPrice: '₹899',
    badge: 'TRENDING',
  },
  {
    id: 'backdrops',
    name: 'Gimbal/Rig',
    itemCount: 'Stabilizers & Backdrops',
    image: '/chorma.jpg',
    discount: 'UP TO 60% OFF',
    startingPrice: '₹899',
    badge: 'SPECIAL',
  },
  {
    id: 'bundles',
    name: 'Bundles',
    itemCount: 'Complete Creator Kits',
    image: '/banner 6.png',
    discount: 'UP TO 70% OFF',
    startingPrice: '₹2,499',
    badge: 'MEGA SAVER',
  },
];

const STANDOUT_PRODUCTS = [
  {
    id: 'pro-tripod',
    name: 'Tripod',
    subtitle: 'Heavy-duty, lightweight aluminum tripod',
    category: 'STANDS & MOUNTS',
    categoryKey: 'tripods',
    tag: 'BESTSELLER',
    price: 999,
    mrp: 1299,
    savings: 300,
    rating: 4.8,
    reviewsCount: 120,
    image: '/tripod1.png',
  },
  {
    id: 'mic-lavalier',
    name: 'Micophone',
    subtitle: 'Delivering crystal-clear studio sound for creators, vloggers...',
    category: 'AUDIO',
    categoryKey: 'mics',
    tag: 'BESTSELLER',
    price: 799,
    mrp: 999,
    savings: 200,
    rating: 4.8,
    reviewsCount: 120,
    image: '/wireless-mic3.png',
  },
  {
    id: 'green-screen-kit',
    name: 'Green Screen',
    subtitle: 'High-density chromakey green screen cloth designed...',
    category: 'ACCESSORIES',
    categoryKey: 'backdrops',
    tag: 'BESTSELLER',
    price: 899,
    mrp: 1099,
    savings: 200,
    rating: 4.8,
    reviewsCount: 120,
    image: '/chorma2.png',
  },
  {
    id: 'pro-heavy-tripod',
    name: 'Tripod',
    subtitle: 'Heavy-duty, lightweight aluminum tripod equipped with a 3-...',
    category: 'STANDS & MOUNTS',
    categoryKey: 'tripods',
    tag: 'BESTSELLER',
    price: 999,
    mrp: 1299,
    savings: 300,
    rating: 4.8,
    reviewsCount: 120,
    image: '/tripod1.png',
  },
  {
    id: 'wireless-creator-mic',
    name: 'Wireless Studio Mic',
    subtitle: 'Dual-channel wireless microphone system featuring series IV...',
    category: 'AUDIO',
    categoryKey: 'mics',
    tag: 'BESTSELLER',
    price: 999,
    mrp: 1299,
    savings: 300,
    rating: 4.8,
    reviewsCount: 120,
    image: '/wireless-mic1.png',
  },
  {
    id: '18-inch-ring-light',
    name: '18-inch Ring Light',
    subtitle: 'Soft, even lighting for professional-looking videos and streaming.',
    category: 'STUDIO LIGHTING',
    categoryKey: 'lighting',
    tag: 'TRENDING',
    price: 2499,
    mrp: 3499,
    savings: 1000,
    rating: 4.8,
    reviewsCount: 215,
    image: '/ring2.png',
  },
  {
    id: 'softbox-lighting-kit',
    name: 'Studio Softbox Kit',
    subtitle: 'Continuous diffused light for studio-grade YouTube & podcast shots.',
    category: 'STUDIO LIGHTING',
    categoryKey: 'lighting',
    tag: 'PRO LIGHTING',
    price: 3499,
    mrp: 4999,
    savings: 1500,
    rating: 4.8,
    reviewsCount: 164,
    image: '/about1.png',
  },
  {
    id: 'dji-osmo-mobile-se',
    name: 'DJI Osmo Mobile SE',
    subtitle: 'Intelligent 3-axis smartphone gimbal stabilizer with active tracking.',
    category: 'STANDS & MOUNTS',
    categoryKey: 'tripods',
    tag: 'BEST STABILITY',
    price: 6499,
    mrp: 8999,
    savings: 2500,
    rating: 4.9,
    reviewsCount: 142,
    image: '/tripod3.png',
  },
  {
    id: 'audio-technica-ath-m20x',
    name: 'Studio Monitor Mic & Headphone',
    subtitle: 'Low-latency recording and professional monitoring system.',
    category: 'AUDIO',
    categoryKey: 'mics',
    tag: 'PRO AUDIO',
    price: 4499,
    mrp: 5999,
    savings: 1500,
    rating: 4.9,
    reviewsCount: 288,
    image: '/wireless-mic3.png',
  },
  {
    id: 'creatorskit-gear-bag',
    name: 'CreatorsKit Studio Bag',
    subtitle: 'Heavy-duty shockproof gear organizer with modular compartments.',
    category: 'ACCESSORIES',
    categoryKey: 'bundles',
    tag: 'HOT DEAL',
    price: 1799,
    mrp: 2499,
    savings: 700,
    rating: 4.8,
    reviewsCount: 112,
    image: '/pro2.png',
  },
];

const BUNDLE_KITS = [
  {
    id: 'starter-kit',
    name: 'Starter Kit',
    price: 4999,
    mrp: 6999,
    tagline: 'The essentials to start creating today.',
    image: '/pro.png',
    isRecommended: false,
    checklist: [
      'Wireless creator mic (dual)',
      '12-inch ring light',
      'Lightweight tripod',
      'Carry bag',
    ],
  },
  {
    id: 'pro-kit',
    name: 'Pro Kit',
    price: 9999,
    mrp: 14999,
    tagline: 'A versatile setup for serious creators.',
    image: '/pro1.png',
    isRecommended: true,
    checklist: [
      'Wireless creator mic (dual)',
      '18-inch ring light',
      'Pro tripod (fluid head)',
      'Green screen (8 ft)',
    ],
  },
  {
    id: 'studio-kit',
    name: 'Studio Kit',
    price: 14999,
    mrp: 22999,
    tagline: 'A complete studio solution for professional creators.',
    image: '/pro2.png',
    isRecommended: false,
    checklist: [
      'Wireless creator mic (dual)',
      '18-inch ring light',
      '2× LED video lights',
      'Green screen + stand',
    ],
  },
];

const FREE_COURSES = [
  {
    id: 'instagram-mastery',
    title: 'Instagram Mastery',
    subtitle: 'Grow and engage your audience',
    image: '/video 2.webp',
    brandColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
  },
  {
    id: 'youtube-mastery',
    title: 'YouTube Mastery',
    subtitle: 'Plan, record and publish better videos',
    image: '/video 1.webp',
    brandColor: 'bg-red-600',
  },
  {
    id: 'filmora-mastery',
    title: 'Filmora Mastery',
    subtitle: 'Edit faster and create professional content',
    image: '/video.webp',
    brandColor: 'bg-teal-600',
  },
];


const FAQS = [
  {
    q: 'Are Creators Kit gear compatible with smartphones & DSLRs?',
    a: 'Yes! All our tripods, ring lights, and microphones include universal mounts and adapters compatible with Android phones, iPhones, DSLRs, mirrorless cameras, and laptops.',
  },
  {
    q: 'How long does delivery take across India?',
    a: 'We provide Free Express Delivery. Orders are dispatched from our Delhi warehouse within 24 hours, with typical doorstep delivery taking 2 to 3 business days.',
  },
  {
    q: 'How do I claim the 7-day replacement or 1-year warranty?',
    a: 'Simply message our WhatsApp support or email support@creatorskit.in with your Order ID. Defective or transit-damaged items receive instant no-questions-asked replacements.',
  },
  {
    q: 'How do I access the 3 Free Masterclasses (Worth ₹4,999)?',
    a: 'Upon ordering, the Instagram, YouTube, and Video Editing Masterclasses are automatically activated inside your Creators Kit account under the "My Courses" tab.',
  },
  {
    q: "What's included in the creator bundles?",
    a: 'Each creator bundle comes complete with all required hardware accessories (cables, mounts, batteries/chargers, carry bags) plus instant lifetime access to all 3 bundled masterclasses (Instagram Mastery, YouTube Mastery, Filmora Video Editing).',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const FLASH_DEALS = [
  {
    id: 'wireless-creator-mic',
    tag: 'DEAL OF THE DAY',
    name: 'Wireless Mic',
    subtitle: 'Studio-grade DSP noise cancelling • 48H battery case • Ultra-low latency',
    price: 1499,
    mrp: 3999,
    savings: 2500,
    discountPercent: 62,
    stockLeft: 14,
    stockTotal: 50,
    image: '/wireless-mic1.png',
    rating: 4.9,
    reviewsCount: 342,
    freeBonus: 'Free Audio Editing Masterclass Worth ₹1,499 Included',
  },
  {
    id: '18-inch-ring-light',
    tag: 'FLASH DEAL #2',
    name: '18-inch Ring Light',
    subtitle: 'Dimmable 3200K-5600K CRI 95+ with mobile holder & wireless remote',
    price: 2499,
    mrp: 4999,
    savings: 2500,
    discountPercent: 50,
    stockLeft: 9,
    stockTotal: 40,
    image: '/ring2.png',
    rating: 4.8,
    reviewsCount: 289,
    freeBonus: 'Free Studio Lighting Guide Worth ₹999 Included',
  },
];

export default function LiveSalePage() {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();

  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [addedItems, setAddedItems] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [saleConfig, setSaleConfig] = useState(null);
  const [revealedSecret, setRevealedSecret] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Dynamic MongoDB Collections State (with fallback defaults)
  const [liveHeroSlides, setLiveHeroSlides] = useState(HERO_SLIDES);
  const [liveFlashDeals, setLiveFlashDeals] = useState(FLASH_DEALS);
  const [liveCreatorDeals, setLiveCreatorDeals] = useState(STANDOUT_PRODUCTS);
  const [liveCategories, setLiveCategories] = useState(CATEGORIES);
  const [liveFaqs, setLiveFaqs] = useState(FAQS);

  // Deal of the Day States
  const [selectedDealIndex, setSelectedDealIndex] = useState(0);
  const activeDeal = liveFlashDeals[selectedDealIndex] || liveFlashDeals[0] || FLASH_DEALS[0];
  const [dealTimeLeft, setDealTimeLeft] = useState({
    hours: '08',
    minutes: '12',
    seconds: '45',
    millis: '30',
  });

  // Dynamic countdown timer synchronized with MongoDB config
  useEffect(() => {
    const hours = Number(saleConfig?.countdownHours || saleConfig?.countdownTargetHours || 8);
    let target = Date.now() + hours * 3600 * 1000 + 12 * 60 * 1000 + 45 * 1000;
    try {
      const stored = sessionStorage.getItem('creatorskit_live_target');
      if (stored && Number(stored) > Date.now()) {
        target = Number(stored);
      } else {
        sessionStorage.setItem('creatorskit_live_target', String(target));
      }
    } catch (e) {}

    const interval = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const ms = Math.floor((diff % 1000) / 10);

      setDealTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
        millis: String(ms).padStart(2, '0'),
      });
    }, 45);

    return () => clearInterval(interval);
  }, [saleConfig]);

  // Fetch Live Sale configuration directly from MongoDB API
  useEffect(() => {
    async function fetchSaleConfig() {
      try {
        let res = await fetch('/api/admin/live-sale', { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch('/api/sale', { cache: 'no-store' });
        }
        if (res.ok) {
          const data = await res.json();
          setSaleConfig(data);
        }
      } catch (err) {
        console.error('Error fetching live sale config:', err);
      }
    }
    fetchSaleConfig();
  }, []);

  // Fetch Live Sale sections dynamically from MongoDB
  useEffect(() => {
    async function fetchLiveSections() {
      try {
        const res = await fetch('/api/admin/live-sale/sections?section=all&activeOnly=true', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const data = json.data || {};
          if (Array.isArray(data.banners) && data.banners.length > 0) {
            setLiveHeroSlides(
              data.banners.map((b) => ({
                bannerImageUrl: b.bannerImage || b.bannerImageUrl || b.image || '/img-kit8.png',
                image: b.bannerImage || b.bannerImageUrl || b.image || '/img-kit8.png',
                alt: 'Live Sale Hero Banner',
                link: b.link || '',
              }))
            );
          }
          if (Array.isArray(data.deals) && data.deals.length > 0) {
            setLiveFlashDeals(
              data.deals.map((d) => ({
                id: d._id || d.id || 'deal',
                tag: d.tag || 'FLASH DEAL',
                name: d.name || 'Creator Gear',
                subtitle: d.subtitle || '',
                price: Number(d.price) || 999,
                mrp: Number(d.mrp) || 1999,
                savings: Number(d.savings) || Math.max(0, (Number(d.mrp) || 0) - (Number(d.price) || 0)),
                discountPercent: Number(d.discountPercent) || 50,
                stockLeft: Number(d.stockLeft) || 10,
                stockTotal: Number(d.stockTotal) || 50,
                image: d.image || '/wireless-mic1.png',
                rating: Number(d.rating) || 4.8,
                reviewsCount: Number(d.reviewsCount) || 120,
                freeBonus: d.freeBonus || '',
                dealUrl: d.dealUrl || '/live-sale',
              }))
            );
          }
          if (Array.isArray(data.creatorDeals) && data.creatorDeals.length > 0) {
            setLiveCreatorDeals(
              data.creatorDeals.map((cd, idx) => ({
                id: cd._id || cd.id || `creator-deal-${idx}`,
                name: cd.title || cd.name || 'Creator Equipment',
                title: cd.title || cd.name || 'Creator Equipment',
                subtitle: cd.subtitle || 'Professional creator equipment',
                category: cd.category || 'CREATOR GEAR',
                categoryKey: (cd.category || '').toLowerCase().includes('stand') || (cd.category || '').toLowerCase().includes('tripod')
                  ? 'tripods'
                  : (cd.category || '').toLowerCase().includes('audio') || (cd.category || '').toLowerCase().includes('mic')
                  ? 'mics'
                  : (cd.category || '').toLowerCase().includes('light')
                  ? 'lighting'
                  : (cd.category || '').toLowerCase().includes('accessory') || (cd.category || '').toLowerCase().includes('backdrop')
                  ? 'backdrops'
                  : (cd.category || '').toLowerCase().includes('bundle')
                  ? 'bundles'
                  : 'all',
                tag: cd.badge || cd.tag || 'BESTSELLER',
                badge: cd.badge || cd.tag || 'BESTSELLER',
                price: Number(cd.price) || 999,
                mrp: Number(cd.mrp) || Math.round((Number(cd.price) || 999) * 1.3),
                savings: Number(cd.savings) || Math.max(0, (Number(cd.mrp) || 0) - (Number(cd.price) || 0)),
                discountText: cd.discountText || (cd.discountPercent ? `${cd.discountPercent}% OFF` : ''),
                discountPercent: Number(cd.discountPercent) || 25,
                stockLeft: Number(cd.stockLeft) || 7,
                stockTotal: Number(cd.stockTotal) || 20,
                rating: Number(cd.rating) || 4.8,
                reviewsCount: Number(cd.reviewsCount) || 120,
                image: cd.imageUrl || cd.image || '/tripod1.png',
                imageUrl: cd.imageUrl || cd.image || '/tripod1.png',
              }))
            );
          }
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setLiveCategories(
              data.categories.map((c) => ({
                id: c._id || c.id || (c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : 'cat'),
                name: c.name || 'Category',
                itemCount: c.itemCount || 'Studio Gear',
                image: c.image || '/wireless-mic.jpg',
                discount: c.discount || 'UP TO 50% OFF',
                startingPrice: c.startingPrice || '₹999',
                badge: c.badge || 'HOT DEAL',
                link: c.link || '/product',
              }))
            );
          }
          if (Array.isArray(data.faqs) && data.faqs.length > 0) {
            setLiveFaqs(
              data.faqs.map((f) => ({
                q: f.question,
                a: f.answer,
                category: f.category || 'General',
              }))
            );
          }
        }
      } catch (err) {
        console.error('Error fetching live sections:', err);
      }
    }
    fetchLiveSections();
  }, []);

  // Hero Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const totalSlides = liveHeroSlides.length;

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev >= totalSlides ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const scrollToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (currentSlide === totalSlides) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentSlide, totalSlides]);

  const renderSlides = [...liveHeroSlides, liveHeroSlides[0]];

  // Filter Standout Gear
  const displayedProducts = useMemo(() => {
    if (activeCategory === 'all') return liveCreatorDeals;
    return liveCreatorDeals.filter(
      (item) => item.categoryKey === activeCategory || (item.category && item.category.toLowerCase().includes(activeCategory))
    );
  }, [activeCategory, liveCreatorDeals]);

  // Handle Add to Cart
  const handleAddToCart = useCallback((product) => {
    const prodName = product.name || product.title || 'Creator Gear';
    const prodImg = product.image || product.imageUrl || '/tripod1.png';
    const success = addToCart({
      id: product.id || product._id,
      name: prodName,
      price: Number(product.price) || 0,
      mrp: Number(product.mrp) || 0,
      image: prodImg,
      img: prodImg,
      quantity: 1,
    });

    if (success) {
      setAddedItems((prev) => ({ ...prev, [product.id || product._id]: true }));
      setToastMessage(`✓ Added "${prodName}" to cart!`);

      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [product.id || product._id]: false }));
      }, 2000);

      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    }
  }, [addToCart]);

  // Handle Select Kit (Buy Now direct to checkout)
  const handleSelectKit = useCallback((kit) => {
    const prodName = kit.name || kit.title || 'Creator Gear';
    const prodImg = kit.image || kit.imageUrl || '/tripod1.png';
    buyNow(
      {
        id: kit.id || kit._id,
        name: prodName,
        price: Number(kit.price) || 0,
        mrp: Number(kit.mrp) || 0,
        image: prodImg,
        img: prodImg,
        quantity: 1,
      },
      '/checkout'
    );
  }, [buyNow]);

  // Handle Category Click
  const handleCategoryClick = (catId) => {
    if (catId === 'bundles') {
      const el = document.getElementById('bundles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveCategory(catId);
      const el = document.getElementById('standout-gear');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Newsletter Subscribe
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setIsSubscribed(true);
    setToastMessage('✓ Subscribed! You will receive exclusive creator deal alerts.');
    setEmailInput('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check if Live Sale has been turned off from Admin Panel
  if (saleConfig && (saleConfig.isActive === false || saleConfig.active === false)) {
    return (
      <div className="min-h-screen bg-[#FBFBF7] text-[#111827] font-sans selection:bg-[#900606] selection:text-white pt-[130px] pb-20 px-4">
        <div className="max-w-xl mx-auto text-center bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 mx-auto flex items-center justify-center text-[#900606] mb-5">
            <Flame className="w-8 h-8 opacity-40" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold uppercase tracking-wider mb-3">
            Sale Concluded
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-3">
            {saleConfig.saleEventName || saleConfig.saleName || 'Creator Live Sale'} Has Ended
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
            The promotional flash sale window has closed. All regular studio equipment & creator bundles are still available with our official 1-Year Warranty & Free Express Delivery across India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/product"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore All Studio Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-[#111827] font-sans selection:bg-[#900606] selection:text-white pb-16">

      {/* Floating Add to Cart Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-neutral-700/80 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
          <Link
            href="/cart"
            className="ml-2 px-3.5 py-1 bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            View Cart →
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO IMAGE BANNER (DIGITEK FESTIVE PROMO BANNER STYLE)                 */}
      {/* ========================================================================= */}
      <main className="w-full pt-[96px] sm:pt-[116px]">
        {/* Dynamic Top Announcement Ticker Bar */}
        {/* <div className="w-full bg-gradient-to-r from-[#900606] via-[#7d0505] to-[#900606] text-white py-2 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs border-b border-red-800/40">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span className="tracking-wide">
            {saleConfig?.tickerText || "Diwali Creator Dhamaka Live Now • Extra 10% Off with code CREATE10"}
          </span>
        </div> */}
        <section className="relative w-full overflow-hidden bg-[#0a0a0a] mb-2 sm:mb-3">
          <div className="w-full relative z-8 max-w-[3000px] mx-auto">
            <div
              className="relative w-full aspect-[1023/370] min-h-[190px] xs:min-h-[240px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[480px] xl:min-h-[540px] overflow-hidden bg-[#0a0a0a] group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel Track */}
              <div
                className={`flex h-full will-change-transform ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {renderSlides.map((slide, idx) => {
                  const bannerSrc = slide.bannerImageUrl || slide.image || '/img-kit8.png';
                  return (
                    <div key={idx} className="w-full h-full flex-shrink-0 relative overflow-hidden">
                      {slide.link ? (
                        <a href={slide.link} className="absolute inset-0 w-full h-full block">
                          <Image
                            src={getImageUrl(bannerSrc)}
                            alt={slide.alt || 'Live Sale Hero Banner'}
                            fill
                            sizes="100vw"
                            priority={idx === 0}
                            className="object-cover object-center"
                          />
                        </a>
                      ) : (
                        <div className="absolute inset-0 w-full h-full block">
                          <Image
                            src={getImageUrl(bannerSrc)}
                            alt={slide.alt || 'Live Sale Hero Banner'}
                            fill
                            sizes="100vw"
                            priority={idx === 0}
                            className="object-cover object-center"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Digitek-style Bottom-Right Circular Navigation Arrows */}
              <div className="absolute bottom-3 right-3 xs:bottom-4 xs:right-4 sm:bottom-6 sm:right-8 z-20 flex items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Banner"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border border-neutral-200/60"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Banner"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border border-neutral-200/60"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800" strokeWidth={2.5} />
                </button>
              </div>

              {/* Pagination Dots at bottom center */}
              <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
                {liveHeroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${(currentSlide === totalSlides ? 0 : currentSlide) === idx
                      ? 'bg-[#900606] w-6 sm:w-8'
                      : 'bg-white/70 hover:bg-white w-2 sm:w-2.5'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content sections container */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14">

          {/* ========================================================================= */}
          {/* 2. TRUST STRIP (COMPACT, PREMIUM, ZERO EXCESS GAPS)                       */}
          {/* ========================================================================= */}
          <section className="mt-1 sm:mt-2 mb-3 sm:mb-4">
            <div className="w-full bg-white rounded-2xl border border-neutral-200/90 p-3.5 sm:p-5 shadow-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-100">

                {/* 1. Genuine Gear */}
                <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-2">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-[#900606]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] leading-tight">Genuine Gear</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">100% authentic equipment</p>
                  </div>
                </div>

                {/* 2. Secure Checkout */}
                <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <Lock className="w-4 h-4 text-[#900606]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] leading-tight">Secure Checkout</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">Encrypted UPI & cards</p>
                  </div>
                </div>

                {/* 3. Easy 7-Day Returns */}
                <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <RotateCcw className="w-4 h-4 text-[#900606]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] leading-tight">Easy 7-Day Returns</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">Hassle-free replacement</p>
                  </div>
                </div>

                {/* 4. Expert Support */}
                <div className="flex items-center gap-3 pt-2 md:pt-0 md:px-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                    <Headphones className="w-4 h-4 text-[#900606]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] leading-tight">Expert Support</h4>
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">Creator team assistance</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 3. FESTIVE SALE CATEGORIES (DEAL HUBS BY CREATOR SETUP)                    */}
          {/* ========================================================================= */}
          <section className="pt-1 sm:pt-1 pb-1 sm:pb-2">
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight pb-1">
                Shop Exclusive Deals By <span className="text-[#900606] whitespace-nowrap">Category</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal max-w-xl mx-auto mt-1">
                Select your gear setup to jump directly to live slashed prices & exclusive festive drops.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5 w-full">
              {liveCategories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`group bg-white rounded-2xl md:rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(144,6,6,0.12)] ${isSelected
                      ? 'border-[#900606] ring-2 ring-[#900606] shadow-md'
                      : 'border-neutral-200/80 hover:border-[#900606]/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
                      } ${cat.id === 'bundles' ? 'col-span-2 sm:col-span-1' : ''}`}
                  >
                    {/* Top Image Container */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-950">
                      <Image
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />

                      {/* Floating Discount Tag */}
                      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#900606] to-[#b31919] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
                          {cat.discount}
                        </span>
                      </div>

                      {/* Floating Badge (e.g. HOT DEAL, BESTSELLER) */}
                      {cat.badge && (
                        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
                          <span className="bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            {cat.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Info Section */}
                    <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <h3 className="font-bold text-[#111827] text-sm sm:text-base group-hover:text-[#900606] transition-colors leading-snug truncate">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-neutral-500 font-normal mt-0.5 truncate">
                          {cat.itemCount}
                        </p>
                      </div>

                      {/* Price & CTA Row */}
                      <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold block leading-none">
                            Starting
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#900606]">
                            {cat.startingPrice}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-neutral-800 group-hover:text-[#900606] group-hover:translate-x-0.5 transition-all">
                          Explore
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* DEAL OF THE DAY (HIGH-IMPACT FLASH SALE WITH LIVE TIMER & ZERO EXCESS GAPS)*/}
          {/* ========================================================================= */}
          <section className="mt-2 sm:mt-3 mb-4 sm:mb-6 w-full">
            <div className="w-full bg-gradient-to-br from-[#451206] via-[#731c0a] to-[#9e310e] rounded-2xl sm:rounded-3xl border border-amber-500/40 p-5 sm:p-7 lg:p-8 shadow-[0_20px_60px_rgba(69,18,6,0.35)] relative overflow-hidden text-white">
              {/* Ambient luminous glow flares */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                {/* LEFT SIDE: Heading, Glowing Badge, Live Urgency & Button */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  {/* Glowing Deal Badge & Interactive Switcher */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 backdrop-blur-md">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                      </span>
                      <Flame className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                      <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-amber-200">
                        {activeDeal.tag}
                      </span>
                    </span>

                    {liveFlashDeals.length > 1 && (
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs border border-amber-400/30 p-1 rounded-full">
                        {liveFlashDeals.map((deal, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedDealIndex(idx)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${selectedDealIndex === idx
                              ? 'bg-amber-400 text-neutral-950 font-black shadow-xs'
                              : 'text-amber-200/80 hover:text-white'
                              }`}
                          >
                            Deal #{idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Main Heading with Gold Accent */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black text-white tracking-tight leading-tight mb-2.5 sm:whitespace-nowrap">
                    {saleConfig?.heroHeading || 'MEGA CREATOR FEST:'}{' '}
                    <span className="text-amber-300">
                      {saleConfig?.heroHighlight || 'UP TO 50% OFF'}
                    </span>
                  </h2>

                  {/* Subtext */}
                  <p className="text-sm sm:text-base text-amber-100/90 font-normal leading-relaxed mb-4">
                    {saleConfig?.heroDescription ||
                      saleConfig?.heroSubtitle ||
                      "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle."}
                  </p>

                  {/* Live Urgency Social Proof Badge */}
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-200 mb-3 bg-black/30 backdrop-blur-xs border border-amber-400/30 px-3 py-1.5 rounded-xl w-fit">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>
                      {saleConfig?.viewerCount ?? saleConfig?.liveViewerCount ?? 184} creators viewing this deal right now
                    </span>
                  </div>

                  {/* Free Masterclass Bonus Tag */}
                  <div className="mb-6 flex items-center gap-2.5 bg-amber-400/10 border border-amber-400/30 px-3.5 py-2 rounded-xl text-amber-200 w-fit">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-xs font-bold text-amber-100">
                      {activeDeal.freeBonus}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(activeDeal)}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <span>SHOP THE DEAL</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE: Offer Card with Product Image, Details, Stock Bar & Timer */}
                <div className="lg:col-span-7">
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-amber-200 shadow-2xl p-5 sm:p-6 md:p-7 flex flex-col md:flex-row md:items-stretch gap-5 sm:gap-6 text-neutral-900">

                    {/* Product Image Container */}
                    <div
                      className="relative w-full sm:w-56 md:w-60 lg:w-64 min-h-[220px] sm:min-h-[260px] md:min-h-[280px] rounded-2xl overflow-hidden shrink-0 border border-neutral-200/90 shadow-sm group cursor-pointer bg-neutral-950"
                      onClick={() => router.push(`/product/${activeDeal.id}`)}
                    >
                      <span className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wide">
                        -{activeDeal.discountPercent}% OFF
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 z-10 bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/40 font-bold text-[10px] px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                        Flash Deal
                      </span>
                      <Image
                        src={getImageUrl(activeDeal.image)}
                        alt={activeDeal.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product Details & Live Timer */}
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                        {/* Product Title */}
                        <h3
                          onClick={() => router.push(`/product/${activeDeal.id}`)}
                          className="font-bold text-base sm:text-lg md:text-xl text-[#111827] hover:text-[#9e310e] transition-colors cursor-pointer leading-snug line-clamp-1"
                        >
                          {activeDeal.name}
                        </h3>

                        {/* Subtitle / Key Specs */}
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {activeDeal.subtitle}
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">Studio Grade</span>
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded">Plug & Play</span>
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded">1-Yr Warranty</span>
                        </div>

                        {/* Price Row */}
                        <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
                          <span className="text-2xl sm:text-3xl font-black text-[#9e310e]">
                            ₹{activeDeal.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-neutral-400 line-through font-medium">
                            ₹{activeDeal.mrp.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded">
                            Save ₹{activeDeal.savings.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Stock Progress Bar */}
                        <div className="mt-3.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#9e310e] animate-ping" />
                              <span>Only <strong className="text-[#9e310e]">{activeDeal.stockLeft} items</strong> left at this price!</span>
                            </span>
                            <span className="text-[11px] text-neutral-400 font-normal">
                              {Math.round(((activeDeal.stockTotal - activeDeal.stockLeft) / activeDeal.stockTotal) * 100)}% Claimed
                            </span>
                          </div>
                          {/* Progress track */}
                          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200/60">
                            <div
                              className="bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 shadow-2xs"
                              style={{
                                width: `${Math.round(((activeDeal.stockTotal - activeDeal.stockLeft) / activeDeal.stockTotal) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Live Countdown Timer (HRS : MINS : SECS : MSEC) Styled matching Image 1 */}
                      <div className="mt-4 pt-3.5 border-t border-neutral-100">
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-gradient-to-b from-[#2b0a03] to-[#1a0502] border border-amber-400/50 rounded-xl py-2 px-1 shadow-inner">
                            <span className="block text-base sm:text-lg font-black text-amber-300 tabular-nums font-mono">
                              {dealTimeLeft.hours}
                            </span>
                            <span className="block text-[9px] uppercase tracking-wider font-sans text-amber-200/80 mt-0.5 font-semibold">
                              HRS
                            </span>
                          </div>
                          <div className="bg-gradient-to-b from-[#2b0a03] to-[#1a0502] border border-amber-400/50 rounded-xl py-2 px-1 shadow-inner">
                            <span className="block text-base sm:text-lg font-black text-amber-300 tabular-nums font-mono">
                              {dealTimeLeft.minutes}
                            </span>
                            <span className="block text-[9px] uppercase tracking-wider font-sans text-amber-200/80 mt-0.5 font-semibold">
                              MINS
                            </span>
                          </div>
                          <div className="bg-gradient-to-b from-[#2b0a03] to-[#1a0502] border border-amber-400/50 rounded-xl py-2 px-1 shadow-inner">
                            <span className="block text-base sm:text-lg font-black text-amber-300 tabular-nums font-mono">
                              {dealTimeLeft.seconds}
                            </span>
                            <span className="block text-[9px] uppercase tracking-wider font-sans text-amber-200/80 mt-0.5 font-semibold">
                              SECS
                            </span>
                          </div>
                          <div className="bg-gradient-to-b from-[#2b0a03] to-[#1a0502] border border-amber-400/50 rounded-xl py-2 px-1 shadow-inner">
                            <span className="block text-base sm:text-lg font-black text-amber-400 tabular-nums font-mono">
                              {dealTimeLeft.millis}
                            </span>
                            <span className="block text-[9px] uppercase tracking-wider font-sans text-amber-200/80 mt-0.5 font-semibold">
                              MSEC
                            </span>
                          </div>
                        </div>

                        {/* Quick 1-Click Buy / Add Button */}
                        <div className="mt-3 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleSelectKit(activeDeal)}
                            className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-[#900606] hover:from-[#780505] to-[#9e310e] hover:to-[#7a2408] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Zap className="w-4 h-4 fill-white text-white" />
                            <span>Buy Now</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(activeDeal)}
                            className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-[#900606] hover:from-[#780505] to-[#9e310e] hover:to-[#7a2408] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <ShoppingCart className="w-4 h-4 text-white" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 4. "STANDOUT GEAR. SALE PRICES." PRODUCT GRID                             */}
          {/* ========================================================================= */}
          <section id="standout-gear" className="py-2 sm:py-4">
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
              
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] tracking-tight pb-1">
                Festive Creator  <span className="text-[#900606] whitespace-nowrap">Deals.</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal max-w-xl mx-auto mt-1">
                Celebrate this festive season with exclusive limited-time price drops on top-selling creator equipment. Grab yours before stocks run out!
              </p>
              {activeCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs font-semibold text-[#900606] hover:underline mt-2 cursor-pointer"
                >
                  Showing filtered category. View all items →
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 w-full">
              {displayedProducts.map((product, idx) => {
                const priceVal = typeof product.price === 'number' ? product.price : Number(product.price) || 0;
                const mrpVal = product.mrp ? Number(product.mrp) : Math.round(priceVal * 1.3);
                const savePercent = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 25;
                const ratingVal = Number(product.rating) || 4.8;
                const isAdded = Boolean(addedItems[product.id]);
                const tagText = product.tag || (idx % 2 === 0 ? 'BESTSELLER' : 'HOT DEAL');
                const stockLeft = product.stockLeft || ((idx * 3 + 4) % 8 + 3);
                const stockPercent = Math.max(15, Math.round((stockLeft / 20) * 100));
                const categoryLabel = product.category || (
                  product.categoryKey === 'tripods' ? 'STANDS & MOUNTS' :
                    product.categoryKey === 'mics' ? 'AUDIO' :
                      product.categoryKey === 'lighting' ? 'STUDIO LIGHTING' :
                        product.categoryKey === 'backdrops' ? 'ACCESSORIES' : 'CREATOR GEAR'
                );

                return (
                  <div
                    key={product.id || idx}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-amber-200/80 hover:border-amber-500/80 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer relative justify-between"
                  >
                    {/* 1. Top Festive Gradient Header Strip */}
                    <div className="w-full py-1 px-2.5 sm:px-3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center justify-between">
                      <span className="truncate pr-1">
                        {product.badge || product.tag || tagText} • {product.discountText || `${savePercent}% OFF`}
                      </span>
                      {mrpVal > priceVal && (
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold tracking-normal shrink-0">
                          SAVE ₹{(mrpVal - priceVal).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1">
                      {/* 2. Product Image Container with Badges */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
                        {/* Rating Badge */}
                        <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-sm border border-neutral-200 px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-800">{ratingVal.toFixed(1)}</span>
                          <span className="text-[9px] text-neutral-400">({product.reviewsCount || 120})</span>
                        </div>

                        <Image
                          src={getImageUrl(product.imageUrl || product.image)}
                          alt={product.title || product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>

                      {/* 3. Product Information */}
                      <div className="p-2.5 sm:p-3 pb-1.5 flex flex-col flex-1">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#9e310e] leading-none mb-0.5 block">
                          {product.category || categoryLabel}
                        </span>

                        <h3 className="font-bold text-[#111827] text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-[#9e310e] transition-colors">
                          {product.title || product.name}
                        </h3>

                        <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-normal leading-tight">
                          {product.subtitle || 'Professional creator equipment'}
                        </p>

                        {/* Price & Savings */}
                        <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
                          <span className="font-black text-base sm:text-lg text-[#9e310e] tracking-tight">
                            ₹{priceVal.toLocaleString('en-IN')}
                          </span>
                          {mrpVal > priceVal && (
                            <span className="text-[11px] text-neutral-400 line-through font-medium">
                              ₹{mrpVal.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="ml-auto text-[9px] sm:text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-1 py-0.5 rounded">
                            {product.discountText || `${savePercent}% OFF`}
                          </span>
                        </div>

                        {/* Stock Urgency Bar - NOW BELOW PRICE */}
                        <div className="mt-1.5 bg-amber-50 rounded-lg p-1.5 border border-amber-200/70">
                          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold mb-0.5">
                            <span className="text-[#9e310e] flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              Only {stockLeft} left in stock!
                            </span>
                            <span className="text-neutral-500 font-semibold">{stockPercent}% Left</span>
                          </div>
                          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(15, 100 - stockPercent))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Direct Buy Now + Add to Cart */}
                    <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3 pt-0.5 flex items-center gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectKit(product);
                        }}
                        className="flex-1 py-1.5 sm:py-2 bg-gradient-to-r from-[#900606] hover:from-[#780505] to-[#9e310e] hover:to-[#7a2408] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span>Buy Now</span>
                      </button>
                      <button
                        type="button"
                        title="Add to Cart"
                        aria-label="Add to Cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-8 h-8 sm:w-8.5 sm:h-8.5 shrink-0 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95"
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in" />
                        ) : (
                          <ShoppingCart className="w-3.5 h-3.5 text-neutral-800" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* 5. PROMOTIONAL SALE BANNER (CREATOR KITS)                                 */}
        {/* ========================================================================= */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 my-1 sm:my-2">
          <div className="w-full relative aspect-[2156/729] rounded-xl overflow-hidden shadow-md border border-pink-500/20 bg-[#F1025D]">
            <Image
              src={getImageUrl('/img-kit16.png')}
              alt="Creator Kits - Built for Creators"
              fill
              sizes="(max-width: 1280px) 100vw, 1400px"
              priority
              className="object-cover object-center w-full h-full block"
            />
          </div>
        </section>

        {/* Re-open content container for bundles and lower sections */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14">

          {/* ========================================================================= */}
          {/* 10. FREQUENTLY ASKED QUESTIONS                                            */}
          {/* ========================================================================= */}
          <section className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3">
            <div className="w-full max-w-5xl mx-auto">
              <div className="text-center mb-3 sm:mb-4">
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
                  Frequently Asked <span className="text-[#900606] whitespace-nowrap">Questions</span>
                </h2>
                <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal max-w-xl mx-auto mt-0.5">
                  Everything you need to know about compatibility, shipping, and warranty.
                </p>
              </div>

              <div className="space-y-2.5">
                {liveFaqs.map((faq, idx) => (
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

          {/* ========================================================================= */}
          {/* 11. SECRET FESTIVAL LUCKY OFFER (INTERACTIVE CONVERSION BOOSTER)          */}
          {/* ========================================================================= */}
          {(saleConfig?.secretOfferEnabled ?? saleConfig?.showMysteryOffer ?? true) && (
            <div className="my-4 sm:my-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border-2 border-amber-400/40 p-5 sm:p-7 backdrop-blur-md shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-center md:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-500 shrink-0">
                    <Gift className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-800 text-[10px] font-black uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      SECRET FESTIVAL OFFER
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                      {saleConfig?.secretOfferTitle || saleConfig?.mysteryOfferTitle || "Today's Secret Festival Deal!"}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                      {saleConfig?.secretBenefit || saleConfig?.mysteryOfferDesc || "Flat ₹500 OFF on all Creator Bundles"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!revealedSecret ? (
                    <button
                      type="button"
                      onClick={() => setRevealedSecret(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#900606] to-[#b31919] hover:from-[#780505] hover:to-[#900606] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Tap to Reveal Secret Coupon</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-amber-400 shadow-xs">
                      <span className="font-mono font-black text-sm sm:text-base text-[#900606] tracking-wider">
                        {saleConfig?.secretCoupon || saleConfig?.mysteryOfferCode || "FEST500"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(saleConfig?.secretCoupon || saleConfig?.mysteryOfferCode || 'FEST500');
                            setCopiedSecret(true);
                            setTimeout(() => setCopiedSecret(false), 2500);
                          }
                        }}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedSecret ? '✓ COPIED' : 'COPY'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 12. FESTIVAL COUPON BONUS SECTION                                         */}
          {/* ========================================================================= */}
          <FestivalOffersSection
            promoCode={saleConfig?.couponCode || saleConfig?.promoCode || 'CREATE10'}
            headline={saleConfig?.bannerHeadline || saleConfig?.promoHeadline}
            discountPercent={saleConfig?.discountPercent || saleConfig?.promoDiscount || 10}
            subtitle={saleConfig?.bannerSubtitle || saleConfig?.promoSubline}
          />

          {/* ========================================================================= */}
          {/* 12. STAY IN THE CREATOR LOOP (NEWSLETTER STRIP)                           */}
          {/* ========================================================================= */}
          <section className="my-2 sm:my-3">
            <div className="w-full bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">

              <div className="flex items-center gap-3.5 text-center md:text-left">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#900606]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
                    Stay in the creator loop
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Get sale updates, new gear and creator tips in your inbox.
                  </p>
                </div>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#900606] w-full md:w-64"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#900606] hover:bg-[#780505] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </form>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
