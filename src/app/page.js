'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const kitComponents = [
    {
      id: 'ring-light',
      name: ' Ring Light',
      description: 'Professional LED ring light with adjustable color temperatures.',
      features: ['3 Color Modes', '10 Brightness Levels', 'USB Powered'],
      useCase: 'Perfect for well-lit vlogs, beauty tutorials, and streaming.',
      benefit: 'Instantly elevates your video quality with flattering, even lighting.',
      icon: '💡',
      image: '/kits 7.jpg - Edited.png',
    },
    {
      id: 'mic',
      name: 'Wireless Microphone',
      description: 'Crisp, clear audio capture without the hassle of cables.',
      features: ['Noise Reduction', 'Plug-and-Play', '65ft Range'],
      useCase: 'Ideal for interviews, podcasts, and on-the-go vlogging.',
      benefit: 'Ensures your audience hears every word clearly, without background static.',
      icon: '🎙️',
      image: '/kits 2 - Edited.png',
    },
    {
      id: 'tripod',
      name: 'Camera/Phone Tripod',
      description: 'Versatile mounting solution for your smartphone or DSLR.',
      features: ['360° Rotation', 'Bluetooth Remote', 'Universal Mount'],
      useCase: 'Achieve stable shots and smooth panning for professional videos.',
      benefit: 'No more shaky footage; get the perfect angle every time.',
      icon: '📸',
      image: '/kits 11.jpg - Edited.png',
    },
    {
      id: 'green-screen',
      name: 'Chroma Key Curtain',
      description: 'High-quality green screen backdrop for seamless background replacement.',
      features: ['Wrinkle-resistant', 'Washable', 'Includes Clamps'],
      useCase: 'Easily drop in custom backgrounds for gaming, streaming, or effects.',
      benefit: 'Transform your messy bedroom into a professional studio instantly.',
      icon: '🟩',
      image: '/kits 5.jpg - Edited.png',
    },
    {
      id: 'pen-drive',
      name: 'Mastery Pen Drive',
      description: 'Physical USB pendrive packed with all our exclusive Mastery Courses and digital resources.',
      features: ['Plug-and-Play', 'High-Speed USB', 'Pre-loaded Courses'],
      useCase: 'Access premium educational content offline, anywhere you go.',
      benefit: 'No internet required to learn the exact secrets of going viral.',
      icon: '💾',
      image: '/kits 4.jpg - Edited.png',
    },
  ];

  const benefits = [
    { title: 'Perfect Lighting', desc: 'Flattering illumination in any environment.', icon: '✨' },
    { title: 'Crystal Clear Audio', desc: 'Wireless noise-canceling technology.', icon: '🔊' },
    { title: 'Stable Shooting', desc: 'Secure, adjustable mounting solutions.', icon: '🎯' },
    { title: 'Infinite Backgrounds', desc: 'Professional chroma key compositing.', icon: '🖼️' },
    { title: 'Beginner Friendly', desc: 'Zero technical experience required.', icon: '👶' },
    { title: 'Included Education', desc: 'Step-by-step mastery courses.', icon: '📚' },
  ];

  const masteryCourses = [
    {
      title: 'Instagram Mastery',
      description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
      icon: '📱',
      color: 'border-zinc-800/60',
      iconBg: 'bg-gradient-to-br from-pink-400 to-fuchsia-500 shadow-pink-500/30',
    },
    {
      title: 'YouTube Mastery',
      description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
      icon: '▶️',
      color: 'border-zinc-800/60',
      iconBg: 'bg-gradient-to-br from-[#FF6B4A] to-orange-500 shadow-[#FF6B4A]/30',
    },
    {
      title: 'Filmora Mastery',
      description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
      icon: '🎬',
      color: 'border-zinc-800/60',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30',
    },
  ];

  const workflowSteps = [
    { title: 'Setup', description: 'Unbox your gear and build your studio in just 10 minutes.' },
    { title: 'Record', description: 'Hit record with confidence using pro lighting and audio.' },
    { title: 'Edit', description: 'Use the Filmora course to edit without the steep learning curve.' },
    { title: 'Publish', description: 'Deploy our proven strategies to maximize your reach.' },
  ];

  const faqs = [
    { question: 'What exactly is included in the Creators Kit bundle?', answer: 'The bundle includes a 10-inch LED Ring Light, an adjustable aluminum stand, a wireless noise-canceling microphone, a flexible smartphone/camera tripod, a chroma key green curtain with clamps, a physical USB pendrive containing all our Mastery Courses, and printed masterclass workbooks.' },
    { question: 'Are the Mastery Courses really free?', answer: 'Yes! The Instagram, YouTube, and Filmora Mastery courses are 100% included with your purchase of the Creators Kit. You get lifetime access via the provided USB pendrive.' },
    { question: 'What is the Pendrive and Printed Projects material?', answer: 'We include a physical high-speed USB drive pre-loaded with all the course videos so you can learn completely offline. You also get high-quality printed workbooks and cheat sheets for hands-on, tactile learning.' },
    { question: 'How much is shipping?', answer: 'Standard shipping is absolutely free nationwide. Orders are processed within 24 hours.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee. If you are not completely satisfied with your Creators Kit, you can return it within 30 days for a full refund.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white font-sans overflow-x-hidden w-full">
      <main className="flex-grow w-full">
        {/* 1. Hero Section (7.1) */}
        <section className="relative w-full pt-8 md:pt-12 pb-4 overflow-hidden bg-[#0d0d0d]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-12 px-6 lg:px-12 relative z-10">
            
            {/* Left Column (Text & CTAs) - Pushed to Left Corner */}
            <div className="lg:col-span-7 flex flex-col items-start text-left transition-all">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] text-sm font-bold mb-8 border border-[#FF6B4A]/20 shadow-sm animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-[#FF3B14] animate-pulse"></span>
                🔥 All-in-One Creator Bundle
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 leading-[1.1] w-full text-zinc-100 drop-shadow-sm">
                Start creating with <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B14] via-[#FF6B4A] to-orange-500">
                  one complete kit.
                </span>
              </h1>
              
              <p className="w-full max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-medium">
                Stop guessing what gear you need. We provide the professional equipment, expert courses, and tactile resources so you can focus on what matters: making great content.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-start gap-5 w-full">
                <Link
                  href="/product"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF3B14] to-[#FF512F] text-white rounded-full font-extrabold text-lg hover:shadow-[0_0_40px_rgba(252,29,0,0.5)] transition-all hover:-translate-y-1 text-center"
                >
                  Get Your Creator Kit
                </Link>
                <a
                  href="#whats-inside"
                  className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-zinc-300 border-2 border-zinc-800 rounded-full font-bold text-lg hover:border-[#FF3B14] hover:text-[#FF3B14] transition-colors shadow-sm text-center"
                >
                  Explore What's Inside
                </a>
              </div>
            </div>

            {/* Right Column (Visual) - Pushed to Right Corner */}
            <div className="lg:col-span-5 relative w-full mt-12 lg:mt-0 flex justify-end items-center pr-0 lg:pr-12">
              <div className="relative w-full max-w-[800px] h-[500px] lg:h-[600px] flex justify-center items-center">
                
                {/* Clean, Static Default Image */}
                <Image 
                  src="/kits 1 - Edited.png" 
                  alt="Creators Kit Bundle" 
                  fill
                  className="object-contain relative z-10 animate-fade-in drop-shadow-[0_20px_50px_rgba(252,29,0,0.15)]" 
                  style={{ filter: 'brightness(1) contrast(1.1)' }}
                  priority
                />
              </div>
            </div>

          </div>
          
          {/* Main Background Blur */}
          <div className="absolute top-1/4 right-0 w-1/2 h-[800px] bg-gradient-to-l from-[#FF3B14]/10 to-transparent rounded-full blur-[150px] -z-10 pointer-events-none"></div>
        </section>        

        {/* 2. What's Inside (7.2) */}
        <section id="whats-inside" className="w-full pt-12 pb-16 bg-[#0d0d0d] border-t border-zinc-900/50">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-md">Unbox your potential</h2>
              <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto font-medium leading-relaxed">
                Every tool in the Creators Kit was hand-selected to give you a professional studio setup right out of the box.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 w-full">
              {kitComponents.map((item) => (
                <a href={`#${item.id}`} key={item.id} className="relative bg-[#0d0d0d]/50 hover:bg-zinc-900/80 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-zinc-800/60 hover:border-zinc-700/80 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 text-center group cursor-pointer flex flex-col items-center justify-between w-full h-full overflow-hidden">
                  
                  {/* Subtle Red Hover Glow */}
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#FF3B14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-2 md:p-4 filter drop-shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-700 ease-out z-10" 
                    />
                  </div>
                  
                  <h3 className="font-bold text-lg md:text-xl text-zinc-300 group-hover:text-white transition-colors duration-300 leading-tight z-10">
                    {item.name}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Component Details (7.3) - Edge to Edge Grid Cards */}
        <section className="w-full pt-8 pb-12 bg-[#0d0d0d] relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black opacity-50 pointer-events-none"></div>
          <div className="w-full px-4 space-y-8 relative z-10">
            
            {kitComponents.map((item, idx) => (
              <div id={item.id} key={item.id} className={`flex flex-col lg:flex-row items-center gap-0 bg-[#0d0d0d] rounded-[3rem] border border-zinc-900 overflow-hidden shadow-2xl group hover:border-zinc-800 transition-colors duration-500 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/3] bg-[#0d0d0d] flex items-center justify-center text-9xl relative overflow-hidden p-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-zinc-950 z-0"></div>
                  {/* Glowing backdrop for image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#FF3B14]/5 rounded-full blur-[80px] group-hover:bg-[#FF3B14]/20 transition-colors duration-700"></div>
                  
                  <div className="z-10 w-full h-full relative transform group-hover:scale-110 transition-transform duration-700 ease-out">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center space-y-10">
                  <div>
                    <h3 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-white group-hover:text-[#FF3B14] transition-colors duration-500">{item.name}</h3>
                    <p className="text-2xl text-zinc-400 leading-relaxed font-medium">{item.description}</p>
                  </div>
                  
                  <div className="bg-zinc-900/50 p-10 rounded-[2rem] border border-zinc-800/50">
                    <h4 className="font-black uppercase text-sm text-zinc-500 mb-8 tracking-widest">Key Features</h4>
                    <ul className="space-y-6">
                      {item.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-6 font-bold text-xl text-zinc-200">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF3B14]/10 flex items-center justify-center text-[#FF3B14] shadow-[0_0_15px_rgba(252,29,0,0.2)]">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-8 pt-4">
                    <div className="flex items-start gap-6">
                      <div className="text-4xl pt-1 drop-shadow-lg">🎯</div>
                      <div>
                        <p className="text-xl font-black text-white mb-1">Use Case</p>
                        <p className="text-xl font-medium text-zinc-400">{item.useCase}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="text-4xl pt-1 drop-shadow-lg">✨</div>
                      <div>
                        <p className="text-xl font-black text-[#FF3B14] mb-1">The Benefit</p>
                        <p className="text-xl font-medium text-zinc-300">{item.benefit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Benefits Section (7.4) */}
        <section className="w-full pt-16 pb-12 bg-[#0d0d0d] text-white relative overflow-hidden border-t border-zinc-900/50">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-md">The unfair advantage</h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium w-full max-w-3xl mx-auto leading-relaxed">Everything you need to succeed, without the guesswork.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
              {benefits.map((b, i) => (
                <div key={i} className="relative p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-zinc-800/60 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-zinc-700/80 backdrop-blur-xl transition-all duration-500 group shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                  
                  {/* Subtle Accent Glow on Hover */}
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-[#FF3B14]/10 to-transparent rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  
                  <div className="w-20 h-20 bg-black/80 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-4xl mb-8 border border-zinc-800/80 group-hover:border-[#FF3B14]/50 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-inner relative z-10">
                    {b.icon}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 text-zinc-200 group-hover:text-white transition-colors duration-300 relative z-10">{b.title}</h3>
                  <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed relative z-10">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Free Courses Section (7.5) */}
        <section className="w-full pt-16 pb-12 bg-[#0d0d0d] border-t border-zinc-900/50">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
              <div className="w-full text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/10 text-green-400 text-sm font-black mb-8 border border-green-500/30 uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Included Free with the Creator Kit
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-md">Master your craft.</h2>
                <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-4xl mx-auto lg:mx-0">Don't just buy the gear—learn exactly how to use it to grow. Our expert-led masterclasses cover everything from shooting to going viral.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
              {masteryCourses.map((course, index) => (
                <div key={index} className={`p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border ${course.color} bg-zinc-950/40 hover:bg-zinc-900/60 backdrop-blur-xl hover:-translate-y-4 transition-all duration-500 shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group`}>
                  
                  {/* Included Free Ribbon */}
                  <div className="absolute top-8 right-8 bg-green-500/20 text-green-400 border border-green-500/30 font-bold px-4 py-1.5 rounded-full text-sm z-20 shadow-[0_0_15px_rgba(34,197,94,0.2)] backdrop-blur-md">
                    100% Free
                  </div>

                  {/* Decorative corner blur */}
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-zinc-800/40 to-transparent rounded-full blur-[80px] group-hover:scale-150 group-hover:from-zinc-700/50 transition-all duration-1000 opacity-50"></div>

                  <div className={`relative z-10 w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-10 text-white shadow-2xl ${course.iconBg} transform group-hover:rotate-12 transition-transform duration-500`}>
                    {course.icon}
                  </div>
                  <h3 className="relative z-10 text-3xl md:text-4xl font-black mb-5 text-zinc-100 group-hover:text-white transition-colors">{course.title}</h3>
                  <p className="relative z-10 text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">{course.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Creator Workflow Timeline (7.7) */}
        <section className="w-full pt-12 pb-12 bg-[#0d0d0d] overflow-hidden border-t border-zinc-900/50">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white drop-shadow-md">Your streamlined workflow</h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium w-full max-w-4xl mx-auto leading-relaxed">From unboxing to uploading, we've optimized every step of the content creation journey.</p>
            </div>
            
            <div className="relative w-full max-w-7xl mx-auto">
              {/* Connecting Line - Timeline style */}
              <div className="hidden lg:block absolute top-24 left-0 w-full h-1.5 bg-zinc-800/60 -translate-y-1/2 rounded-full overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-r from-[#FF3B14] to-orange-500 transform origin-left"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 relative z-10">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="relative pt-12 lg:pt-0 group">
                    {/* Timeline Node */}
                    <div className="hidden lg:flex absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-950 border-4 border-[#FF3B14] items-center justify-center shadow-[0_0_20px_rgba(252,29,0,0.5)] z-20 group-hover:scale-150 transition-transform duration-500">
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>

                    <div className="bg-zinc-950/40 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-zinc-800/60 relative text-center flex flex-col items-center hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:-translate-y-4 transition-all duration-500 h-full mt-0 lg:mt-32 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#FF3B14] to-[#FF512F] text-white rounded-full flex items-center justify-center font-black text-4xl mb-8 shadow-[0_0_30px_rgba(252,29,0,0.3)] ring-8 ring-black/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 -mt-24">
                        {index + 1}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black mb-5 text-zinc-100 group-hover:text-white transition-colors">{step.title}</h3>
                      <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. FAQ Section */}
        <section className="w-full pt-16 pb-12 bg-[#0d0d0d] border-t border-zinc-900/50">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-24 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white drop-shadow-md">Frequently Asked Questions</h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed">Everything you need to know before you buy.</p>
            </div>

            <div className="space-y-6 w-full max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className={`border ${openFaqIndex === index ? 'border-[#FF3B14]/50 bg-zinc-900/60 shadow-[0_10px_30px_rgba(255,59,20,0.1)]' : 'border-zinc-800/60 bg-zinc-950/40 hover:bg-zinc-900/60'} backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500`}>
                  <button
                    className="w-full px-8 md:px-12 py-8 md:py-10 text-left flex justify-between items-center group"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                  >
                    <span className="font-black text-2xl md:text-3xl text-zinc-100 group-hover:text-white transition-colors pr-8">{faq.question}</span>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-inner ${openFaqIndex === index ? 'bg-[#FF3B14] text-white shadow-[0_0_20px_rgba(255,59,20,0.4)] rotate-180' : 'bg-black/80 text-zinc-400 group-hover:text-white border border-zinc-800/80 group-hover:border-[#FF3B14]/50'}`}>
                      <svg className="w-6 h-6 transform transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`px-8 md:px-12 overflow-hidden transition-all duration-500 ease-in-out ${openFaqIndex === index ? 'max-h-[500px] pb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Complete Bundle CTA - Full Width Final Banner */}
        <section className="w-full pt-16 pb-24 md:pt-16 md:pb-32 bg-[#0d0d0d] relative overflow-hidden border-t border-zinc-900/50">
          {/* Animated Background Elements - Subdued for dark theme */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF3B14]/10 via-[#0d0d0d] to-[#0d0d0d] opacity-80 mix-blend-screen"></div>
          
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              {/* Left Column: Text & Value Prop */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-green-500/10 text-green-400 font-black text-xs md:text-sm tracking-widest uppercase mb-10 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> In Stock & Ready to Ship
                </span>
                
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight drop-shadow-md">The Ultimate<br className="hidden lg:block"/> Creators Kit</h2>
                <p className="text-xl md:text-2xl text-zinc-400 mb-12 lg:mb-16 max-w-2xl font-medium leading-relaxed">
                  Hardware + Education + Physical Resources. Get everything you need to start producing professional content today.
                </p>
                
                <p className="hidden lg:flex mt-4 text-sm md:text-base text-zinc-400 font-bold items-center gap-3">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  30-Day No-Questions-Asked Money-Back Guarantee
                </p>
              </div>
              
              {/* Right Column: Pricing Card & CTA */}
              <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-2xl bg-zinc-950/40 backdrop-blur-xl border border-zinc-800/60 rounded-[3rem] p-10 md:p-16 shadow-2xl relative group hover:border-zinc-700/80 transition-all duration-500 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B14]/5 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  
                  <div className="relative z-10 w-full flex flex-col items-center">
                    <p className="text-lg md:text-xl font-bold text-zinc-500 line-through mb-4 tracking-wide decoration-[#FF3B14] decoration-2">Total Value: ₹4,999</p>
                    <p className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 drop-shadow-lg">₹3,999</p>
                    <div className="inline-block bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm md:text-base shadow-lg mb-12">
                      Includes Free Nationwide Shipping 🚚
                    </div>
                    
                    <Link
                      href="/product"
                      className="inline-flex w-full justify-center items-center gap-4 px-10 py-5 md:py-6 bg-gradient-to-r from-[#FF3B14] to-[#FF6B4A] text-white rounded-full font-black text-xl md:text-2xl hover:shadow-[0_0_40px_rgba(255,59,20,0.4)] transition-all hover:-translate-y-2 group/btn"
                    >
                      Order Your Kit Now
                      <svg className="w-8 h-8 text-white transform group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
                
                <p className="flex lg:hidden mt-12 text-sm text-zinc-400 font-bold items-center justify-center gap-2 text-center w-full">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  30-Day Money-Back Guarantee
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
