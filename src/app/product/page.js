'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('included');
  const [currentImage, setCurrentImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const product = {
    id: 'creators-kit-v1',
    name: 'CREATOR BUNDLE',
    price: 3999,
    originalPrice: 8999,
    description: 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.',
    images: [
      { type: 'light', src: '/kits 1 - Edited.png', bg: 'bg-zinc-900/50' },
      { type: 'stand', src: '/kits 2 - Edited.png', bg: 'bg-zinc-900/50' },
      { type: 'mic', src: '/kits 3.jpg - Edited.png', bg: 'bg-zinc-900/50' },
      { type: 'tripod', src: '/kits 4.jpg - Edited.png', bg: 'bg-zinc-900/50' },
      { type: 'screen', src: '/kits 5.jpg - Edited.png', bg: 'bg-zinc-900/50' },
      { type: 'pendrive', src: '/kits 6.jpg - Edited.png', bg: 'bg-zinc-900/50' },
      { type: 'workbook', src: '/kits 7.jpg - Edited.png', bg: 'bg-zinc-900/50' },
    ],
  };

  const includedItems = [
    { name: '10-inch Professional LED Ring Light', icon: '💡' },
    { name: 'Adjustable Aluminum Ring Light Stand', icon: '🗼' },
    { name: 'Wireless Noise-Canceling Microphone', icon: '🎙️' },
    { name: 'Flexible Tripod for Camera/Phone', icon: '📸' },
    { name: 'Chroma Key Green Curtain with Clamps', icon: '🟩' },
    { name: 'Instagram, YouTube, and Filmora Mastery Courses', icon: '🎓' },
    { name: 'Physical USB Pendrive (Courses Offline)', icon: '💾' },
    { name: 'Printed Masterclass Workbooks & Shot Lists', icon: '📑' },
  ];

  const partDetails = [
    { title: 'Perfect Lighting', desc: '10-inch ring light with 3 color modes and 10 brightness levels.', img: '/kits 1 - Edited.png' },
    { title: 'Stable Shots', desc: 'Durable floor stand and flexible desk tripod included.', img: '/kits 2 - Edited.png' },
    { title: 'Clear Audio', desc: 'Wireless plug-and-play mic with active noise cancellation.', img: '/kits 3.jpg - Edited.png' },
    { title: 'Clean Backgrounds', desc: 'Wrinkle-resistant green screen for easy chroma keying.', img: '/kits 5.jpg - Edited.png' },
  ];

  const faqs = [
    { question: 'Do I need to buy these parts separately?', answer: 'No! The Creators Kit is a single, complete bundle. You get all the hardware, courses, and physical resources in one box for one price.' },
    { question: 'Does the microphone work with my smartphone?', answer: 'Yes, our wireless microphone includes adapters for both USB-C and Lightning ports, making it plug-and-play compatible.' },
    { question: 'How do I access the Mastery Courses?', answer: 'The courses are pre-loaded onto a high-speed USB Pendrive included in the box. Simply plug it into your computer to watch them entirely offline, forever.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee. If you are not completely satisfied, you can return the complete kit within 30 days for a full refund.' },
  ];

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity: 1 });
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-zinc-100 font-sans w-full">
      <main className="flex-grow w-full">
        
        {/* Sticky Action Bar for Mobile (Hidden on Desktop) */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0d0d0d] border-t border-zinc-800 p-4 z-50 md:hidden flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
           <div className="flex-1">
             <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Price</p>
             <p className="text-xl font-black text-zinc-100">₹{product.price.toLocaleString()}</p>
           </div>
           <button onClick={handleBuyNow} className="flex-1 bg-[#FF3B14] text-white rounded-full font-bold shadow-lg hover:bg-[#E01900] transition-colors">
             Buy Now
           </button>
        </div>

        {/* 1. Main Product Overview Section */}
        <section className="w-full bg-[#0d0d0d] pt-12 pb-24 border-b border-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-#FF6B4A/10 via-transparent to-transparent opacity-70 pointer-events-none"></div>

          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
            
            {/* Left: Product Gallery */}
            <div className="space-y-6">
              {/* Main Image Viewport */}
              <div className={`w-full aspect-square rounded-[3rem] flex items-center justify-center shadow-2xl shadow-zinc-950/50 border border-zinc-800 transition-all duration-700 relative overflow-hidden bg-zinc-900/90 p-6 hover:border-[#FF3B14] transform hover:scale-[1.02] ${product.images[currentImage].bg}`}>
                <Image
                  src={product.images[currentImage].src}
                  alt="Product Image"
                  fill
                  className="object-contain p-6 transform transition-transform hover:scale-110 duration-500 cursor-zoom-in"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`relative snap-center shrink-0 w-24 h-24 rounded-2xl flex items-center justify-center border-2 transition-all overflow-hidden bg-zinc-900/90 ${
                      currentImage === idx 
                        ? 'border-[#FF3B14] ring-4 ring-[#FF3B14]/20 scale-105 shadow-lg' 
                        : 'border-zinc-800 opacity-60 hover:opacity-100 hover:scale-105 hover:border-[#FF3B14]'
                    }`}
                  >
                    <Image src={img.src} alt="Thumbnail" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info & Pricing */}
            <div className="flex flex-col justify-center">
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-2 text-zinc-300 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                CREATOR BUNDLE
              </h1>
              <h2 className="text-lg md:text-xl text-zinc-500 tracking-[0.3em] uppercase mb-6">
                COMPLETE SETUP
              </h2>
              
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed font-medium">
                {product.description}
              </p>

              {/* Pricing & Offer Area */}
              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 mb-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#FF3B14] text-white text-xs font-bold px-4 py-1 rounded-bl-xl tracking-wider">SAVE 55%</div>
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-5xl md:text-6xl font-black text-zinc-100">₹{product.price.toLocaleString()}</span>
                  <span className="text-2xl font-bold text-zinc-600 line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
                </div>
                <p className="text-sm font-bold text-green-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5l-2.5-4H14V5a1 1 0 00-1-1H3zM14 7h2.1l1.875 3H14V7z" /></svg>
                  Free Standard Shipping Nationwide
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleAddToCart}
                  className="hidden md:flex flex-1 py-5 px-8 bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-full font-bold text-lg hover:border-[#FF3B14] hover:text-[#FF3B14] hover:bg-[#0d0d0d] transition-colors items-center justify-center gap-3 shadow-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="hidden md:flex flex-1 py-5 px-8 bg-[#FF3B14] text-white rounded-full font-extrabold text-xl hover:bg-[#E01900] transition-all hover:scale-105 shadow-xl shadow-#FF6B4A/30 items-center justify-center gap-2"
                >
                  Buy Now
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>

              {/* Secure Checkout Badges */}
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-zinc-500">
                <div className="flex items-center gap-2">
                   <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   Secure Encrypted Checkout
                </div>
                <div className="flex items-center gap-2">
                   <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   30-Day Guarantee
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. What's Included & Features */}
        <section className="w-full py-24 bg-[#0d0d0d] border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* The Bundle List */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-zinc-100">The Complete Bundle</h2>
              <p className="text-xl text-zinc-400 mb-10 font-medium">Sold exclusively as one complete package. We don't nickel-and-dime you for individual parts.</p>
              
              <div className="bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-zinc-800 shadow-2xl">
                <ul className="space-y-4">
                  {includedItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#0d0d0d] rounded-xl flex items-center justify-center text-xl border border-zinc-800">
                        {item.icon}
                      </div>
                      <span className="font-bold text-lg text-zinc-200">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hardware Deep Dive */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-zinc-100">Pro Hardware Included</h2>
              <p className="text-xl text-zinc-400 mb-10 font-medium">Everything you need to shoot, record, and light your content perfectly.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {partDetails.map((part, idx) => (
                  <div key={idx} className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-zinc-800 hover:border-[#FF3B14]/50 transition-colors group overflow-hidden">
                    <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden bg-zinc-900/90 border border-zinc-800 p-4 shadow-2xl hover:border-[#FF3B14] transition duration-300 transform hover:scale-[1.02]">
                      <Image src={part.img} alt={part.title} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-zinc-100">{part.title}</h3>
                    <p className="text-zinc-400 font-medium leading-relaxed">{part.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Education & Resources */}
        <section className="w-full py-24 bg-zinc-900">
          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-zinc-100">The Secret Sauce: Education</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-16 font-medium">
              We don't just send you gear and wish you luck. The Creators Kit includes complete mastery courses and physical resources to guarantee your success.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-[#0d0d0d] p-10 rounded-[3rem] border border-zinc-800 shadow-xl flex flex-col items-center group hover:-translate-y-2 transition-transform">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📱</div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-100">Instagram Mastery</h3>
                <p className="text-zinc-400 font-medium">Algorithm secrets, viral reel formulas, and audience building strategies.</p>
              </div>
              <div className="bg-[#0d0d0d] p-10 rounded-[3rem] border border-zinc-800 shadow-xl flex flex-col items-center group hover:-translate-y-2 transition-transform">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">▶️</div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-100">YouTube Mastery</h3>
                <p className="text-zinc-400 font-medium">SEO optimization, thumbnail psychology, and monetization blueprints.</p>
              </div>
              <div className="bg-[#0d0d0d] p-10 rounded-[3rem] border border-zinc-800 shadow-xl flex flex-col items-center group hover:-translate-y-2 transition-transform">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎬</div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-100">Filmora Mastery</h3>
                <p className="text-zinc-400 font-medium">Zero-to-hero video editing course. Learn cuts, transitions, and color grading.</p>
              </div>
            </div>

            <div className="bg-[#0d0d0d] rounded-[3rem] p-10 md:p-16 border border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left relative overflow-hidden shadow-2xl">
               <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FF3B14]/20 rounded-full blur-[100px] -translate-y-1/2"></div>
               <div className="relative z-10">
                 <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-zinc-100">Pre-loaded on a physical Pendrive.</h3>
                 <p className="text-xl text-zinc-400 font-medium mb-8">Access all courses offline instantly. Plus, receive high-quality printed project workbooks in the box for tactile, hands-on learning.</p>
                 <ul className="space-y-4 font-bold">
                   <li className="flex items-center gap-3"><span className="text-[#FF3B14] text-2xl">💾</span> <span className="text-zinc-300">High-Speed USB Drive</span></li>
                   <li className="flex items-center gap-3"><span className="text-[#FF3B14] text-2xl">📑</span> <span className="text-zinc-300">Printed Project Guides</span></li>
                 </ul>
               </div>
               <div className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-[#FF3B14] transition duration-300 transform hover:scale-[1.02]">
                 <Image src="/kit 5.webp" alt="The Creators Kit Box and Pendrive" fill className="object-contain p-4" />
               </div>
            </div>
          </div>
        </section>

        {/* 4. Details Tabs (Shipping/Policies) & FAQ */}
        <section className="w-full py-24 bg-[#0d0d0d] border-t border-zinc-900">
          <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Policies */}
            <div>
              <h2 className="text-4xl font-extrabold mb-8 tracking-tight text-zinc-100">Policies & Guarantees</h2>
              
              <div className="space-y-8">
                <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5l-2.5-4H14V5a1 1 0 00-1-1H3zM14 7h2.1l1.875 3H14V7z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100">Fast & Free Shipping</h3>
                  </div>
                  <p className="text-zinc-400 font-medium leading-relaxed">We process all orders within 24 hours. Standard delivery takes 3-5 business days nationwide absolutely free.</p>
                </div>
                
                <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100">30-Day Guarantee</h3>
                  </div>
                  <p className="text-zinc-400 font-medium leading-relaxed">If you're not completely satisfied with the kit, simply return it within 30 days for a full, no-questions-asked refund.</p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <h2 className="text-4xl font-extrabold mb-8 tracking-tight text-zinc-100">Product FAQ</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className={`border ${openFaqIndex === index ? 'border-[#FF3B14]' : 'border-zinc-800'} rounded-[1.5rem] overflow-hidden bg-zinc-900 shadow-sm transition-colors duration-300`}>
                    <button
                      className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-zinc-800/50 transition-colors"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                    >
                      <span className="font-bold text-lg text-zinc-100 pr-4">{faq.question}</span>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${openFaqIndex === index ? 'bg-[#FF3B14]/20 text-[#FF3B14]' : 'bg-zinc-800 text-zinc-400'}`}>
                        <svg className={`w-5 h-5 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    <div className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-zinc-400 font-medium leading-relaxed">{faq.answer}</p>
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
