'use client';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import BuiltForCreators from '@/components/BuiltForCreators';

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

export default function ProductPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [mobileProdRef, mobileProdEmbla] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 });
  const scrollProdNext = useCallback(() => { if (mobileProdEmbla) mobileProdEmbla.scrollNext(); }, [mobileProdEmbla]);
  const scrollProdPrev = useCallback(() => { if (mobileProdEmbla) mobileProdEmbla.scrollPrev(); }, [mobileProdEmbla]);
  const mobileFeaturedProducts = relatedProducts && relatedProducts.length > 0 ? (relatedProducts.length <= 4 ? [...relatedProducts, ...relatedProducts, ...relatedProducts] : relatedProducts) : [];

  const faqs = [
    { q: 'Is this compatible with smartphones?', a: 'Yes, it comes with cables compatible with both Android and iOS smartphones.' },
    { q: 'Does it come with warranty?', a: 'Yes, includes a 1-year official manufacturer warranty.' },
    { q: 'What is the battery life?', a: 'Up to 7 hours of continuous recording on a single charge.' },
    { q: 'Is it suitable for interviews?', a: 'Yes, dual channel recording makes it ideal for two-person interviews.' },
    { q: 'Can I use it for live streaming?', a: 'Absolutely, it plugs directly into computers and capture cards.' },
    { q: 'Can I connect it to a laptop?', a: 'Yes, via USB-C plug-and-play connectivity.' }
  ];

  useEffect(() => {
    async function loadDynamicCatalog() {
      try {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const targetId = urlParams?.get('id') || urlParams?.get('productId');

        const [prodRes, heroRes] = await Promise.all([
          fetch('/api/products?type=individual').catch(() => null),
          targetId ? fetch(`/api/products/${targetId}`).catch(() => null) : fetch('/api/products').catch(() => null),
        ]);

        let productItem = null;
        if (heroRes && heroRes.ok) {
          const heroData = await heroRes.json();
          productItem = Array.isArray(heroData.data) ? heroData.data[0] : heroData.data;
        }

        if (productItem) {
          const priceNum = typeof productItem.price === 'number' ? productItem.price : Number(productItem.price) || 0;
          const mrpNum = productItem.originalPrice ? Number(productItem.originalPrice) : Math.round(priceNum * 1.35);
          const rawImages = (Array.isArray(productItem.images) && productItem.images.length > 0)
            ? productItem.images
            : [{ src: productItem.image || '/pro1.png', title: productItem.name, subtitle: productItem.subheading || '', description: productItem.description || '', price: priceNum, originalPrice: mrpNum }];

          setProduct({
            id: productItem.id || productItem._id,
            name: productItem.name,
            price: priceNum,
            originalPrice: mrpNum,
            discount: productItem.discount || (mrpNum > priceNum ? `${Math.round(((mrpNum - priceNum) / mrpNum) * 100)}% OFF` : ''),
            rating: productItem.rating || 4.8,
            reviewsCount: productItem.reviewsCount || 120,
            soldCount: productItem.stock ? `${productItem.stock} units available` : 'In Stock',
            includeBonusCourses: productItem.includeBonusCourses !== undefined ? productItem.includeBonusCourses : (productItem.productType === 'bundle' || productItem.productType === 'thumbnail-bundle'),
            bonusMasterclasses: (Array.isArray(productItem.bonusMasterclasses) && productItem.bonusMasterclasses.length > 0)
              ? productItem.bonusMasterclasses
              : defaultBonusMasterclasses,
            images: rawImages.map((im) => ({
              src: im.src || productItem.image || '/pro1.png',
              title: im.title || productItem.name,
              subtitle: im.subtitle || productItem.subheading || '',
              description: im.description || productItem.description || '',
              price: priceNum,
              originalPrice: mrpNum,
            })),
            features: Array.isArray(productItem.features) ? productItem.features.map(f => typeof f === 'string' ? { title: f, desc: '' } : f) : [],
            specifications: productItem.specifications || [],
            whatsInTheBox: productItem.whatsInTheBox || [],
          });
        }

        if (prodRes && prodRes.ok) {
          const pData = await prodRes.json();
          if (Array.isArray(pData.data)) {
            setRelatedProducts(pData.data.map((p) => {
              const priceNum = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
              const mrpNum = p.originalPrice || Math.round(priceNum * 1.3);
              return {
                id: p.id || p._id,
                _id: p._id,
                name: p.name,
                price: priceNum,
                mrp: mrpNum,
                image: p.image || '/ring.jpg',
                rating: p.rating || 4.8,
                reviewsCount: p.reviewsCount || 120,
              };
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicCatalog();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FBFBF7] text-neutral-800 font-bold">Loading Catalog...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBF7] text-neutral-800 p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">No Products Available</h2>
        <p className="text-neutral-500 mb-4">Please add products through the admin panel.</p>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-[#900606] text-white font-bold rounded-xl shadow-md">Back to Home</button>
      </div>
    );
  }

  const activeVariant = product.images?.[currentImageIndex] || product.images?.[0] || {};
  const activePrice = product.price; // Unified Suite Price
  const activeOriginalPrice = product.originalPrice;
  const activeDiscount = product.discount || (activeOriginalPrice && activePrice && activeOriginalPrice > activePrice ? `${Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)}% OFF` : '');

  const activeBonusCourses = Array.isArray(product.bonusMasterclasses) && product.bonusMasterclasses.length > 0
    ? product.bonusMasterclasses.filter((c) => c.active !== false)
    : defaultBonusMasterclasses;
  const totalBonusValue = activeBonusCourses.reduce((sum, c) => sum + (Number(c.originalPrice) || 1999), 0);
  const shouldShowBonus = product.includeBonusCourses !== false && activeBonusCourses.length > 0;

  const handleAddToCart = () => {
    const ok = addToCart({
      id: `${product.id}-${currentImageIndex}`,
      name: activeVariant.title || product.name,
      price: activePrice,
      quantity: 1,
      img: activeVariant.src,
      image: activeVariant.src
    });
    if (ok) router.push('/cart');
  };

  const handleBuyNow = () => {
    const ok = buyNow({
      id: `${product.id}-${currentImageIndex}`,
      name: activeVariant.title || product.name,
      price: activePrice,
      quantity: 1,
      img: activeVariant.src,
      image: activeVariant.src
    });
    if (ok) router.push('/checkout');
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <div className="min-h-[100svh] bg-[#FBFBF7] text-[#111827] font-sans pb-2 sm:pb-4">
      <main className="w-full pt-14 sm:pt-20 md:pt-24">
        
        {/* PRODUCT HERO SECTION */}
        <section className="w-full pt-0 pb-1.5 sm:pb-5 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-6 lg:gap-10 xl:gap-12 items-start">
            
            {/* THUMBNAILS + MAIN IMAGE */}
            <div className="lg:col-span-7 flex flex-col md:flex-row gap-2 md:gap-2.5 lg:gap-3 items-start w-full">
              {product.images && product.images.length > 1 && (
                <div className="flex md:flex-col gap-1.5 sm:gap-2 md:gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible no-scrollbar pb-0 md:pb-0 shrink-0 w-full md:w-[160px] lg:w-[180px] xl:w-[200px]">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-1 min-w-[84px] max-w-[108px] h-[72px] sm:h-[82px] md:h-[105px] lg:h-[115px] xl:h-[125px] md:w-[160px] lg:w-[180px] xl:w-[200px] md:flex-none rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-[2.5px] bg-white flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        currentImageIndex === idx ? 'border-[#900606] shadow-sm ring-2 ring-[#900606]/20' : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <Image src={getImageUrl(img.src)} alt={img.title || product.name} fill sizes="220px" className="object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}

              {/* MAIN IMAGE SHOWCASE */}
              <div className="relative flex-1 min-w-0 w-full aspect-square sm:aspect-[4/3] md:aspect-auto md:h-[540px] lg:h-[600px] xl:h-[660px] rounded-2xl md:rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden order-1 md:order-2 group">
                <span className="absolute top-3.5 left-3.5 z-20 bg-[#900606] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow-sm uppercase tracking-wide">
                  BESTSELLER
                </span>

                <button type="button" onClick={prevImage} className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200/80 cursor-pointer">
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button type="button" onClick={nextImage} className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition-all border border-neutral-200/80 cursor-pointer">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <Image src={getImageUrl(activeVariant.src)} alt={activeVariant.title || product.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-center" priority />
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#111827] tracking-tight">{activeVariant.title || product.name}</h1>
                {activeVariant.subtitle && <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-1.5">{activeVariant.subtitle}</p>}

                <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <span className="font-bold text-neutral-800">{product.rating} ({product.reviewsCount} reviews)</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-500 font-medium">{product.soldCount}</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#900606]">₹{activePrice.toLocaleString()}</span>
                    {activeOriginalPrice > activePrice && <span className="text-lg text-neutral-400 line-through font-normal">₹{activeOriginalPrice.toLocaleString()}</span>}
                    {activeDiscount && <span className="bg-[#900606] text-white text-[10px] font-bold px-2 py-0.5 rounded">{activeDiscount}</span>}
                  </div>
                  <p className="text-[11px] text-neutral-400 font-normal mt-0.5">Inclusive of all taxes</p>
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-2">✓ In Stock - Ready to Ship</p>
                </div>

                {activeVariant.description && <p className="text-neutral-600 text-xs sm:text-sm font-bold leading-relaxed mt-3">{activeVariant.description}</p>}
              </div>

              {/* FREE MASTERCLASSES BUNDLE OFFER (MATCHING REFERENCE SCREENSHOT) */}
              {shouldShowBonus && (
                <div className="mt-4 rounded-2xl border-2 border-red-200/90 bg-gradient-to-br from-red-50/70 via-white to-amber-50/30 p-4 sm:p-5 shadow-sm relative overflow-hidden">

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
                        <div className="w-full h-20 sm:h-24 md:h-28 rounded-xl overflow-hidden relative mb-2 flex items-center justify-center p-1 bg-white border border-neutral-100 shadow-2xs">
                          <Image
                            src={getImageUrl(c.image || '/video 2.webp')}
                            alt={c.title}
                            fill
                            sizes="(max-width: 768px) 33vw, 150px"
                            className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-bold text-[11px] sm:text-xs text-[#111827] line-clamp-1 group-hover:text-[#900606] transition-colors">
                          {c.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 border-t border-neutral-200 text-center mt-5">
                {[
                  { title: 'Free Delivery', sub: '2-3 days' },
                  { title: '7 Days Returns', sub: 'Easy replacement' },
                  { title: 'Secure Payment', sub: '100% safe' },
                  { title: 'Genuine Product', sub: 'Official warranty' }
                ].map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs font-bold text-neutral-800">{badge.title}</span>
                    <span className="text-[10px] text-neutral-400 font-medium">{badge.sub}</span>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-5 mb-1 w-full">
                <button onClick={handleAddToCart} type="button" className="flex-1 py-3 px-4 bg-white text-gray-800 border border-gray-300 font-semibold text-xs sm:text-sm rounded-xl hover:bg-neutral-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} type="button" className="flex-1 py-3 px-4 bg-[#900606] hover:bg-[#7a0505] text-white font-semibold text-xs sm:text-sm rounded-xl active:scale-[0.98] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                  Buy Now
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* KEY FEATURES */}
        {product.features && product.features.length > 0 && (
          <section className="w-full pt-1 pb-2 sm:py-6 bg-[#FBFBF7]">
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight pb-1.5 sm:pb-4">
                Key <span className="text-[#900606]">Features</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 border border-neutral-200/90 shadow-2xs flex flex-col justify-start">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-red-50 text-[#900606] flex items-center justify-center font-bold text-xs sm:text-base shrink-0 mb-2.5 sm:mb-3.5">✓</div>
                    <div>
                      <h3 className="font-semibold text-[#080b11] text-xs sm:text-base mb-1">{feature.title}</h3>
                      {feature.desc && <p className="text-neutral-500 text-[11px] sm:text-xs leading-relaxed">{feature.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURES PRODUCTS CATEGORY GRID SECTION */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="w-full pt-2 pb-2 sm:pt-8 sm:pb-6 bg-[#FBFBF7]">
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] tracking-tight pb-2 sm:pb-4 md:pb-8">
                Features <span className="text-[#900606] whitespace-nowrap">Products</span>
              </h2>

              {/* MOBILE VIEW (block md:hidden) - FLIPKART STYLE 2-COLUMN GRID */}
              <div className="block md:hidden w-full">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
                  {relatedProducts.slice(0, 4).map((rel, idx) => {
                    const priceVal = typeof rel.price === 'number' ? rel.price : Number(rel.price) || 0;
                    const mrpVal = rel.mrp ? Number(rel.mrp) : Math.round(priceVal * 1.3);
                    const savePercent = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 25;
                    const rating = rel.rating ? Number(rel.rating).toFixed(1) : (idx % 2 === 0 ? '4.8' : '4.6');
                    const reviews = rel.reviewsCount || (idx % 2 === 0 ? 120 : 85);
                    const promoTag = idx % 2 === 0 ? 'Top Deal of the Day' : 'Lowest Price Live';
                    const promoColor = idx % 2 === 0 ? 'text-purple-700 bg-purple-50 border-purple-200/70' : 'text-emerald-700 bg-emerald-50 border-emerald-200/70';

                    return (
                      <div
                        key={rel.id || rel._id || idx}
                        onClick={() => router.push(`/product/${rel.id || rel._id}`)}
                        className="flex flex-col bg-white rounded-2xl p-2.5 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-pointer group justify-between"
                      >
                        <div>
                          {/* Image Container with Flipkart aspect ratio and floating rating pill */}
                          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                            {/* Flipkart-style Rating Pill Badge (Bottom Left) */}
                            <div className="absolute bottom-1.5 left-1.5 z-10 bg-white/95 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1 border border-neutral-200/70">
                              <span>{rating}</span>
                              <span className="text-emerald-600 text-[9px]">★</span>
                              <span className="text-neutral-300 text-[9px]">|</span>
                              <span className="text-neutral-500 text-[9px] font-medium">{reviews}</span>
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
                            {/* Brand / Product Name */}
                            <h3 className="font-bold text-neutral-900 text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-[#900606] transition-colors">
                              {rel.name}
                            </h3>

                            {/* Subtitle / Category */}
                            <p className="text-[11px] text-neutral-400 font-medium line-clamp-1 mt-0.5">
                              Creator Studio Gear
                            </p>

                            {/* Price & Discount Row (Flipkart Style: ↓Discount% MRP SellingPrice) */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                              {savePercent > 0 && (
                                <span className="text-emerald-700 font-bold text-[11px] flex items-center">
                                  ↓{savePercent}%
                                </span>
                              )}
                              {mrpVal > priceVal && (
                                <span className="text-[11px] text-neutral-400 font-medium line-through">
                                  ₹{mrpVal.toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="font-extrabold text-sm sm:text-base text-neutral-900">
                                ₹{priceVal.toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Flipkart-style Tag Badge */}
                            <div className="mt-1">
                              <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border ${promoColor}`}>
                                {promoTag}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Compact Add to Cart Button */}
                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const ok = addToCart({ id: rel.id || rel._id, name: rel.name, price: priceVal, quantity: 1, img: rel.image, image: rel.image }); if (ok) router.push('/cart');
                            }}
                            className="relative w-full py-2 bg-white text-[#111827] border border-neutral-300 rounded-xl font-bold text-xs overflow-hidden group/btn transition-all duration-300 shadow-2xs flex items-center justify-center cursor-pointer active:scale-95"
                          >
                            <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0 pointer-events-none"></span>
                            <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-1">
                              Add to Cart
                            </span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DESKTOP VIEW (hidden md:grid) - COMPACT WITH REMOVED GAPS */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
                {relatedProducts.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id || rel._id}
                    onClick={() => router.push(`/product/${rel.id || rel._id}`)}
                    className="group flex flex-col bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <div>
                      {/* Product Image Container */}
                      <div className="relative w-full aspect-square bg-neutral-100/90 overflow-hidden flex items-center justify-center p-3 sm:p-4 group">
                        <Image
                          src={getImageUrl(rel.image)}
                          alt={rel.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Info - Compact Spacing Without Gaps */}
                      <div className="px-5 pt-3.5 pb-0">
                        <h3 className="font-extrabold text-[#111827] text-base sm:text-lg mb-0.5 leading-snug line-clamp-1 group-hover:text-[#900606] transition-colors">
                          {rel.name}
                        </h3>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, starIdx) => {
                              const ratingVal = Number(rel.rating) || 4.8;
                              return (
                                <Star
                                  key={starIdx}
                                  className={`w-3.5 h-3.5 ${starIdx < Math.round(ratingVal)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-neutral-200 text-neutral-200'
                                    }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-xs font-bold text-neutral-700 ml-0.5">
                            {(Number(rel.rating) || 4.8).toFixed(1)}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-medium">
                            ({rel.reviewsCount || 120})
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2.5 flex-wrap mb-3">
                          <span className="font-black text-xl sm:text-2xl text-[#900606]">
                            ₹{Number(rel.price).toLocaleString('en-IN')}
                          </span>
                          {rel.mrp > rel.price && (
                            <span className="text-xs sm:text-sm text-neutral-400 font-medium line-through">
                              MRP ₹{Number(rel.mrp).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="px-5 pb-5 pt-0 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const ok = addToCart({ id: rel.id || rel._id, name: rel.name, price: rel.price, quantity: 1, img: rel.image, image: rel.image }); if (ok) router.push('/cart');
                        }}
                        className="relative w-full py-2.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
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
        )}

        {/* POPULAR CREATORS BUNDLES SECTION */}
        <BuiltForCreators />

        {/* SPECIFICATIONS */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="w-full pt-2 pb-3 sm:py-6 bg-[#FBFBF7]">
            <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <h2 className="text-2xl sm:text-3xl font-medium text-[#111827] text-center pb-3">Product <span className="text-[#900606]">Specifications</span></h2>
              <div className="max-w-4xl mx-auto rounded-2xl border border-neutral-200 bg-white overflow-hidden divide-y divide-neutral-200/70">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between p-4 text-xs sm:text-sm">
                    <span className="font-semibold text-neutral-800 w-2/5">{spec.label}</span>
                    <span className="text-neutral-600 font-medium text-right w-3/5">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

