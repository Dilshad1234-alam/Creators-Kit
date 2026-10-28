'use client';
import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import Autoplay from 'embla-carousel-autoplay';
import BuiltForCreators from '@/components/BuiltForCreators';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Mail, 
  Award 
} from 'lucide-react';

export default function HomeClient({
  contentMap = {},
  heroBanners = [],
  categories: initialCategories = [],
  kitComponents = [],
  masteryCourses = [],
  blogs = []
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isLightOn, setIsLightOn] = useState(true);
  const [lightColor, setLightColor] = useState('white');
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsLightOn(localStorage.getItem('heroLightState') !== 'off');
      setLightColor(localStorage.getItem('heroLightColor') || 'white');
      setIsDarkMode(localStorage.getItem('creatorsKitTheme') === 'dark');
    }
  }, []);

  const defaultHeroSlides = [
    { image: '/banner 5.png' },
    { image: '/banner 1.png', title: 'PROFESSIONAL LIGHTING.', subtitle: '💡 Studio Grade', ctaText: 'Shop Lighting', link: '/product' },
    { image: '/banner 2.jpg', title: 'ULTIMATE STABILITY.', subtitle: '📸 Carbon Fiber', ctaText: 'Explore Tripods', link: '/product' },
    { image: '/banners 2.jpg', title: 'CRYSTAL CLEAR AUDIO.', subtitle: '🎙️ Pro Sound', ctaText: 'Shop Microphones', link: '/product' }
  ];

  const heroSlides = heroBanners && heroBanners.length > 0 ? heroBanners : defaultHeroSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  
  const totalSlides = heroSlides.length;

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, currentIndex]);

  const nextSlide = () => {
    if (currentIndex >= totalSlides) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

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

  const scrollTo = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (currentIndex === totalSlides) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, totalSlides]);

  const renderSlides = [...heroSlides, heroSlides[0]];

  const defaultCategories = [
    { name: 'Lights', image: '/ring.jpg', link: '/product', itemCount: 'Studio Lighting' },
    { name: 'Pro Tripods', image: '/tripod.jpg', link: '/product', itemCount: 'Heavy Duty Stands' },
    { name: 'Gimbal/Rig', image: '/chorma.jpg', link: '/product', itemCount: 'Stabilizers & Backdrops' },
    { name: 'Microphones', image: '/wireless-mic.jpg', link: '/product', itemCount: 'Wireless Audio' },
  ];

  const categories = initialCategories && initialCategories.length > 0 ? initialCategories : defaultCategories;

  const [mobileCatRef, mobileCatEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 2,
  });

  const scrollCatNext = useCallback(() => {
    if (mobileCatEmbla) mobileCatEmbla.scrollNext();
  }, [mobileCatEmbla]);

  const scrollCatPrev = useCallback(() => {
    if (mobileCatEmbla) mobileCatEmbla.scrollPrev();
  }, [mobileCatEmbla]);

  const mobileCategories = categories && categories.length > 0
    ? (categories.length <= 4 ? [...categories, ...categories] : categories)
    : [];


  const relatedProducts = [
    { id: 'digitek-ring-light-18', name: 'Digitek Ring Light 18"', price: 2499, mrp: 3499, discount: '28% OFF', image: '/ring.jpg' },
    { id: 'digitek-dtr-550-tripod', name: 'Digitek DTR 550 LW Tripod', price: 1999, mrp: 2499, discount: '20% OFF', image: '/tripod.jpg' },
    { id: 'green-screen-backdrop', name: 'Green Screen Backdrop', price: 799, mrp: 1299, discount: '38% OFF', image: '/chorma2.png' },
    { id: 'rode-wireless-go-ii', name: 'Rode Wireless GO II', price: 24999, mrp: 29999, discount: '16% OFF', image: '/wireless-mic.jpg' },
  ];

  const [featuredProducts, setFeaturedProducts] = useState(relatedProducts);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const res = await fetch('/api/products?type=individual');
        if (res.ok) {
          const data = await res.json();
          const items = data.data || [];
          if (items.length > 0) {
            const formatted = items.map((p) => {
              const priceVal = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
              const origVal = p.originalPrice ? Number(p.originalPrice) : Math.round(priceVal * 1.3);
              const discountVal = p.discount || (origVal > priceVal ? `${Math.round(((origVal - priceVal) / origVal) * 100)}% OFF` : '');

              return {
                id: p.id || p._id,
                _id: p._id,
                name: p.name,
                price: priceVal,
                mrp: origVal,
                discount: discountVal,
                image: p.image || '/ring.jpg',
              };
            });
            setFeaturedProducts(formatted);
          }
        }
      } catch (err) {
        console.error('Failed to load featured products from database:', err);
      }
    }
    loadFeaturedProducts();
  }, []);

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

  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);

  const [mobileCourseRef, mobileCourseEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollCourseNext = useCallback(() => {
    if (mobileCourseEmbla) mobileCourseEmbla.scrollNext();
  }, [mobileCourseEmbla]);

  const scrollCoursePrev = useCallback(() => {
    if (mobileCourseEmbla) mobileCourseEmbla.scrollPrev();
  }, [mobileCourseEmbla]);

  const [mobileTestimonialRef, mobileTestimonialEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollTestimonialNext = useCallback(() => {
    if (mobileTestimonialEmbla) mobileTestimonialEmbla.scrollNext();
  }, [mobileTestimonialEmbla]);

  const scrollTestimonialPrev = useCallback(() => {
    if (mobileTestimonialEmbla) mobileTestimonialEmbla.scrollPrev();
  }, [mobileTestimonialEmbla]);

  const mobileFeaturedProducts = featuredProducts && featuredProducts.length > 0
    ? (featuredProducts.length <= 4 ? [...featuredProducts, ...featuredProducts, ...featuredProducts] : featuredProducts)
    : [];

  const catalogProducts = [
    { id: 1, name: 'Digitek Ring Light 18', price: '₹999', oldPrice: '₹1,999', rating: '4.8', reviews: '1,245', tag: '30% OFF', image: '/ring.jpg' },
    { id: 2, name: 'Digitek DTR 550 LW Tripod', price: '₹1,499', oldPrice: '₹2,899', rating: '4.9', reviews: '890', tag: '25% OFF', image: '/tripod.jpg' },
    { id: 4, name: 'Green Screen Backdrop', price: '₹799', oldPrice: '₹999', rating: '4.9', reviews: '1,120', tag: '40% OFF', image: '/chorma.jpg' },
    { id: 5, name: 'Wireless Microphone', price: '₹1,999', oldPrice: '₹2,999', rating: '4.7', reviews: '560', tag: 'BEST SELLER', image: '/wireless-mic.jpg' },
  ];

  const [liveBlogs, setLiveBlogs] = useState(blogs || []);

  useEffect(() => {
    async function loadLatestBlogs() {
      try {
        const res = await fetch('/api/blogs', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLiveBlogs(data);
          }
        }
      } catch (err) {
        // fallback to server props
      }
    }
    loadLatestBlogs();
  }, [blogs]);

  const fallbackStories = [
    { id: 'story-1', name: 'Rohan Sharma', product: 'AuraRing 10" Pro RGB', image: '/blog.jpg', description: 'See how Rohan transformed a tiny bedroom into a cinematic studio.' },
    { id: 'story-2', name: 'Priya Verma', product: 'VoiceForge Wireless Mic', image: '/blog1.jpg', description: 'Priya shares how dual-channel wireless mic systems eliminate city noise and fan hums effortlessly.' },
    { id: 'story-3', name: 'Kunal Singh', product: 'ApexPro Heavy-Duty Tripod', image: '/blog2.jpg', description: 'Tired of shaky footage, Kunal upgraded to carbon fiber for rock-solid stability.' },
    { id: 'story-4', name: 'Ananya Desai', product: 'Complete Creator Bundle', image: '/blog3.jpg', description: 'Ananya reached 100k subscribers in 3 months using the complete bundle.' },
    { id: 'story-5', name: 'Vikram Mehta', product: 'Pro Studio Lighting Setup', image: '/blog4.jpg', description: 'Vikram fixed dull lighting and achieved professional studio quality.' },
  ];

  const coursesList = (masteryCourses && masteryCourses.length > 0)
    ? masteryCourses
    : [
        {
          _id: 'inst-1',
          title: 'Instagram Mastery',
          description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
          image: '/video 2.webp',
          badge: '100% Free',
          ctaText: 'Explore Bundles',
          ctaLink: '/product'
        },
        {
          _id: 'yt-1',
          title: 'YouTube Mastery',
          description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
          image: '/video 1.webp',
          badge: '100% Free',
          ctaText: 'Explore Bundles',
          ctaLink: '/product'
        },
        {
          _id: 'film-1',
          title: 'Filmora Mastery',
          description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
          image: '/video.webp',
          badge: '100% Free',
          ctaText: 'Explore Bundles',
          ctaLink: '/product'
        }
      ];

  const mobileCoursesList = coursesList.length <= 3
    ? [...coursesList, ...coursesList, ...coursesList]
    : coursesList;

  const customerStories = liveBlogs && liveBlogs.length > 0
    ? liveBlogs.map((b) => ({
        id: b.slug || b._id,
        name: b.author || 'Verified Creator',
        product: b.product || 'Creators Kit Gear',
        image: b.image || '/blog.jpg',
        description: b.title || b.excerpt || 'Customer creator story.',
        content: b.content || b.excerpt || ''
      }))
    : fallbackStories;

  const testimonials = [
    { 
      name: 'Vikram Kashyap', 
      role: 'Tech Reviewer • 240K Subs', 
      text: '“Comprehensive studio kit that actually feels premium. The color accuracy on the main ring light exceeds my expectations, and the fluid head tripod alone is worth the entry price point.”', 
      date: '2 days ago', 
      stars: 5,
      image: '/team/rahul.jpg',
      product: 'Pro Creator Kit'
    },
    { 
      name: 'Sanya Malhotra', 
      role: 'Beauty & Lifestyle Creator', 
      text: '“The ring light color accuracy is phenomenal! Most budget lights give off a weird sickly green cast, but not this one. The skin tones look flawless, and the setup took me less than 10 mins.”', 
      date: '1 week ago', 
      stars: 5,
      image: '/team/priya.jpg',
      product: 'Studio RGB Ring Light'
    },
    { 
      name: 'Rishi Aditya', 
      role: 'Podcaster & Interviewer', 
      text: '“Rock solid mic arm and the mount holds well. The tripod extends high without any wobble, and the wireless trigger is a neat touch for remote recording setups.”', 
      date: '3 weeks ago', 
      stars: 5,
      image: '/team/manish.jpg',
      product: 'Rode Wireless GO II'
    },
    { 
      name: 'Priya Desai', 
      role: 'Fitness & Motion Vlogger', 
      text: '“The RGB lighting and green screen are incredibly versatile. They completely transformed my workout room into an ultra-sharp production studio. Super happy!”', 
      date: '1 month ago', 
      stars: 5,
      image: '/team/team_3.jpg',
      product: 'Basic Creator Kit'
    },
    { 
      name: 'Karan Singh', 
      role: 'Gaming & Live Streamer', 
      text: '“The mic clarity is insane for the price! No more room echo or background hiss. Having free access to the editing course helped me fix my workflow in days.”', 
      date: '1 month ago', 
      stars: 5,
      image: '/team/ankit.jpg',
      product: 'Wireless Mic Bundle'
    },
    { 
      name: 'Ananya Rao', 
      role: 'Travel Filmmaker', 
      text: '“The heavy-duty tripod is super lightweight yet holds my mirrorless rig effortlessly on windy days. Best purchase I’ve made for run-and-gun content.”', 
      date: '2 months ago', 
      stars: 5,
      image: '/cand_1.jpg',
      product: 'ApexPro Heavy-Duty Tripod'
    },
  ];

  const mobileTestimonials = testimonials && testimonials.length > 0
    ? (testimonials.length <= 4 ? [...testimonials, ...testimonials, ...testimonials] : testimonials)
    : [];

  const scrollReviews = (direction) => {
    const container = document.getElementById('reviews-scroll-container');
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -344 : 344, behavior: 'smooth' }); // 320px + 24px gap
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#FBFBF7] text-[#111827] font-sans overflow-x-hidden w-full">
      <main className="flex-grow w-full pt-16 sm:pt-20">
        
        {/* 1. HERO SECTION (CAROUSEL) */}
        <section className="relative w-full overflow-hidden bg-[#FBFBF7] mb-5">
          <div className="w-full relative z-8 max-w-[3000px] mx-auto">
            <div 
              className="relative w-full h-[250px] xs:h-[300px] sm:h-[550px] md:h-[600px] lg:h-[700px] overflow-hidden bg-[#0a0a0a] group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel Track */}
              <div 
                className={`flex h-full will-change-transform ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {renderSlides.map((slide, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative flex items-center justify-start overflow-hidden">
                    
                    {/* Full-Card Background Image */}
                    {slide.link ? (
                      <Link href={slide.link} className="absolute inset-0 w-full h-full block">
                        {slide.mobileImage ? (
                          <>
                            <Image src={getImageUrl(slide.mobileImage)} alt={slide.title || "Hero Banner"} fill sizes="100vw" priority={idx === 0} className="object-cover object-center sm:hidden" />
                            <Image src={getImageUrl(slide.image)} alt={slide.title || "Hero Banner"} fill sizes="100vw" priority={idx === 0} className="object-cover object-center hidden sm:block" />
                          </>
                        ) : (
                          <Image src={getImageUrl(slide.image)} alt={slide.title || "Hero Banner"} fill sizes="100vw" priority={idx === 0} className="object-cover object-center" />
                        )}
                      </Link>
                    ) : (
                      <div className="absolute inset-0 w-full h-full block">
                        {slide.mobileImage ? (
                          <>
                            <Image src={getImageUrl(slide.mobileImage)} alt={slide.title || "Hero Banner"} fill sizes="100vw" priority={idx === 0} className="object-cover object-center sm:hidden" />
                            <Image src={getImageUrl(slide.image)} alt={slide.title || "Hero Banner"} fill sizes="100vw" priority={idx === 0} className="object-cover object-center hidden sm:block" />
                          </>
                        ) : (
                          <Image src={getImageUrl(slide.image)} alt={slide.title || "Hero Banner"} fill sizes="100vw" priority={idx === 0} className="object-cover object-center" />
                        )}
                      </div>
                    )}

                    {/* Dynamic Text & CTA Overlay (Rendered if title, subtitle or ctaText exists) */}
                    {(slide.title || slide.subtitle || slide.ctaText) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 max-w-3xl pointer-events-none">
                        {slide.subtitle && (
                          <div className="inline-block px-3.5 py-1 rounded-full bg-[#900606] text-white text-xs font-bold w-fit mb-3 shadow-sm tracking-wide">
                            {slide.subtitle}
                          </div>
                        )}
                        {slide.title && (
                          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md">
                            {slide.title}
                          </h2>
                        )}
                        {slide.ctaText && (
                          <div className="pointer-events-auto mt-2">
                            <Link
                              href={slide.link || '/product'}
                              className="inline-flex items-center gap-2 bg-[#900606] hover:bg-[#720404] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95"
                            >
                              <span>{slide.ctaText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {heroSlides.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => scrollTo(idx)}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      (currentIndex === totalSlides ? 0 : currentIndex) === idx 
                        ? 'bg-[#900606] w-6 md:w-8' 
                        : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. SHOP BY CATEGORY */}
        <section className="w-full pt-0 pb-2 sm:pb-4 lg:pb-6 bg-[#FBFBF7]">
          <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
            
            {/* DESKTOP VIEW (md:block) - EXACTLY AS BEFORE */}
            <div className="hidden md:block">
              <div className="flex flex-col items-center text-center mb-8 relative">
                <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
                  Shop by  <span className="text-[#900606] whitespace-nowrap">Category</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {categories.map((cat, i) => (
                  <Link href={cat.link || "/product"} key={i} className="group flex flex-col items-center justify-end p-6 md:p-8 h-80 sm:h-96 rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative w-full">
                    <Image src={getImageUrl(cat.image)} alt={cat.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="w-full h-full object-cover rounded-3xl group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-0"></div>
                    <div className="relative z-10 flex flex-col items-center mt-auto">
                      <h3 className="font-normal text-white text-lg md:text-2xl text-center mb-1 drop-shadow-md">{cat.name}</h3>
                      {cat.itemCount && (
                        <span className="text-white/80 text-xs font-medium tracking-wide mt-0.5">{cat.itemCount}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* MOBILE VIEW (block md:hidden) - RESPONSIVE SLIDER EXACTLY LIKE IMAGE 3 */}
            <div className="block md:hidden">
              <div className="flex flex-col items-center text-center mb-4 relative">
                <h2 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">
                  Shop by <span className="text-[#900606] whitespace-nowrap">Category</span>
                </h2>
              </div>

              <div className="relative w-full px-1">
                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={scrollCatPrev}
                  aria-label="Previous categories"
                  className="absolute left-0 top-[36%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={scrollCatNext}
                  aria-label="Next categories"
                  className="absolute right-0 top-[36%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                </button>

                {/* Embla Viewport */}
                <div className="overflow-hidden w-full px-2" ref={mobileCatRef}>
                  <div className="flex -ml-3">
                    {mobileCategories.map((cat, i) => (
                      <div key={i} className="flex-[0_0_50%] min-w-0 pl-3">
                        <Link
                          href={cat.link || "/product"}
                          className="group flex flex-col items-center w-full transition-transform duration-300"
                        >
                          {/* Squircle Image Card */}
                          <div className="relative aspect-square w-full rounded-[22px] overflow-hidden bg-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-neutral-200/70">
                            <Image
                              src={getImageUrl(cat.image)}
                              alt={cat.name}
                              fill
                              sizes="50vw"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                          </div>

                          {/* Category Label Below Image */}
                          <div className="mt-2 text-center w-full px-1">
                            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm leading-tight truncate">
                              {cat.name}
                            </h3>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PROMOTIONAL IMAGE BANNER (FULL WIDTH EDGE-TO-EDGE WITH TEXT & CARDS) */}
        <section className="w-full pt-4 sm:pt-8 bg-[#FBFBF7] overflow-hidden">
          <div className="w-full max-w-[3000px]">
            <div className="relative w-full overflow-hidden shadow-2xl p-5 sm:p-8 md:p-14 lg:p-20 min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] flex flex-col justify-center">
      
              {/* Background Image Covering Entire Banner */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <Image 
                  src={getImageUrl('/banner 9.png')} 
                  alt="Built for Creators" 
                  fill 
                  sizes="100vw" 
                  className="object-cover object-[78%_center] sm:object-center w-full h-full" 
                />
                {/* On mobile: full dark gradient ensuring 100% text readability; on desktop: smooth horizontal gradient showing creator */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/85 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/50 sm:to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 flex flex-col items-start text-left max-w-4xl">

                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight pb-3 sm:pb-6 md:pb-10">
                  Built for <span className="text-red-500 sm:text-[#900606] whitespace-nowrap">Creators</span>, by Creators
                </h2>
        
                <p className="text-neutral-200 font-medium text-xs sm:text-sm md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed drop-shadow-md max-w-2xl">
                  We eliminate the guesswork with pro-grade gear, hands-on masterclasses, and dedicated support so you can focus on building your audience and crafting unforgettable content.
                </p>

                {/* 4 Cards: 2x2 Grid on Mobile, 4 Columns on Desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
          
                  {/* Card 1 */}
                  <div className="bg-black/60 sm:bg-black/70 border border-white/10 sm:border-white/15 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-md sm:shadow-lg font-sans">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-2.5 sm:mb-3 text-xs sm:text-sm">
                      💎
                    </div>
                    <div>
                      <h3 className="font-semibold sm:font-normal text-white text-xs sm:text-sm tracking-tight sm:tracking-wide mb-0.5 sm:mb-1 leading-snug">High Quality Products</h3>
                      <p className="text-neutral-400 text-[11px] sm:text-xs font-normal leading-tight">Curated for creators</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-black/60 sm:bg-black/70 border border-white/10 sm:border-white/15 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-md sm:shadow-lg font-sans">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-2.5 sm:mb-3 text-xs sm:text-sm">
                      🏷️
                    </div>
                    <div>
                      <h3 className="font-semibold sm:font-normal text-white text-xs sm:text-sm tracking-tight sm:tracking-wide mb-0.5 sm:mb-1 leading-snug">Best Prices in India</h3>
                      <p className="text-neutral-400 text-[11px] sm:text-xs font-normal leading-tight">Great value, always</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-black/60 sm:bg-black/70 border border-white/10 sm:border-white/15 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-md sm:shadow-lg font-sans">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-2.5 sm:mb-3 text-xs sm:text-sm">
                      📖
                    </div>
                    <div>
                      <h3 className="font-semibold sm:font-normal text-white text-xs sm:text-sm tracking-tight sm:tracking-wide mb-0.5 sm:mb-1 leading-snug">Expert-Led Courses</h3>
                      <p className="text-neutral-400 text-[11px] sm:text-xs font-normal leading-tight">Learn from experts</p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-black/60 sm:bg-black/70 border border-white/10 sm:border-white/15 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-md sm:shadow-lg font-sans">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-2.5 sm:mb-3 text-xs sm:text-sm">
                      🎧
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-xs sm:text-sm tracking-tight sm:tracking-wide mb-0.5 sm:mb-1 leading-snug">After-Sales Support</h3>
                      <p className="text-neutral-400 text-[11px] sm:text-xs font-normal leading-tight">We're here to help</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PRODUCTS CATEGORY GRID SECTION */}
        <section className="w-full pt-2 pb-2 sm:pt-8 sm:pb-6 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight pb-2 sm:pb-4 md:pb-8">
              Features <span className="text-[#900606] whitespace-nowrap">Products</span>
            </h2>
            
            {/* MOBILE VIEW (block md:hidden) - EXACTLY 1 CARD PER SCREEN WITH BOTH ARROWS */}
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
                            {/* Image Container with Taller Height (aspect-[4/5]) and Badges */}
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

                          {/* Action Button: rounded-xl jaisa desktop me hai */}
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

            {/* DESKTOP VIEW (hidden md:grid) - EXACTLY AS BEFORE */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
              {featuredProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id || rel._id}
                  onClick={() => router.push(`/product/${rel.id || rel._id}`)}
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
                          id: rel.id,
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

        {/* COMPLETE KIT MORE VALUE BANNER */}
        <section className="w-full pt-2 sm:pt-6 bg-[#FBFBF7] overflow-hidden">
          <div className="w-full relative max-w-[3000px]">
            <div className="relative w-full overflow-hidden shadow-2xl bg-black flex flex-col justify-center p-5 md:p-10 lg:p-15 min-h-[560px] lg:min-h-[640px]">
      
              {/* Background Image covering the entire banner */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <Image 
                  src={getImageUrl('/banner 6.png')} 
                  alt="Complete Kit More Value" 
                  fill 
                  sizes="100vw" 
                  className="object-cover object-center w-full h-full" 
                />
                {/* Rich dark gradient overlay on the left for text readability while keeping the right side image clean */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent lg:w-[70%]"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 flex flex-col items-start text-left max-w-xl">
        
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight mb-4">
                  Complete Kit.<br />
                  <span className="text-[#900606]">More Value.</span>
                </h2>
        
                <p className="text-neutral-300 text-sm md:text-base font-medium mb-8">
                  Get everything you need in one bundle and unlock exclusive free courses worth ₹4,999.
                </p>

                {/* Feature Highlights / Badges */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                    <span className="text-[#900606]">✓</span> Save More <span className="text-neutral-400 font-normal">Compared to individual products</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                    <span className="text-[#900606]">★</span> Perfect for Beginners <span className="text-neutral-400 font-normal">With every bundle</span>
                  </div>
                </div>

                {/* Explore Bundles Button */}
                <Link 
                  href="/product" 
                  className="relative px-9 py-4 bg-white text-[#111827] border-2 rounded-xl font-black text-base overflow-hidden group/btn transition-all duration-300 shadow-[0_8px_25px_rgba(144,6,6,0.3)] inline-flex items-center justify-center gap-2"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center gap-2">
                    Explore Bundles ➔
                  </span>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* BUILT FOR CREATORS, BY CREATORS (VALUE PROPOSITION BANNER) */}
        <BuiltForCreators />

        {/* 3. CUSTOMER SUCCESS STORIES / BLOG */}
        <section className="w-full pt-4 pb-2 sm:pt-6 sm:pb-12 bg-[#FBFBF7] overflow-hidden">
          <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 mb-6 sm:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight pb-1 sm:pb-3">
              Review of <span className="text-[#900606] whitespace-nowrap">Creators</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-normal mt-1.5 sm:mt-2.5 max-w-xl mx-auto px-4">
              Discover how our gear is helping creators build better content every day.
            </p>
          </div>

          <div 
            className="w-full relative overflow-hidden flex pause-marquee"
            onMouseEnter={() => setIsMarqueeHovered(true)}
            onMouseLeave={() => setIsMarqueeHovered(false)}
            onTouchStart={() => setIsMarqueeHovered(true)}
            onTouchEnd={() => setIsMarqueeHovered(false)}
          >
            <div 
              className={`flex gap-4 sm:gap-6 animate-marquee shrink-0 w-max hover:[animation-play-state:paused] active:[animation-play-state:paused] ${isMarqueeHovered ? 'animate-marquee-paused' : ''}`}
              style={{ animationPlayState: isMarqueeHovered ? 'paused' : 'running' }}
            >
              {[...customerStories, ...customerStories].map((item, idx) => (
                <Link 
                  key={`${item.id}-${idx}`} 
                  href={`/blog/${item.id}?title=${encodeURIComponent(item.name)}&product=${encodeURIComponent(item.product)}&description=${encodeURIComponent(item.description)}&image=${encodeURIComponent(item.image)}`}
                  onMouseEnter={() => setIsMarqueeHovered(true)}
                  onMouseLeave={() => setIsMarqueeHovered(false)}
                  className={`group flex flex-col ${isDarkMode ? 'bg-[#131C2E]' : 'bg-white'} rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative border border-neutral-200 dark:border-neutral-800 w-[270px] sm:w-[310px] md:w-[350px] shrink-0 cursor-pointer`}
                >
                  {/* Edge-to-Edge Image Container */}
                  <div className="relative w-full h-[230px] sm:h-[270px] md:h-[310px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    <Image 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 25vw" 
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* User Name & Description */}
                  <div className="flex flex-col flex-grow font-sans mb-3 sm:mb-4 px-4 pt-3.5 sm:px-5 sm:pt-4">
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2 text-xs sm:text-[14px] leading-snug line-clamp-2 font-sans">{item.description}</h3>
                    <div className="flex items-baseline gap-2 mt-auto font-sans w-full overflow-hidden">
                      <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-[1rem] shrink-0 whitespace-nowrap">{item.name}</span>
                      <span className="text-[11px] sm:text-[12px] text-neutral-500 font-medium truncate">{item.product}</span>
                    </div>
                  </div>

                  {/* Button with horizontal padding matching content */}
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 mt-auto">
                    <div className="relative w-full py-2.5 sm:py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-xs sm:text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center">
                      <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                      <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                        Read Story
                      </span>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BONUS: FREE RECORDED MASTERCLASS & PERKS WITH EVERY PURCHASE */}
        <section className="w-full pt-2 pb-3 sm:py-12 lg:py-16 bg-[#FBFBF7]">
          <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-10">
    
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-6 lg:gap-12">
      
              {/* Left Side: Header & CTA Button */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg shrink-0">

                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight pb-1 sm:pb-3">
                  Learn. <span className="text-[#900606]">Create.</span> Grow.
                </h2>

                <p className="text-neutral-600 font-medium text-xs sm:text-sm md:text-base lg:text-lg mb-2.5 sm:mb-6 leading-relaxed max-w-md">
                  Buy any creator bundle and get premium courses worth ₹4,999 absolutely free.
                </p>

                {/* Explore Bundles Button */}
                <Link 
                  href="/product" 
                  className="relative px-7 py-2.5 sm:px-9 sm:py-3.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-xs sm:text-base overflow-hidden group/btn transition-all duration-300 shadow-sm inline-flex items-center justify-center gap-2 mb-0 lg:mb-0"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    Explore Bundles ➔
                  </span>
                </Link>
              </div>

              {/* Right Side: Desktop View (hidden lg:grid) - 3-Column Grid */}
              <div className="hidden lg:grid grid-cols-3 gap-6 w-full">
                {coursesList.map((course, idx) => (
                  <div 
                    key={course._id || idx} 
                    className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-center items-center group/card"
                  >
                    <div className="w-full h-44 sm:h-48 rounded-2xl bg-neutral-50 overflow-hidden relative mb-5 border border-neutral-200/80 p-2 flex items-center justify-center group-hover/card:scale-[1.02] transition-transform">
                      <Image 
                        src={getImageUrl(course.image || (idx === 0 ? '/video 2.webp' : idx === 1 ? '/video 1.webp' : '/video.webp'))} 
                        alt={course.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 33vw" 
                        className="object-contain drop-shadow-sm" 
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#111827] mb-2">{course.title}</h3>
                      <p className="text-neutral-600 font-medium text-sm leading-relaxed mb-6">
                        {course.description}
                      </p>
                    </div>
                    <div className="w-full pt-4 border-t border-neutral-100 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold text-[#900606]">
                        {course.badge || '100% Free'}
                      </span>
                      {course.ctaText && (
                        <Link
                          href={course.ctaLink || '/product'}
                          className="text-[11px] font-bold text-neutral-500 hover:text-[#900606] transition-colors inline-flex items-center gap-1"
                        >
                          <span>{course.ctaText}</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Mobile View (block lg:hidden) - 1 Card at a Time with Left & Right Arrows */}
              <div className="block lg:hidden relative w-full px-2 mt-1">
                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={scrollCoursePrev}
                  aria-label="Previous course"
                  className="absolute left-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={scrollCourseNext}
                  aria-label="Next course"
                  className="absolute right-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                </button>

                {/* Carousel Viewport - Exactly 1 Card on Screen */}
                <div className="overflow-hidden w-full px-1" ref={mobileCourseRef}>
                  <div className="flex">
                    {mobileCoursesList.map((course, idx) => (
                      <div
                        key={course._id ? `${course._id}-${idx}` : `m-course-${idx}`}
                        className="flex-[0_0_100%] min-w-0 px-2 shrink-0"
                      >
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between text-center items-center h-full">
                          <div className="w-full">
                            <div className="w-full h-44 sm:h-48 rounded-2xl bg-neutral-50 overflow-hidden relative mb-4 border border-neutral-200/80 p-2 flex items-center justify-center">
                              <Image 
                                src={getImageUrl(course.image || (idx % 3 === 0 ? '/video 2.webp' : idx % 3 === 1 ? '/video 1.webp' : '/video.webp'))} 
                                alt={course.title} 
                                fill 
                                sizes="90vw" 
                                className="object-contain drop-shadow-sm" 
                              />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-1.5">{course.title}</h3>
                            <p className="text-neutral-600 font-medium text-xs sm:text-sm leading-relaxed mb-4">
                              {course.description}
                            </p>
                          </div>
                          <div className="w-full pt-3 border-t border-neutral-100 flex flex-col items-center gap-1.5">
                            <span className="text-xs font-bold text-[#900606]">
                              {course.badge || '100% Free'}
                            </span>
                            <Link
                              href={course.ctaLink || '/product'}
                              className="text-[11px] font-bold text-neutral-500 hover:text-[#900606] transition-colors inline-flex items-center gap-1"
                            >
                              <span>{course.ctaText || 'Explore Bundles'}</span>
                              <span>→</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 1. WHAT CREATORS SAY TESTIMONIALS SECTION */}
        <section className="w-full pb-6 sm:pb-10 bg-[#FBFBF7] overflow-hidden font-sans">  
          {/* Stats Bar */}
          <div className="w-full bg-[#FBFBF7] py-3 sm:py-6 mb-3 sm:mb-6 border-t border-b border-neutral-200/80">
            <div className="max-w-[1750px] mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#900606]">50,000+</p>
                  <p className="text-[11px] sm:text-xs text-neutral-600 font-bold tracking-wide">Happy Creators</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#900606]">10,000+</p>
                  <p className="text-[11px] sm:text-xs text-neutral-600 font-bold tracking-wide">Products Delivered</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#900606]">500+</p>
                  <p className="text-[11px] sm:text-xs text-neutral-600 font-bold tracking-wide">Students Trained</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#900606]">4.8/5</p>
                  <p className="text-[11px] sm:text-xs text-neutral-600 font-bold tracking-wide">Customer Rating</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
    
            {/* Testimonials Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-4 mb-3 sm:mb-6 pb-2.5 sm:pb-4 border-b border-neutral-200/80">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111827] dark:text-white tracking-tight">
                  What <span className="text-[#900606] whitespace-nowrap">Creators</span> Say
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm font-medium mt-1 sm:mt-1.5 leading-relaxed">
                  Join over 50,000+ creators who transformed their content quality with Creators Kit gear.
                </p>
              </div>
            </div>
    
            {/* DESKTOP REVIEW GRID (hidden md:grid) - EXACTLY AS BEFORE */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-[#131C2E] p-6 sm:p-7 rounded-3xl sm:rounded-[2rem] border border-neutral-200/90 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Avatar, Name, Verified Checkmark, Rating */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border-2 border-white dark:border-neutral-700 shadow-sm shrink-0">
                          {t.image ? (
                            <Image 
                              src={getImageUrl(t.image)} 
                              alt={t.name} 
                              fill
                              sizes="48px"
                              className="object-cover object-center" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-neutral-600 bg-neutral-200">
                              {t.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm sm:text-base text-[#111827] dark:text-white leading-tight">
                              {t.name}
                            </h4>
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black" title="Verified Creator">
                              ✓
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 font-medium mt-0.5">{t.role}</p>
                        </div>
                      </div>

                      {/* Verified Purchase Tag */}
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </div>

                    {/* 5-Star Yellow Stars Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 ml-1.5">5.0</span>
                    </div>

                    {/* Testimonial Feedback Text */}
                    <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal">
                      {t.text}
                    </p>
                  </div>

                  {/* Bottom Footer inside Card */}
                  <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-medium text-[#900606] dark:text-red-400 truncate max-w-[180px]">
                      {t.product || 'Creators Kit Bundle'}
                    </span>
                    <span>{t.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* MOBILE REVIEW CAROUSEL (block md:hidden) - EXACTLY 1 CARD PER SCREEN WITH BOTH ARROWS */}
            <div className="block md:hidden relative w-full px-2">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={scrollTestimonialPrev}
                aria-label="Previous review"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={scrollTestimonialNext}
                aria-label="Next review"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
              </button>

              {/* Embla Viewport */}
              <div className="overflow-hidden w-full px-1" ref={mobileTestimonialRef}>
                <div className="flex">
                  {mobileTestimonials.map((t, i) => (
                    <div
                      key={`m-test-${i}`}
                      className="flex-[0_0_100%] min-w-0 px-2 shrink-0"
                    >
                      <div className="bg-white dark:bg-[#131C2E] p-5 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full">
                        <div>
                          {/* Top row: Avatar, Name, Verified Checkmark */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-neutral-100 border-2 border-white dark:border-neutral-700 shadow-sm shrink-0">
                                {t.image ? (
                                  <Image 
                                    src={getImageUrl(t.image)} 
                                    alt={t.name} 
                                    fill
                                    sizes="44px"
                                    className="object-cover object-center" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-neutral-600 bg-neutral-200">
                                    {t.name[0]}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-sm text-[#111827] dark:text-white leading-tight">
                                    {t.name}
                                  </h4>
                                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-black" title="Verified Creator">
                                    ✓
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{t.role}</p>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-full shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              Verified
                            </span>
                          </div>

                          {/* 5-Star Yellow Stars Rating */}
                          <div className="flex items-center gap-1 mb-2.5">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 ml-1.5">5.0</span>
                          </div>

                          {/* Testimonial Feedback Text */}
                          <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal">
                            {t.text}
                          </p>
                        </div>

                        {/* Bottom Footer inside Card */}
                        <div className="pt-3.5 mt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                          <span className="font-medium text-[#900606] dark:text-red-400 truncate max-w-[160px]">
                            {t.product || 'Creators Kit Bundle'}
                          </span>
                          <span>{t.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. READY TO START YOUR CREATOR JOURNEY BANNER */}
        <section className="relative w-full py-10 sm:py-14 lg:py-16 bg-[#900606] text-white overflow-hidden">
          {/* Subtle Ambient Radial Glow Overlays */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-400/20 blur-[130px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-black/25 blur-[110px] rounded-full pointer-events-none"></div>

          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight mb-3 sm:mb-5 max-w-3xl">
              Ready to Start Your Creator Journey?
            </h2>

            <p className="text-red-100/90 text-xs sm:text-sm md:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mb-6 sm:mb-9 px-2">
              Equip your studio with industry-standard hardware, unlock expert masterclasses worth ₹4,999 for free, and join 50,000+ creators turning their passion into a profession.
            </p>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none">
              <Link
                href="/product"
                className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 bg-white text-[#900606] hover:bg-neutral-100 rounded-xl font-black text-xs sm:text-base shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-3 sm:px-8 sm:py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-xl font-bold text-xs sm:text-base transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <span>Learn More</span>
              </Link>
            </div>

            {/* Trust Highlights Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-white/15 w-full max-w-4xl text-[11px] sm:text-xs md:text-sm font-medium sm:font-semibold text-red-100">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center sm:text-left">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center sm:text-left">
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>7-Day Replacement</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center sm:text-left">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>1-Year Official Warranty</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center sm:text-left">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>Free Bonus Courses</span>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}