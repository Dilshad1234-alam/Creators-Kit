'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import Link from 'next/link';

export default function ProductPage() {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistToast, setWishlistToast] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const product = {
    id: 'rode-wireless-go-2',
    rating: 4.8,
    reviewsCount: 120,
    soldCount: '1k+',
    price: 3999,
    originalPrice: 4999,
    discount: '17% OFF',
    inStock: true,
    images: [
      {
        src: '/ring5.png',
        title: 'Ring Light',
        subtitle: 'Professional 18 inch Ring Light with Desk Mount & Stand',
        description: 'Achieve flawless, studio-quality illumination with adjustable brightness and color temperature. Perfect for eliminating shadows and glowing on camera.'
      },
      {
        src: '/tripod6.png',
        title: 'Tripod',
        subtitle: 'Professional Aluminum Tripod Stand for Cameras & Mobiles',
        description: 'Engineered for ultimate stability. Keep your shots rock-solid and level during long streams, outdoor vlogging, and cinematic pans.'
      },
      {
        src: '/chorma2.png',
        title: 'Chroma Green ',
        subtitle: 'Portable Wrinkle-Resistant Green Screen Backdrop',
        description: 'Instant background removal and replacement. Set up your virtual studio anywhere in seconds with this high-grade matte green fabric.'
      },
      {
        src: '/wireless-mic4.png',
        title: 'Wireless Mic',
        subtitle: 'Dual Channel Wireless Microphone System for Creators, Vloggers & Filmmakers',
        description: 'Capture professional, crystal-clear audio with the Rode Wireless GO II. Perfect for YouTubers, vloggers, interviewers and content creators.'
      }
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
      { label: 'Brand', value: 'Rode' },
      { label: 'Model', value: 'Wireless GO II' },
      { label: 'Type', value: 'Dual Channel Wireless Microphone' },
      { label: 'Transmission Range', value: 'Up to 200 meters' },
      { label: 'Battery Life', value: 'Up to 7 hours' },
      { label: 'Connectivity', value: '2.4 GHz Digital Transmission' },
      { label: 'Compatibility', value: 'DSLR, Mirrorless, Smartphone, Laptop (3.5mm/TRS & USB-C)' },
      { label: 'Weight', value: '30g (transmitter), 32g (receiver)' }
    ],
    whatsInTheBox: [
      { name: '2 × Wireless Transmitter (TX)' },
      { name: '1 × Wireless Receiver (RX)' },
      { name: '2 × Lav Mic' },
      { name: '2 × Furry Windshield' },
      { name: '3 × USB-C Charging Cable' },
      { name: '1 × SC5 TRS to TRS Cable' },
      { name: '1 × Carry Pouch' },
      { name: '1 × User Guide' }
    ]
  };

  const bundles = [
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
      id: 'pro-creator-kit',
      name: 'Pro Creator Kit',
      price: 9999,
      oldPrice: 14999,
      discount: '33% OFF',
      image: '/pro1.png',
      popular: true,
      items: ['Rode Wireless GO II', 'Ring Light with Stand', 'Tripod Stand', 'Green Screen', 'Carry Bag']
    },
    {
      id: 'ultimate-creator-kit',
      name: 'Ultimate Creator Kit',
      price: 14999,
      oldPrice: 24999,
      discount: '40% OFF',
      image: '/pro2.png',
      popular: false,
      items: ['Rode Wireless GO II', 'Professional Lighting Kit', 'Tripod Stand', 'Green Screen Backdrop', 'Accessories']
    }
  ];

  const faqs = [
    {
      q: 'Is this compatible with smartphones?',
      a: 'Yes, it comes with cables compatible with both Android and iOS smartphones.'
    },
    {
      q: 'Does it come with warranty?',
      a: 'Yes, includes a 1-year official manufacturer warranty.'
    },
    {
      q: 'What is the battery life?',
      a: 'Up to 7 hours of continuous recording on a single charge.'
    },
    {
      q: 'Is it suitable for interviews?',
      a: 'Yes, dual channel recording makes it ideal for two-person interviews.'
    },
    {
      q: 'Can I use it for live streaming?',
      a: 'Absolutely, it plugs directly into computers and capture cards.'
    },
    {
      q: 'Can I connect it to a laptop?',
      a: 'Yes, via USB-C plug-and-play connectivity.'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Rahul Sharma',
      verified: true,
      time: '2 days ago',
      rating: 5,
      avatar: '/team/team_1.jpg',
      comment: 'Amazing audio quality! Perfect for my YouTube videos. Totally worth the price.',
      photos: ['/rode-main.jpg', '/rode-angle.jpg', '/rode-top.jpg']
    },
    {
      id: 2,
      name: 'Sneha Patel',
      verified: true,
      time: '1 week ago',
      rating: 5,
      avatar: '/team/team_2.jpg',
      comment: 'Very easy to use and the audio clarity is superb. Highly recommended for content creators.',
      photos: []
    },
    {
      id: 3,
      name: 'Aman Verma',
      verified: true,
      time: '2 weeks ago',
      rating: 5,
      avatar: '/team/team_3.jpg',
      comment: 'Build quality is great and battery backup is excellent. Works perfectly with my camera and phone.',
      photos: []
    }
  ];

  const relatedProducts = [
    { id: 1, name: 'Digitek Ring Light 18"', price: 2499, mrp: 3499, discount: '28% OFF', image: '/ring.jpg' },
    { id: 2, name: 'Digitek DTR 550 LW Tripod', price: 1999, mrp: 2499, discount: '20% OFF', image: '/tripod.jpg' },
    { id: 3, name: 'Green Screen Backdrop', price: 799, mrp: 1299, discount: '38% OFF', image: '/chorma2.png' },
    { id: 4, name: 'Rode Lavalier GO', price: 7999, mrp: 9999, discount: '20% OFF', image: '/wireless-mic.jpg' },
    // { id: 5, name: 'Softbox Lighting Kit', price: 3999, mrp: 5499, discount: '27% OFF', image: '/pro1.png' }
  ];

  const activeVariant = product.images[currentImageIndex] || product.images[0];
  const activePrice = activeVariant.price || product.price;
  const activeOriginalPrice = activeVariant.originalPrice || product.originalPrice;
  const activeDiscount = activeVariant.discount || product.discount;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${currentImageIndex}`,
      name: activeVariant.title,
      price: activePrice,
      quantity,
      img: activeVariant.src,
      image: activeVariant.src,
      images: product.images.map((img) => ({
        src: img.src,
        title: img.title,
        subtitle: img.subtitle
      })),
      subtitle: activeVariant.subtitle
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
      image: activeVariant.src,
      images: product.images.map((img) => ({
        src: img.src,
        title: img.title,
        subtitle: img.subtitle
      })),
      subtitle: activeVariant.subtitle
    });
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    setWishlistToast(true);
    setTimeout(() => setWishlistToast(false), 2500);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-[100svh] bg-[#FBFBF7] text-[#111827] font-sans pb-6">
      
      {/* Toast Notification */}
      {wishlistToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-neutral-700">
          <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-sm font-semibold">
            {isWishlisted ? 'Added to your Wishlist!' : 'Removed from your Wishlist'}
          </span>
        </div>
      )}

      <main className="w-full pt-25 sm:pt-30">

        {/* 2. MAIN PRODUCT HERO SECTION */}
        <section className="w-full pt-1 pb-5 bg-[#FBFBF7]">
          <div className="w-full px-5 sm:px-7 md:px-9 lg:px-12 xl:px-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-12 items-start">
            
            {/* LEFT: VERTICAL THUMBNAILS + MAIN IMAGE DISPLAY */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-9 items-start w-full">
              
              {/* Vertical Thumbnails on Left */}
              <div className="flex md:flex-col gap-5 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 shrink-0 w-full md:w-20">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 md:w-25 md:h-25 rounded-l overflow-hidden border-3 bg-white flex items-center justify-center shrink-0 transition-all ${
                      currentImageIndex === idx
                        ? 'border-[#900606] shadow-sm ring-2 ring-[#900606]/20'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getImageUrl(img.src)}
                      alt={img.title}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Showcase */}
              <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-[600px] xl:h-[660px] rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden order-1 md:order-2 group">
                
                {/* Top-Left Badges */}
                <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                  <span className="bg-[#900606] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Bestseller
                  </span>
                  <span className="bg-white border border-neutral-200 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {activeDiscount}
                  </span>
                </div>

                {/* Left Navigation Arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200/80 hover:scale-105"
                  aria-label="Previous image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200/80 hover:scale-105"
                  aria-label="Next image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Main Image */}
                <Image
                  src={getImageUrl(product.images[currentImageIndex].src)}
                  alt={product.images[currentImageIndex].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-all duration-300"
                  priority
                />
              </div>

            </div>

            {/* RIGHT: DYNAMIC PRODUCT INFO & PURCHASE CONTROLS */}
            <div className="lg:col-span-5 flex flex-col justify-start">

              {/* Dynamic Title (Changes on Thumbnail Click) */}
              <h1 className="text-3xl sm:text-4xl font-medium text-[#111827] tracking-tight">
                {product.images[currentImageIndex].title}
              </h1>

              {/* Dynamic Subtitle */}
              <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-1.5 leading-snug">
                {product.images[currentImageIndex].subtitle}
              </p>

              {/* Ratings & Social Proof */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="font-bold text-neutral-800">{product.rating} ({product.reviewsCount} reviews)</span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-500 font-medium">{product.soldCount} sold</span>
              </div>

              {/* Pricing Display */}
              <div className="mt-8">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#900606]">
                    ₹{activePrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-neutral-400 line-through font-normal">
                    ₹{activeOriginalPrice.toLocaleString()}
                  </span>
                  <span className="bg-[#900606] text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                    {activeDiscount}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal mt-0.5">
                  Inclusive of all taxes
                </p>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  In Stock - Ready to Ship
                </p>
              </div>

              {/* Dynamic Description (Changes on Thumbnail Click) */}
              <p className="text-neutral-600 text-xs sm:text-sm font-normal leading-relaxed mt-4">
                {product.images[currentImageIndex].description}
              </p>

              {/* 4 KEY FEATURES ROW */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 py-4 my-3 border-y border-neutral-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-700 leading-tight">Dual Channel<br />Recording</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-700 leading-tight">200m<br />Range</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-700 leading-tight">Up to 7 Hours<br />Battery Life</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-700 leading-tight">Compact<br />& Lightweight</span>
                </div>
              </div>

              {/* PURCHASE BUTTONS */}
              <div className="space-y-8 mt-5">
                <div className="grid grid-cols-2 gap-3">
                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 px-4 bg-[#900606] hover:bg-[#a50707] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>

                  {/* Buy Now CTA */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 bg-white border border-[#900606] text-[#900606] hover:bg-[#900606] hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-sm"
                  >
                    Buy Now
                  </button>
                </div>

              </div>

              {/* FOOTER MINI TRUST BADGES */}
              <div className="grid grid-cols-4 gap-2 pt-5 mt-10 border-t border-neutral-200 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-neutral-800">Free Delivery</span>
                  <span className="text-[9px] text-neutral-400">2-3 days</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-neutral-800">7 Days Returns</span>
                  <span className="text-[9px] text-neutral-400">Easy replacement</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-neutral-800">Secure Payment</span>
                  <span className="text-[9px] text-neutral-400">100% safe</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-neutral-800">Genuine Product</span>
                  <span className="text-[9px] text-neutral-400">Official warranty</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 3. KEY FEATURES SECTION */}
        <section className="w-full py-5 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">

            <h2 className="text-3xl pb-7 md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
              Key <span className="text-[#900606] whitespace-nowrap">Features</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 xl:p-8 border border-neutral-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5 sm:gap-6 min-h-[170px]"
                >
                  {/* Soft Red Circle Icon on the Left */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-red-50 text-[#900606] flex items-center justify-center shrink-0">
                    {idx === 0 && (
                      <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {idx === 3 && (
                      <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>

                  {/* Title & Description on the Right */}
                  <div className="flex flex-col justify-center">
                    <h3 className="font-medium text-[#080b11] text-lg sm:text-xl lg:text-lg xl:text-xl mb-1.5 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 text-sm sm:text-base lg:text-sm xl:text-base font-medium leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PERFECT FOR EVERY CREATOR BANNER */}
        <section className="w-full bg-white py-12 border-y border-neutral-200 my-4">
          <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-4 text-left">
                <h2 className="text-4xl pb-8 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
                  Perfect for  <span className="text-[#900606] whitespace-nowrap">Every Creator</span>
                </h2>
                <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed">
                  Whether you&apos;re a vlogger, filmmaker, educator or <br /> live streamer, the Røde Wireless GO II helps you <br /> capture professional audio anywhere.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
                {[
                  { title: 'Vlogging', image: '/team/manish.jpg' },
                  { title: 'Interviews', image: '/team/priya.jpg' },
                  { title: 'YouTube Videos', image: '/team/rahul.jpg' },
                  { title: 'Online Classes', image: '/contact_hero_creator.jpg' },
                  { title: 'Live Streaming', image: '/banner 5.png' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative h-[280px] sm:h-[320px] rounded-2xl overflow-hidden bg-neutral-900 flex flex-col justify-end p-4 shadow-sm border border-neutral-200/80 transform sm:skew-x-[-8deg]"
                  >
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                    </div>
                    <span className="relative z-10 text-white font-medium text-xs sm:text-sm tracking-wide text-center">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. SPECIFICATIONS & WHAT'S IN THE BOX */}
        <section className="w-full py-1 sm:py-3 bg-[#FBFBF7]">
          <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
    
          {/* Section Header matching reference typography */}
          <div className="flex flex-col items-center text-center mb-8  relative">
            <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
              Product <span className="text-[#900606] whitespace-nowrap">Specifications</span>
            </h2>
              <p className="text-neutral-600 mt-2 font-medium text-lg max-w-2xl"> Explore technical details and specifications of the equipment.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
              {/* Product Specifications Table */}
              <div className="lg:col-span-7">
                <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm divide-y divide-neutral-200/70">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 text-xs sm:text-sm transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F5]'
                      }`}
                    >
                      <span className="font-semibold text-neutral-800 sm:w-2/5 mb-1 sm:mb-0">
                        {spec.label}
                      </span>
                      <span className="text-neutral-600 font-medium sm:text-right sm:w-3/5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's in the Box List */}
              <div className="lg:col-span-5">
                <div className="flex flex-col items-center text-center lg:text-left mb-4 lg:hidden">
                  <h3 className="text-2xl font-extrabold text-[#111827]">
                    What&apos;s in the <span className="text-[#900606]">Box</span>
                  </h3>
                </div>
        
                <div className="space-y-2.5">
                  {product.whatsInTheBox && product.whatsInTheBox.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 p-3 sm:p-3.5 bg-white rounded-xl border border-neutral-200/90 shadow-sm"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. "GET MORE WITH BUNDLE" SECTION */}
        <section className="w-full py-3 sm:py-5 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
              {/* Left Header Box */}
              <div className="lg:col-span-3 text-left">
                <h2 className="text-3xl pb-7 md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
                  Get More with <span className="text-[#900606] whitespace-nowrap">Bundle</span>
                </h2>
 
                <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  Save more and get free courses with <br /> our creator bundles.
                </p>
                <Link
                  href="/product"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#900606] hover:bg-[#a50707] text-white rounded-full font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  View Bundles ➔
                </Link>
              </div>

              {/* Right: 3 Creator Bundles Grid matching reference image */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-7">
                {bundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className={`relative bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                      bundle.popular ? 'border-[#900606] ring-2 ring-[#900606]/30 shadow-md' : 'border-neutral-200/90'
                    }`}
                  >
                    {/* Bundle Image & Badges Container - Full bleed edge-to-edge covering card area */}
                    <div className="relative w-full h-72 sm:h-80 md:h-84 lg:h-88 bg-neutral-100 overflow-hidden group">
                      {bundle.popular && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-[#900606] text-white text-xs font-extrabold tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-md">
                            Most Popular
                          </span>
                        </div>
                      )}

                      {bundle.discount && (
                        <span className="absolute top-4 right-4 z-20 bg-[#900606] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                          {bundle.discount}
                        </span>
                      )}

                      <Image
                        src={getImageUrl(bundle.image)}
                        alt={bundle.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center "
                      />
                    </div>

                    {/* Card Content Details */}
                    <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-extrabold text-[#111827] text-xl sm:text-2xl mb-2.5">
                          {bundle.name}
                        </h3>

                        <div className="flex items-baseline gap-3 mb-6">
                          <span className="font-black text-2xl sm:text-3xl text-[#900606]">
                            ₹{bundle.price.toLocaleString()}
                          </span>
                          <span className="text-sm sm:text-base text-neutral-400 font-medium line-through">
                            MRP ₹{bundle.oldPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart({
                            id: bundle.id,
                            name: bundle.name,
                            price: bundle.price,
                            quantity: 1,
                            img: bundle.image
                          });
                          router.push('/checkout');
                        }}
                        className="w-full py-3.5 px-5 bg-[#900606] hover:bg-[#a50707] text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-md text-center block mt-auto"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 7. CUSTOMER REVIEWS */}
        <section className="w-full py-2 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl pb-8 md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
              Customer <span className="text-[#900606] whitespace-nowrap">Reviews</span>
            </h2>
            </div>

            {/* 4 Cards in 1 Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Card 1: Rating Summary & Breakdown */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-sm flex items-center justify-between gap-4">
                {/* Left: Overall Rating */}
                <div className="flex flex-col shrink-0">
                  <div className="flex items-baseline">
                    <span className="text-4xl sm:text-5xl font-black text-[#111827]">4.8</span>
                    <span className="text-2xl font-bold text-neutral-400">/5</span>
                  </div>
                  <div className="flex text-amber-400 text-sm mt-1.5 mb-1 tracking-tight">
                    ★★★★★
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">
                    Based on 120 reviews
                  </span>
                </div>

                {/* Right: Star Breakdown Progress Bars */}
                <div className="flex-1 space-y-1.5">
                  {[
                    { star: 5, pct: 84 },
                    { star: 4, pct: 12 },
                    { star: 3, pct: 3 },
                    { star: 2, pct: 1 },
                    { star: 1, pct: 0 },
                  ].map((item) => (
                    <div key={item.star} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2.5 font-bold text-neutral-700 text-right">{item.star}</span>
                      <span className="text-[#900606] text-[10px]">★</span>
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${item.pct}%` }}
                        ></div>
                      </div>
                      <span className="w-6 text-[10px] text-neutral-400 font-medium text-right">
                        {item.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cards 2, 3, 4: Individual Customer Reviews */}
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* User Header: Avatar + Name + Verified Badge + Time */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                        <Image
                          src={getImageUrl(rev.avatar)}
                          alt={rev.name}
                          fill
                          sizes="44px"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#111827]">{rev.name}</span>
                          {rev.verified && (
                            <svg className="w-4 h-4 text-[#0EA5E9] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 font-medium">{rev.time}</span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex text-amber-400 text-sm mt-3 mb-2 tracking-tight">
                      ★★★★★
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Photo Attachments (shown for reviews with photos) */}
                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex items-center gap-2 mt-3.5 pt-1">
                        {rev.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0 group cursor-pointer"
                          >
                            <Image
                              src={getImageUrl(photo)}
                              alt={`Review photo ${pIdx + 1}`}
                              fill
                              sizes="48px"
                              className="object-cover object-center group-hover:scale-105 transition-transform"
                            />
                            {/* Video Play Overlay on 3rd media item */}
                            {pIdx === 2 && (
                              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                                  <svg className="w-2.5 h-2.5 text-neutral-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>


        {/* 9. RELATED PRODUCTS */}
        <section className="w-full pt-10 pb-3 sm:pt-8 sm:pb-8 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className="text-3xl pb-10 md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
              Features <span className="text-[#900606] whitespace-nowrap">Products</span>
            </h2>
    
            {/* Grid set to 4 columns on large screens so 4 cards fill the space evenly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => router.push(`/product/${rel.id}`)}
                  className="group flex flex-col bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer justify-between"
                >
                  <div>
                    {/* Product Image Container - Taller height and edge-to-edge covering card area */}
                    <div className="relative w-full h-72 sm:h-80 md:h-88 lg:h-96 bg-neutral-100/90 overflow-hidden flex items-center justify-center p-3 sm:p-4 group">
                      <Image
                        src={getImageUrl(rel.image)}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover object-center w-full h-full"
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
                        <span className="bg-[#900606] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ml-auto">
                          {rel.discount}
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
                          id: rel.id,
                          name: rel.name,
                          price: rel.price,
                          quantity: 1,
                          img: rel.image
                        });
                        router.push('/cart');
                      }}
                      className="w-full py-3.5 bg-[#900606] hover:bg-[#a50707] text-white rounded-xl font-bold text-xs sm:text-sm transition-all text-center block cursor-pointer shadow-sm hover:shadow"
                    >
                      Add to Cart
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ SECTION */}
        <section className="w-full pt-2 pb-3 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                              
            <h2 className="text-3xl pb-10 md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
              Frequently Asked <span className="text-[#900606] whitespace-nowrap">Questions</span>
            </h2>
                  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-2xl p-5 cursor-pointer shadow-sm border-neutral-200"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between gap-4 font-bold text-[#111827] text-xs sm:text-sm">
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