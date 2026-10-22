'use client';
import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id || '1';

  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToCart, buyNow } = useCart();

  // Mock product database mapping with dedicated multiple angle images for each product
  const productsMap = {
    '1': { 
      id: 1, 
      name: 'Ring Light', 
      subtitle: 'Professional 18 inch Ring Light with Desk Mount & Stand', 
      price: 999, 
      mrp: 1999, 
      discount: '17% OFF', 
      rating: 4.8, 
      reviews: '120 reviews', 
      sold: '1k+ sold',
      image: '/ring.jpg', 
      images: ['/ring1.png', '/ring2.png', '/ring3.png', '/ring4.png'], 
      description: 'Achieve flawless, studio-quality illumination with adjustable brightness and color temperature. Perfect for eliminating shadows and glowing on camera.' 
    },
    '2': { 
      id: 2, 
      name: 'ApexPro Heavy-Duty Aluminum Creator Tripod', 
      subtitle: 'HEAVY-DUTY ALUMINUM TRIPOD', 
      price: 999, 
      mrp: 1999, 
      discount: '60% OFF', 
      rating: 4.9, 
      reviews: '890 reviews', 
      sold: '800+ sold',
      image: '/tripod.jpg', 
      images: ['/tripod1.png', '/tripod2.png', '/tripod3.png', '/tripod4.png'], 
      description: 'Tired of shaky footage ruining your shots? The ApexPro carbon fiber tripod guarantees rock-solid stability for silky smooth pans and professional-grade framing.' 
    },
    '3': { 
      id: 3, 
      name: 'ChromaKey Portable Green Screen Backdrop', 
      subtitle: 'PORTABLE CHROMA KEY BACKDROP', 
      price: 999, 
      mrp: 1999, 
      discount: '70% OFF', 
      rating: 4.7, 
      reviews: '560 reviews', 
      sold: '500+ sold',
      image: '/chorma.jpg', 
      images: ['/chorma.jpg', '/chorma.jpg', '/chorma.jpg', '/chorma.jpg'], 
      description: 'Transport your audience anywhere instantly. This portable, wrinkle-resistant green screen gives you the perfect canvas for professional background replacement and streaming overlays.' 
    },
    '4': { 
      id: 4, 
      name: 'VoicePro Ultra-Clear Wireless Lapel Microphone Kit', 
      subtitle: 'STUDIO-GRADE WIRELESS AUDIO', 
      price: 999, 
      mrp: 1999, 
      discount: '80% OFF', 
      rating: 4.8, 
      reviews: '1,120 reviews', 
      sold: '1.2k+ sold',
      image: '/wireless-mic.jpg', 
      images: ['/wireless-mic.jpg', '/wireless-mic1.png', '/wireless-mic2.png', '/wireless-mic3.png'], 
      description: 'Crisp, crystal-clear audio capture without the hassle of tangled cables. Features real-time noise reduction, ultra-low latency, and dual-channel wireless transmission.' 
    }
  };

  const searchParams = useSearchParams();
  const queryTitle = searchParams.get('title');
  const queryPrice = searchParams.get('price');

  const baseProduct = productsMap[productId] || productsMap['1'];
  
  const product = {
    ...baseProduct,
    name: queryTitle || baseProduct.name,
    displayPrice: queryPrice || null,
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [prevProductId, setPrevProductId] = useState(productId);

  if (prevProductId !== productId) {
    setPrevProductId(productId);
    setSelectedImageIndex(0);
  }

  const activeImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = activeImages[selectedImageIndex] || activeImages[0];

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('creatorsKitTheme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  if (!mounted) return null;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedImageIndex}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      img: activeImage,
      image: activeImage
    });
    router.push('/cart');
  };

  const handleBuyNow = () => {
    buyNow({
      id: `${product.id}-${selectedImageIndex}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      img: activeImage,
      image: activeImage
    });
    router.push('/checkout');
  };

  return (
    <div className={`flex flex-col ${isDarkMode ? 'bg-[#0B0F19] text-neutral-100' : 'bg-[#FBFBF7] text-neutral-900'} font-sans w-full pt-28 pb-16`}>
      <main className="w-full max-w-[150rem] mx-auto px-6 sm:px-8 lg:px-10">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${isDarkMode ? 'bg-[#131C2E] border-neutral-700 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-100'} shadow-sm cursor-pointer`}
          >
            <span>←</span> Back
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start w-full">
          
          {/* LEFT: Vertical Thumbnails + Main Image Showcase */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 w-full">
            
            {/* Vertical Thumbnails on the left */}
            <div className="flex sm:flex-col gap-3 sm:gap-4 shrink-0 overflow-x-auto sm:overflow-visible w-full sm:w-auto justify-center">
              {activeImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 transition-all shrink-0 bg-white dark:bg-[#131C2E] flex items-center justify-center overflow-hidden cursor-pointer ${
                    selectedImageIndex === idx 
                      ? 'border-[#900606] shadow-md ring-2 ring-[#900606]/20' 
                      : 'border-neutral-200 dark:border-neutral-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={getImageUrl(imgSrc)}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover object-center"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Main Image Container */}
            <div className="relative flex-1 aspect-square rounded-[2rem] bg-white dark:bg-[#131C2E] overflow-hidden flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shadow-sm group">
              {/* Bestseller & Discount Badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <span className="bg-[#900606] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">BESTSELLER</span>
                <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700">{product.discount}</span>
              </div>

              <div className="relative w-full h-full flex items-center justify-center z-10">
                <Image
                  src={getImageUrl(activeImage)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>

          </div>

          {/* RIGHT: Product Info & Actions */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Title & Subtitle */}
            <div className="space-y-2 font-sans">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 leading-tight">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} font-medium`}>
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Rating & Sold count */}
            <div className="flex items-center gap-3 mt-4 mb-4">
              <span className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                ★ {product.rating}
              </span>
              <span className="text-xs text-neutral-500">({product.reviews})</span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs text-neutral-500 font-medium">{product.sold}</span>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-3 flex-wrap pt-2 mb-4">
              <span className="text-3xl font-black text-[#900606]">
                {product.displayPrice ? product.displayPrice : `₹${product.price.toLocaleString()}`}
              </span>
              <span className="text-sm text-neutral-400 line-through font-medium">₹{product.mrp.toLocaleString()}</span>
              <span className="bg-[#900606] text-white text-[10px] font-bold px-2 py-0.5 rounded">{product.discount}</span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">Inclusive of all taxes</p>

            {/* In Stock Badge */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-xl w-fit mb-6 border border-emerald-100 dark:border-emerald-900/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              In Stock - Ready to Ship
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { title: 'Dual Channel Recording', icon: '🎤' },
                { title: '200m Range', icon: '📡' },
                { title: 'Up to 7 Hours Battery Life', icon: '⏱️' },
                { title: 'Compact & Lightweight', icon: '📦' }
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#131C2E] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                  <span className="text-lg">{feat.icon}</span>
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{feat.title}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 font-sans mb-8">
              <button
                onClick={handleAddToCart}
                className="relative flex-1 py-4 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-base overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                  🛒 Add to Cart
                </span>
              </button>

              <button
                onClick={handleBuyNow}
                className="relative flex-1 py-4 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-base overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                  Buy Now
                </span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
              {[
                { title: 'Free Delivery', sub: '2-3 days' },
                { title: '7 Days Returns', sub: 'Easy replacement' },
                { title: 'Secure Payment', sub: '100% safe' },
                { title: 'Genuine Product', sub: 'Official warranty' }
              ].map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{badge.title}</span>
                  <span className="text-[10px] text-neutral-400">{badge.sub}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}