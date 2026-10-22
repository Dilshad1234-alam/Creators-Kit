'use client';
import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect, useCallback } from 'react';
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
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Mail, 
  Award 
} from 'lucide-react';

export default function HomeClient({ contentMap, kitComponents, masteryCourses }) {
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

  const heroSlides = [
    { image: '/banner 5.png' },
    { image: '/banner 1.png', title: 'PROFESSIONAL LIGHTING.', subtitle: '💡 Studio Grade', link: '/product' },
    { image: '/banner 2.jpg', title: 'ULTIMATE STABILITY.', subtitle: '📸 Carbon Fiber', link: '/product' },
    { image: '/banners 2.jpg', title: 'CRYSTAL CLEAR AUDIO.', subtitle: '🎙️ Pro Sound', link: '/product' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
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

  const categories = [
    { name: 'Lights', image: '/ring.jpg' },
    { name: 'Pro Tripods', image: '/tripod.jpg' },
    { name: 'Gimbal/Rig', image: '/chorma.jpg' },
    { name: 'Microphones', image: '/wireless-mic.jpg' },
  ];

  const relatedProducts = [
    { id: 1, name: 'Digitek Ring Light 18"', price: 2499, mrp: 3499, discount: '28% OFF', image: '/ring.jpg' },
    { id: 2, name: 'Digitek DTR 550 LW Tripod', price: 1999, mrp: 2499, discount: '20% OFF', image: '/tripod.jpg' },
    { id: 3, name: 'Green Screen Backdrop', price: 799, mrp: 1299, discount: '38% OFF', image: '/chorma2.png' },
    { id: 4, name: 'Rode Lavalier GO', price: 7999, mrp: 9999, discount: '20% OFF', image: '/wireless-mic.jpg' },
  ];

  const catalogProducts = [
    { id: 1, name: 'Digitek Ring Light 18', price: '₹999', oldPrice: '₹1,999', rating: '4.8', reviews: '1,245', tag: '30% OFF', image: '/ring.jpg' },
    { id: 2, name: 'Digitek DTR 550 LW Tripod', price: '₹1,499', oldPrice: '₹2,899', rating: '4.9', reviews: '890', tag: '25% OFF', image: '/tripod.jpg' },
    { id: 4, name: 'Green Screen Backdrop', price: '₹799', oldPrice: '₹999', rating: '4.9', reviews: '1,120', tag: '40% OFF', image: '/chorma.jpg' },
    { id: 5, name: 'Wireless Microphone', price: '₹1,999', oldPrice: '₹2,999', rating: '4.7', reviews: '560', tag: 'BEST SELLER', image: '/wireless-mic.jpg' },
  ];

  const customerStories = [
    { id: 'story-1', name: 'Rohan Sharma', product: 'AuraRing 10" Pro RGB', image: '/blog.jpg', description: 'See how Rohan transformed a tiny bedroom into a cinematic studio.' },
    { id: 'story-2', name: 'Priya Verma', product: 'VoiceForge Wireless Mic', image: '/blog1.jpg', description: 'Priya eliminated background noise for crystal-clear outdoor vlogs.' },
    { id: 'story-3', name: 'Kunal Singh', product: 'ApexPro Heavy-Duty Tripod', image: '/blog2.jpg', description: 'Tired of shaky footage, Kunal upgraded to carbon fiber for rock-solid stability.' },
    { id: 'story-4', name: 'Ananya Desai', product: 'Complete Creator Bundle', image: '/blog3.jpg', description: 'Ananya reached 100k subscribers in 3 months using the complete bundle.' },
    { id: 'story-5', name: 'Vikram Mehta', product: 'Pro Studio Lighting Setup', image: '/blog4.jpg', description: 'Vikram fixed dull lighting and achieved professional studio quality.' },
  ];

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

  const scrollReviews = (direction) => {
    const container = document.getElementById('reviews-scroll-container');
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -344 : 344, behavior: 'smooth' }); // 320px + 24px gap
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#FBFBF7] text-[#111827] font-sans overflow-x-hidden w-full">
      <main className="flex-grow w-full pt-20">
        
        {/* 1. HERO SECTION (CAROUSEL) */}
        <section className="relative w-full overflow-hidden bg-[#FBFBF7]  mb-5">
          <div className="w-full relative z-8  max-w-[3000px] mx-auto">
            <div 
              className="relative w-full h-[650px] md:h-[600px] lg:h-[700px]  overflow-hidden bg-[#0a0a0a] group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Carousel Track */}
              <div 
                className={`flex h-full will-change-transform ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {renderSlides.map((slide, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative flex items-center justify-start">
                    
                    {/* Full-Card Background Image */}
                    {slide.link ? (
                      <Link href={slide.link} className="absolute inset-0 w-full h-full block">
                        <Image src={getImageUrl(slide.image)} alt="Hero Banner" fill sizes="100vw" priority={idx === 0} className="object-cover object-center " />
                      </Link>
                    ) : (
                      <div className="absolute inset-0 w-full h-full block">
                        <Image src={getImageUrl(slide.image)} alt="Hero Banner" fill sizes="100vw" priority={idx === 0} className="object-cover object-center rounded-2xl" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transition-all opacity-0 hover:opacity-100 z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transition-all opacity-0 hover:opacity-100 z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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

        {/* 2. SHOP BY CATEGORY (BENTO) */}
        <section className="w-full pt-0 pb-2 lg:pb-4 bg-[#FBFBF7]">
          <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
            
            <div className="flex flex-col items-center text-center mb-8  relative">
              <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
                Shop by  <span className="text-[#900606] whitespace-nowrap">Category</span>
              </h2>
              <p className="text-neutral-600 mt-2 font-medium text-lg max-w-2xl">Everything you need to build a visually demanding, high-retention podcast or streaming studio.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {categories.map((cat, i) => (
                <Link href="/product" key={i} className="group flex flex-col items-center justify-end p-6 md:p-8 h-80 sm:h-96 rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative w-full">
                  <Image src={getImageUrl(cat.image)} alt={cat.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="w-full h-full object-cover rounded-3xl group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-0"></div>
                  <div className="relative z-10 flex flex-col items-center mt-auto">
                    <h3 className="font-normal text-white text-lg md:text-2xl text-center mb-1 drop-shadow-md">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PROMOTIONAL IMAGE BANNER (FULL WIDTH EDGE-TO-EDGE WITH TEXT & CARDS) */}

        <section className="w-full pt-8 bg-[#FBFBF7] overflow-hidden">
          <div className="w-full max-w-[3000px]">
            <div className="relative w-full overflow-hidden shadow-2xl p-8 md:p-14 lg:p-20 min-h-[580px] lg:min-h-[660px] flex flex-col justify-center">
      
              {/* Background Image Covering Entire Banner */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <Image 
                  src={getImageUrl('/banner 9.png')} 
                  alt="Built for Creators" 
                  fill 
                  sizes="100vw" 
                  className="object-cover object-center w-full h-full" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 flex flex-col items-start text-left max-w-4xl">

                <h2 className="text-4xl pb-10 md:text-5xl lg:text-6xl font-medium text-white dark:text-white tracking-tight">
                  Built for <span className="text-[#900606] whitespace-nowrap">Creators</span> , by Creators
                </h2>
        
                <p className="text-neutral-200 font-medium text-base md:text-lg mb-10 leading-relaxed drop-shadow-md max-w-2xl">
                  We eliminate the guesswork with pro-grade gear, hands-on masterclasses, and dedicated support so you can focus on building your audience and crafting unforgettable content.
                </p>

                {/* 4 Cards Horizontal Row with Updated Font & Styling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          
                  {/* Card 1 */}
                  <div className="bg-black/70 border border-white/15 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-lg font-sans">
                    <div className="w-9 h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-3 text-sm">
                      💎
                    </div>
                    <div>
                      <h3 className="font-normal text-white text-sm tracking-wide mb-1">High Quality Products</h3>
                      <p className="text-neutral-400 text-xs font-normal">Curated for creators</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-black/70 border border-white/15 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-lg font-sans">
                    <div className="w-9 h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-3 text-sm">
                      🏷️
                    </div>
                    <div>
                      <h3 className="font-normal text-white text-sm tracking-wide mb-1">Best Prices in India</h3>
                      <p className="text-neutral-400 text-xs font-normal">Great value, always</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-black/70 border border-white/15 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-lg font-sans">
                    <div className="w-9 h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-3 text-sm">
                      📖
                    </div>
                    <div>
                      <h3 className="font-normal text-white text-sm tracking-wide mb-1">Expert-Led Courses</h3>
                      <p className="text-neutral-400 text-xs font-normal">Learn from experts</p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-black/70 border border-white/15 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md shadow-lg font-sans">
                    <div className="w-9 h-9 rounded-full bg-[#900606]/30 flex items-center justify-center text-[#900606] font-bold mb-3 text-sm">
                      🎧
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm tracking-wide mb-1">After-Sales Support</h3>
                      <p className="text-neutral-400 text-xs font-normal">We're here to help</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PRODUCTS CATEGORY GRID SECTION */}

        <section className="w-full pt-10 pb-3 sm:pt-8 sm:pb-8 bg-[#FBFBF7]">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            {/* <h2 className="text-3xl pb-10 md:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
              Features <span className="text-[#900606] whitespace-nowrap">Products</span>
            </h2> */}

            <h2 className="text-4xl pb-10 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
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


        <section className="w-full pt-6  bg-[#FBFBF7] overflow-hidden">
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
                  className="relative px-9 py-4 bg-white text-[#111827] border-2 rounded-full font-black text-base overflow-hidden group/btn transition-all duration-300 shadow-[0_8px_25px_rgba(144,6,6,0.3)] inline-flex items-center justify-center gap-2"
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
        <section className="w-full pt-3 pb-6 bg-[#FBFBF7] overflow-hidden">
  <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 mb-8 text-center ">
    <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
      Review of <span className="text-[#900606] whitespace-nowrap">Creators</span>
    </h2>
    <p className="text-neutral-600 mt-4 font-medium text-lg">Discover how our gear is helping creators build better content every day.</p>
  </div>
  
  <div className="w-full relative overflow-hidden flex pause-marquee">
    <div className="flex gap-6 animate-marquee shrink-0 w-max">
      {[...customerStories, ...customerStories, ...customerStories].map((item, idx) => (
        <Link 
          key={`${item.id}-${idx}`} 
          href={`/blog/${item.id}?title=${encodeURIComponent(item.name)}&product=${encodeURIComponent(item.product)}&description=${encodeURIComponent(item.description)}&image=${encodeURIComponent(item.image)}`}
          className={`group flex flex-col ${isDarkMode ? 'bg-[#131C2E]' : 'bg-white'} rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 relative border border-neutral-200 dark:border-neutral-800 w-[300px] md:w-[350px] shrink-0 cursor-pointer`}
        >
          {/* Image Container - Thoda chota height taaki compact lage */}
          <div className="relative w-full h-[280px] md:h-[310px] mb-4 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <Image src={getImageUrl(item.image)} 
            alt={item.name} 
            fill 
            sizes="(max-width: 768px) 100vw, 25vw" 
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* User Name & Description */}
          <div className="flex flex-col flex-grow font-sans mb-4 px-1">
            <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2 text-[14px] leading-snug line-clamp-2 font-sans">{item.description}</h3>
            <div className="flex items-baseline gap-2 mt-auto font-sans w-full overflow-hidden">
              <span className="font-semibold text-neutral-900 dark:text-white text-[1rem] shrink-0 whitespace-nowrap">{item.name}</span>
              <span className="text-[12px] text-neutral-500 font-medium truncate">{item.product}</span>
            </div>
          </div>

          {/* Button */}
          <div className="relative w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center mt-auto">
            <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
              Read Story
            </span>
          </div>

        </Link>
      ))}
    </div>
  </div>
</section>

         {/* BONUS: FREE RECORDED MASTERCLASS & PERKS WITH EVERY PURCHASE */}
        <section className="w-full pt-8 pb-10 bg-[#FBFBF7]">
          <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-10">
    
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      
              {/* Left Side: Header & CTA Button */}
              <div className="flex flex-col items-start text-left max-w-lg shrink-0">

                <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
                  Learn. <span className="text-[#900606]">Create.</span> Grow.
                </h2>

                <p className="text-neutral-600 font-medium text-base md:text-lg mb-8 leading-relaxed">
                  Buy any creator bundle and get premium courses worth ₹4,999 absolutely free.
                </p>

                {/* Explore Bundles Button */}
                <Link 
                  href="/product" 
                  className="relative px-9 py-4 bg-[#900606] text-white rounded-xl font-bold text-base overflow-hidden group transition-all duration-300 shadow-[0_8px_20px_rgba(144,6,6,0.4)] inline-flex items-center gap-2 hover:bg-[#a50707]"
                >
                  <span>Explore Bundles ➔</span>
                </Link>
              </div>

              {/* Right Side: 3 Masterclass & Course Cards with Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
 
                {/* Card 1: Instagram Mastery */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-center items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md mb-5 text-2xl font-black">
                    📷
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2">Instagram Mastery</h3>
                    <p className="text-neutral-600 font-medium text-sm leading-relaxed mb-6">
                      Grow your audience, create viral content and monetize your profile.
                    </p>
                  </div>
                  <div className="w-full pt-4 border-t border-neutral-100 text-xs font-bold text-[#900606]">
                    Worth ₹1,999
                  </div>
                </div>

                {/* Card 2: YouTube Mastery */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-center items-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md mb-5 text-2xl font-black">
                    ▶
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2">YouTube Mastery</h3>
                    <p className="text-neutral-600 font-medium text-sm leading-relaxed mb-6">
                      Complete guide to start, grow and earn on YouTube.
                    </p>
                  </div>
                  <div className="w-full pt-4 border-t border-neutral-100 text-xs font-bold text-[#900606]">
                    Worth ₹1,999
                  </div>
                </div>

                {/* Card 3: Filmora Video Editing */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-center items-center">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center text-teal-400 shadow-md mb-5 text-xl font-black">
                    🎬
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2">Filmora Video Editing</h3>
                    <p className="text-neutral-600 font-medium text-sm leading-relaxed mb-6">
                      Learn professional video editing with Filmora - step by step.
                    </p>
                  </div>
                  <div className="w-full pt-4 border-t border-neutral-100 text-xs font-bold text-[#900606]">
                    Worth ₹999
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>
        {/* 1. WHAT CREATORS SAY TESTIMONIALS SECTION */}
        <section className="w-full pb-5 sm:pb-8 bg-[#FBFBF7] overflow-hidden font-sans">
  
          {/* Stats Bar */}
          <div className="w-full bg-[#FBFBF7] py-8 mb-8 border-t border-b border-neutral-200/80">
            <div className="max-w-[1750px] mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="text-2xl md:text-3xl font-black text-[#900606]">50,000+</p>
                  <p className="text-xs text-neutral-600 font-bold tracking-wide">Happy Creators</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="text-2xl md:text-3xl font-black text-[#900606]">10,000+</p>
                  <p className="text-xs text-neutral-600 font-bold tracking-wide">Products Delivered</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="text-2xl md:text-3xl font-black text-[#900606]">500+</p>
                  <p className="text-xs text-neutral-600 font-bold tracking-wide">Students Trained</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="text-2xl md:text-3xl font-black text-[#900606]">4.8/5</p>
                  <p className="text-xs text-neutral-600 font-bold tracking-wide">Customer Rating</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
    
            {/* Testimonials Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-4 border-b border-neutral-200/80">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] dark:text-white tracking-tight">
                  What <span className="text-[#900606] whitespace-nowrap">Creators</span> Say
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm font-medium mt-1.5 leading-relaxed">
                  Join over 50,000+ creators who transformed their content quality with Creators Kit gear.
                </p>
              </div>
            </div>
    
            {/* Clean Testimonials Review Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          </div>
        </section>

        {/* 2. TOP BRANDS WE OFFER LOGO STRIP SECTION */}
        <section className="w-full py-4 sm:py-8 bg-[#FBFBF7] border-t border-neutral-200/80 overflow-hidden font-sans">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] dark:text-white tracking-tight mb-3">
              Top Brands <span className="text-[#900606]">We Offer</span>
            </h2>

            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm font-medium max-w-xl mx-auto mb-10 leading-relaxed">
              We partner directly with leading audio and video gear manufacturers to deliver 100% authentic equipment with official warranty.
            </p>

            {/* Logo Strip Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              
              {/* Brand 1: RØDE */}
              <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#900606]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <span className="font-black text-xl tracking-[0.18em] text-[#111827] dark:text-white group-hover:text-[#900606] transition-colors">
                  RØDE
                </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                  Microphones
                </span>
              </div>

              {/* Brand 2: DigiTek */}
              <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#900606]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <span className="font-extrabold text-xl tracking-tight text-[#111827] dark:text-white group-hover:text-[#900606] transition-colors">
                  DigiTek
                </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                  Lights & Stands
                </span>
              </div>

              {/* Brand 3: Godox */}
              <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#900606]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <span className="font-black text-xl tracking-normal text-[#111827] dark:text-white group-hover:text-[#900606] transition-colors">
                  Godox
                </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                  Studio Lighting
                </span>
              </div>

              {/* Brand 4: ZHIYUN */}
              <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#900606]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <span className="font-black text-xl tracking-widest text-[#111827] dark:text-white group-hover:text-[#900606] transition-colors">
                  ZHIYUN
                </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                  Gimbals & Rigs
                </span>
              </div>

              {/* Brand 5: BOYA */}
              <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#900606]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <span className="font-black text-xl tracking-[0.15em] text-[#111827] dark:text-white group-hover:text-[#900606] transition-colors">
                  BOYA
                </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                  Wireless Audio
                </span>
              </div>

              {/* Brand 6: SanDisk */}
              <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#900606]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <span className="font-extrabold text-xl tracking-tighter text-[#111827] dark:text-white group-hover:text-[#900606] transition-colors">
                  SanDisk
                </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                  Storage & Cards
                </span>
              </div>

              {/* Brand 7: ULANZI */}
              <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#900606]/40 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <span className="font-black text-xl tracking-widest text-[#111827] dark:text-white group-hover:text-[#900606] transition-colors">
                  ULANZI
                </span>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-1">
                  Creator Mounts
                </span>
              </div>

            </div>

            {/* Verification Note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Authorized Products with Direct Manufacturer Warranty</span>
            </div>

          </div>
        </section>

        {/* 3. READY TO START YOUR CREATOR JOURNEY BANNER */}
        <section className="relative w-full py-5 sm:py-8 lg:py-10 bg-[#900606] text-white overflow-hidden">
          {/* Subtle Ambient Radial Glow Overlays */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-400/20 blur-[130px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-black/25 blur-[110px] rounded-full pointer-events-none"></div>

          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.12] mb-5 max-w-3xl">
              Ready to Start Your Creator Journey?
            </h2>

            <p className="text-red-100/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mb-9">
              Equip your studio with industry-standard hardware, unlock expert masterclasses worth ₹4,999 for free, and join 50,000+ creators turning their passion into a profession.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/product"
                className="px-9 py-4 bg-white text-[#900606] hover:bg-neutral-100 rounded-full font-black text-sm sm:text-base shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-full font-bold text-sm sm:text-base transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>Learn More</span>
              </Link>
            </div>

            {/* Trust Highlights Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t border-white/15 w-full max-w-4xl text-xs sm:text-sm font-semibold text-red-100">
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-4 h-4 text-white shrink-0" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4 text-white shrink-0" />
                <span>7-Day Replacement</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>1-Year Official Warranty</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-white shrink-0" />
                <span>Free Bonus Courses</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. JOIN OUR CREATOR COMMUNITY (NEWSLETTER) SECTION */}
        <section className="w-full py-5 sm:py-8 bg-[#FBFBF7] text-neutral-900 font-sans relative overflow-hidden">
          {/* Subtle signature radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#900606]/8 blur-[120px] rounded-full pointer-events-none -z-0"></div>

          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 text-center">
            <div className="max-w-2xl mx-auto flex flex-col items-center">

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#111827] dark:text-white tracking-tight mb-3">
                Join Our <span className="text-[#900606]">Creator Community</span>
              </h2>

              <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed mb-8 max-w-lg">
                Subscribe to get VIP access to equipment bundle drops, creator masterclass discounts, and studio setup guides delivered directly to your inbox.
              </p>

              {/* Subscription Form */}
              <form onSubmit={handleNewsletterSubmit} className="w-full max-w-lg">
                {newsletterSubscribed ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>🎉 Thank you! You're now on our VIP creator list.</span>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#131C2E] p-2 rounded-full border border-neutral-200/90 dark:border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-2 transition-all">
                    <div className="flex items-center gap-2 px-4 w-full">
                      <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full py-2.5 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3.5 bg-[#900606] hover:bg-[#7a0505] text-white rounded-full font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(144,6,6,0.25)] hover:shadow-[0_6px_20px_rgba(144,6,6,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </div>
                )}
              </form>

              <p className="text-[11px] text-neutral-400 font-medium mt-3 flex items-center justify-center gap-1.5">
                <span>🔒</span> We respect your privacy. No spam, ever. Unsubscribe at any time.
              </p>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}