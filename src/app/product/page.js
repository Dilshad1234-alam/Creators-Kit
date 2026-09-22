'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductPage() {
  const router = useRouter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState([]);
  const [whatsInsideItems, setWhatsInsideItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentMap, setContentMap] = useState({});

  const [currentImage, setCurrentImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        if (data.success) {
          const map = {};
          data.data.forEach(item => {
            map[item.key] = item.value;
          });
          setContentMap(map);
        }
      } catch (e) {
        console.error('Error fetching content:', e);
      }
    }
    fetchContent();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, whatsInsideRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/whats-inside')
        ]);
        const prodData = await prodRes.json();
        const whatsInsideData = await whatsInsideRes.json();
        
        if (prodData.success && prodData.data.length > 0) {
          setProducts(prodData.data);
        }
        if (whatsInsideData.success && whatsInsideData.data) {
          setWhatsInsideItems(whatsInsideData.data);
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Separate products by category
  const bundleProducts = products.filter(p => !p.category || p.category === 'bundle' || p.category === 'both');
  const individualProducts = products.filter(p => !p.category || p.category === 'individual' || p.category === 'both');

  // Use the first bundle product for the Hero Section
  const mainBundle = bundleProducts[0] || {};
  
  let dynamicImages = [
    { src: '/kits 25 (1).jpg', bg: 'bg-white dark:bg-neutral-900/50', title: 'Loading...', description: 'Loading...' }
  ];

  if (mainBundle.images && mainBundle.images.length > 0) {
    dynamicImages = mainBundle.images.map(img => ({
      src: img.src || '/placeholder.png',
      bg: 'bg-white dark:bg-neutral-900/50',
      title: mainBundle.name || 'CREATOR BUNDLE',
      description: mainBundle.description
    }));
  } else if (mainBundle.image) {
    dynamicImages = [{
      src: mainBundle.image,
      bg: 'bg-white dark:bg-neutral-900/50',
      title: mainBundle.name || 'CREATOR BUNDLE',
      description: mainBundle.description
    }];
  }

  const product = {
    id: mainBundle._id || 'creators-kit-v1',
    name: mainBundle.name || contentMap['product_hero_heading'] || 'CREATOR BUNDLE',
    subheading: mainBundle.subheading || 'CREATOR BUNDLE - COMPLETE SETUP',
    price: mainBundle.price || 3999,
    originalPrice: mainBundle.originalPrice || 4999,
    description: mainBundle.description || contentMap['product_hero_desc'] || 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.',
    images: dynamicImages,
  };

  const discountPercent = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Note: includedItems and partDetails have been removed to use dynamic mapping over products

  const faqs = [
    { question: 'Do I need to buy these parts separately?', answer: 'No! The Creators Kit is a single, complete bundle. You get all the hardware, courses, and physical resources in one box for one price.' },
    { question: 'Does the microphone work with my smartphone?', answer: 'Yes, our wireless microphone includes adapters for both USB-C and Lightning ports, making it plug-and-play compatible.' },
    { question: 'How do I access the Mastery Courses?', answer: 'The courses are pre-loaded onto a high-speed USB Pendrive included in the box. Simply plug it into your computer to watch them entirely offline, forever.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee. If you are not completely satisfied, you can return the complete kit within 30 days for a full refund.' },
  ];

  const handleAddToCart = () => {
    if (!sessionStorage.getItem('userName')) {
      router.push('/login?redirect=/product');
      return;
    }
    addToCart({ ...product, quantity: 1 });
  };

  const handleBuyNow = () => {
    if (!sessionStorage.getItem('userName')) {
      router.push('/login?redirect=/product');
      return;
    }
    addToCart({ ...product, quantity: 1 });
    router.push('/checkout');
  };

  const handleAddIndividualToCart = (item) => {
    if (!sessionStorage.getItem('userName')) {
      router.push('/login?redirect=/product');
      return;
    }
    addToCart({ id: item._id || item.id, name: item.name, price: item.price, quantity: 1, img: item.image });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background text-neutral-900 dark:text-neutral-100 font-sans w-full">
      <main className="flex-grow w-full">
        
        {/* Sticky Action Bar for Mobile (Hidden on Desktop) */}
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-background border-t border-neutral-200 dark:border-neutral-800 p-4 z-50 md:hidden flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
           <div className="flex-1">
             <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-wider">Total Price</p>
             <p className="text-xl font-black text-neutral-900 dark:text-neutral-100">₹{product.price.toLocaleString()}</p>
           </div>
           <button onClick={handleBuyNow} className="flex-1 bg-primary text-neutral-950 rounded-full font-bold shadow-lg hover:bg-primary-hover transition-colors">
             Buy Now
           </button>
        </div>

        {/* 1. Main Product Overview Section */}
        <section className="w-full bg-white dark:bg-background py-4 min-h-[calc(100vh-5rem)] flex items-center justify-center border-b border-neutral-200 dark:border-neutral-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-#FF6B4A/10 via-transparent to-transparent opacity-70 pointer-events-none"></div>

          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 relative z-10">
            
            {/* Left: Product Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main Image Viewport */}
              <div className={`w-full h-[350px] md:h-[500px] lg:h-[600px] rounded-[3rem] flex items-center justify-center shadow-2xl shadow-neutral-950/50 border border-neutral-200 dark:border-neutral-800 transition-all duration-700 ease-in-out relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-700/40 via-neutral-900/80 to-background p-4 md:p-6 hover:border-primary active:border-primary transform hover:scale-[1.02] active:scale-[1.02] will-change-transform hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] active:shadow-[0_0_40px_rgba(245,158,11,0.2)] ${product.images[currentImage].bg}`}>
                <Image
                  src={product.images[currentImage].src}
                  alt="Product Image"
                  fill
                  className="object-contain p-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] transform transition-all duration-500 ease-in-out hover:scale-110 active:scale-110 will-change-transform cursor-zoom-in"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`relative snap-center shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 transition-all overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-700/40 via-neutral-900/80 to-background ${
                      currentImage === idx 
                        ? 'border-primary ring-4 ring-primary/20 scale-105 shadow-lg' 
                        : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100 hover:scale-105 hover:border-primary active:opacity-100 active:scale-105 active:border-primary'
                    }`}
                  >
                    <Image src={img.src} alt="Thumbnail" fill className="object-contain p-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info & Pricing */}
            <div className="flex flex-col justify-center">
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-2 text-neutral-700 dark:text-neutral-300 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                {product.images[currentImage].title}
              </h1>
              <h2 className="text-sm md:text-md lg:text-lg text-neutral-500 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4">
                {product.subheading}
              </h2>
              
              <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 mb-4 md:mb-6 leading-relaxed font-medium">
                {product.images[currentImage].description}
              </p>

              {/* Pricing & Offer Area */}
              <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 mb-6 shadow-sm relative overflow-hidden">
                {discountPercent > 0 && (
                  <div className="absolute top-0 right-0 bg-primary text-neutral-950 text-xs font-bold px-4 py-1 rounded-bl-xl tracking-wider">
                    SAVE {discountPercent}%
                  </div>
                )}
                <div className="flex items-end gap-3 md:gap-4 mb-2">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 dark:text-neutral-100">₹{product.price.toLocaleString()}</span>
                  <span className="text-xl md:text-2xl font-bold text-neutral-600 line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-green-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5l-2.5-4H14V5a1 1 0 00-1-1H3zM14 7h2.1l1.875 3H14V7z" /></svg>
                  Free Standard Shipping Nationwide
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button
                  onClick={handleAddToCart}
                  className="hidden md:flex flex-1 py-5 px-8 bg-white dark:bg-neutral-900 border border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-full font-bold text-lg hover:border-primary hover:text-primary hover:bg-white dark:bg-background transition-colors items-center justify-center gap-3 shadow-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="hidden md:flex flex-1 py-5 px-8 bg-primary text-neutral-950 rounded-full font-extrabold text-xl hover:bg-primary-hover transition-all hover:scale-105 shadow-xl shadow-#FF6B4A/30 items-center justify-center gap-2"
                >
                  Buy Now
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>

              {/* Secure Checkout Badges */}
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-neutral-500">
                <div className="flex items-center gap-2">
                   <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   Secure Encrypted Checkout
                </div>
                <div className="flex items-center gap-2">
                   <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   30-Day Guarantee
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1.5. Individual Gear Purchase Section */}
        <section className="w-full py-10 md:py-16 bg-white dark:bg-background relative z-10 border-t border-neutral-200 dark:border-neutral-900">
          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto text-center mb-10">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">Need Just One Piece?</h2>
             <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium">Build your own setup by purchasing our premium gear individually.</p>
          </div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {individualProducts.map((item) => (
              <div key={item._id || item.id} className="premium-glow-card p-4 md:p-6 rounded-3xl group flex flex-col items-center text-center">
                <div className="relative w-full aspect-square mb-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-700/40 via-neutral-900/80 to-background rounded-2xl p-4 overflow-hidden group-hover:border-primary/30 border border-neutral-200 dark:border-neutral-800 transition-colors">
                  <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-contain p-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-110 group-active:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2 leading-tight flex-grow text-sm md:text-base">{item.name}</h3>
                <div className="text-primary font-extrabold text-lg md:text-xl mb-4">₹{item.price}</div>
                <button
                  onClick={() => handleAddIndividualToCart(item)}
                  className="w-full py-2 md:py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl font-bold hover:bg-primary transition-colors text-xs md:text-sm shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. What's Included & Features */}
        <section className="w-full py-12 md:py-24 bg-white dark:bg-background border-t border-neutral-200 dark:border-neutral-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto relative z-10 flex flex-col items-center">
            
            {/* Top/Header Area */}
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight text-neutral-900 dark:text-neutral-100">The Complete Bundle</h2>
              <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 font-medium">Everything you need to shoot, record, and light your content perfectly. Sold exclusively as one complete package.</p>
            </div>
            
            {/* What's Included - Top Overview Banner */}
            <div className="w-full premium-glow-card rounded-[2.5rem] p-6 md:p-8 mb-8 md:mb-16 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
              <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-8 relative z-10">
                {whatsInsideItems.map((item, idx) => (
                  <li key={item._id || item.id || idx} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-background/50 border border-neutral-200 dark:border-neutral-800/50 shadow-inner">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-xs text-green-400 border border-green-500/20">
                      ✓
                    </div>
                    <span className="font-bold text-sm md:text-base text-neutral-800 dark:text-neutral-200">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deep Dive into All Items (3-column grid) */}
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {whatsInsideItems.map((part, idx) => (
                  <div key={part._id || part.id || idx} className="premium-glow-card p-6 md:p-8 rounded-3xl md:rounded-[2rem] flex flex-col">
                    <div className="relative w-full aspect-[4/3] mb-6 rounded-2xl overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/30 via-neutral-900/60 to-background border border-neutral-200 dark:border-neutral-800/50 p-4 shadow-inner">
                      <Image src={part.image || '/placeholder.png'} alt={part.name} fill className="object-contain p-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 group-active:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors">{part.name}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed text-sm flex-grow">{part.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>



        {/* 4. Details Tabs (Shipping/Policies) & FAQ */}
        <section className="w-full py-12 md:py-24 bg-white dark:bg-background border-t border-neutral-200 dark:border-neutral-900">
          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-24">
            
            {/* Policies */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 tracking-tight text-neutral-900 dark:text-neutral-100">Policies & Guarantees</h2>
              
              <div className="space-y-6 md:space-y-8">
                <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5l-2.5-4H14V5a1 1 0 00-1-1H3zM14 7h2.1l1.875 3H14V7z" /></svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100">Fast & Free Shipping</h3>
                  </div>
                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">We process all orders within 24 hours. Standard delivery takes 3-5 business days nationwide absolutely free.</p>
                </div>
                
                <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100">30-Day Guarantee</h3>
                  </div>
                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">If you're not completely satisfied with the kit, simply return it within 30 days for a full, no-questions-asked refund.</p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 tracking-tight text-neutral-900 dark:text-neutral-100">Product FAQ</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className={`border ${openFaqIndex === index ? 'border-primary' : 'border-neutral-200 dark:border-neutral-800'} rounded-[1.5rem] overflow-hidden bg-white dark:bg-neutral-900 shadow-sm transition-colors duration-300`}>
                    <button
                      className="w-full px-6 py-4 md:px-8 md:py-6 text-left flex justify-between items-center hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                    >
                      <span className="font-bold text-base md:text-lg text-neutral-900 dark:text-neutral-100 pr-4">{faq.question}</span>
                      <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${openFaqIndex === index ? 'bg-primary/20 text-primary' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                        <svg className={`w-4 h-4 md:w-5 md:h-5 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    <div className={`px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 pb-4 md:pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
