'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const kitComponents = [
    {
      id: 'ring-light',
      name: '10-Inch Ring Light',
      description: 'Professional LED ring light with adjustable color temperatures.',
      features: ['3 Color Modes', '10 Brightness Levels', 'USB Powered'],
      useCase: 'Perfect for well-lit vlogs, beauty tutorials, and streaming.',
      benefit: 'Instantly elevates your video quality with flattering, even lighting.',
      icon: '💡',
      image: '/kit 4.webp',
    },
    {
      id: 'stand',
      name: 'Adjustable Stand',
      description: 'Sturdy, adjustable tripod stand designed specifically for the ring light.',
      features: ['Adjustable Height (up to 50")', 'Lightweight Aluminum', 'Anti-slip Feet'],
      useCase: 'Keeps your lighting stable and perfectly positioned.',
      benefit: 'Durable and portable, allowing you to shoot anywhere.',
      icon: '🗼',
      image: '/kit 4.webp',
    },
    {
      id: 'mic',
      name: 'Wireless Microphone',
      description: 'Crisp, clear audio capture without the hassle of cables.',
      features: ['Noise Reduction', 'Plug-and-Play', '65ft Range'],
      useCase: 'Ideal for interviews, podcasts, and on-the-go vlogging.',
      benefit: 'Ensures your audience hears every word clearly, without background static.',
      icon: '🎙️',
      image: '/kit 3.webp',
    },
    {
      id: 'tripod',
      name: 'Camera/Phone Tripod',
      description: 'Versatile mounting solution for your smartphone or DSLR.',
      features: ['360° Rotation', 'Bluetooth Remote', 'Universal Mount'],
      useCase: 'Achieve stable shots and smooth panning for professional videos.',
      benefit: 'No more shaky footage; get the perfect angle every time.',
      icon: '📸',
      image: '/kit 1.webp',
    },
    {
      id: 'green-screen',
      name: 'Chroma Key Curtain',
      description: 'High-quality green screen backdrop for seamless background replacement.',
      features: ['Wrinkle-resistant', 'Washable', 'Includes Clamps'],
      useCase: 'Easily drop in custom backgrounds for gaming, streaming, or effects.',
      benefit: 'Transform your messy bedroom into a professional studio instantly.',
      icon: '🟩',
      image: '/kit.webp',
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
      color: 'bg-zinc-900 border-zinc-800',
      iconBg: 'bg-gradient-to-br from-pink-400 to-fuchsia-500 shadow-pink-500/30',
    },
    {
      title: 'YouTube Mastery',
      description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
      icon: '▶️',
      color: 'bg-zinc-900 border-zinc-800',
      iconBg: 'bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/30',
    },
    {
      title: 'Filmora Mastery',
      description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
      icon: '🎬',
      color: 'bg-zinc-900 border-zinc-800',
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
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <main className="flex-grow w-full">
        
        {/* 1. Hero Section (7.1) */}
        <section className="relative w-full pt-24 pb-32 overflow-hidden bg-zinc-950">
          <div className="w-full px-6 md:px-12 lg:px-24 relative z-10 text-center flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-bold mb-8 border border-red-500/20 shadow-sm animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-[#FC1D00] animate-pulse"></span>
              🔥 All-in-One Creator Bundle
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto text-zinc-100">
              Start creating with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC1D00] via-red-500 to-orange-500">
                one complete kit.
              </span>
            </h1>
            
            <p className="max-w-3xl text-xl md:text-2xl text-zinc-400 mb-10 leading-relaxed font-medium mx-auto">
              Stop guessing what gear you need. We provide the professional equipment, expert courses, and tactile resources so you can focus on what matters: making great content.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
              <Link
                href="/product"
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#FC1D00] to-red-600 text-white rounded-full font-extrabold text-lg hover:shadow-lg hover:shadow-red-500/40 transition-all hover:-translate-y-1"
              >
                Get Your Creator Kit
              </Link>
              <a
                href="#whats-inside"
                className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-zinc-300 border-2 border-zinc-700 rounded-full font-bold text-lg hover:border-[#FC1D00] hover:text-[#FC1D00] transition-colors shadow-sm"
              >
                Explore What's Inside
              </a>
            </div>

            {/* Hero Visual Block */}
            <div className="mt-20 w-full rounded-[2rem] aspect-[16/9] border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex items-center justify-center text-8xl md:text-9xl shadow-2xl shadow-zinc-900/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FC1D00]/10 to-transparent z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="z-10 flex gap-6 md:gap-12 items-center justify-center transform transition-transform duration-700 group-hover:scale-105">
                <div className="bg-zinc-800 p-6 rounded-3xl shadow-xl shadow-zinc-900 rotate-[-5deg] border border-zinc-700">💡</div>
                <div className="bg-zinc-800 p-8 rounded-[2rem] shadow-2xl shadow-zinc-900 z-20 scale-110 border border-zinc-700">🎙️</div>
                <div className="bg-zinc-800 p-6 rounded-3xl shadow-xl shadow-zinc-900 rotate-[5deg] border border-zinc-700">📦</div>
              </div>

              {/* Glowing decorative orbs */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-[#FC1D00]/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          {/* Main Background Blur */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-r from-[#FC1D00]/20 to-orange-500/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        </section>

        {/* 2. What's Inside (7.2) */}
        <section id="whats-inside" className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-zinc-100">Unbox your potential</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
                Every tool in the Creators Kit was hand-selected to give you a professional studio setup right out of the box.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {kitComponents.map((item) => (
                <a href={`#${item.id}`} key={item.id} className="bg-zinc-900/50 hover:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-800 hover:border-[#FC1D00]/50 shadow-sm hover:shadow-xl hover:shadow-[#FC1D00]/10 transition-all duration-300 text-center group cursor-pointer flex flex-col items-center justify-center aspect-square">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl hover:border-[#FC1D00] transition duration-300 transform hover:scale-[1.02] group-hover:-translate-y-2 group-hover:scale-110 drop-shadow-sm flex items-center justify-center">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-zinc-100 leading-tight">{item.name}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Component Details (7.3) */}
        <section className="w-full py-24 bg-zinc-900/30">
          <div className="w-full px-6 md:px-12 lg:px-24 space-y-32">
            
            {kitComponents.map((item, idx) => (
              <div id={item.id} key={item.id} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2 aspect-square lg:aspect-[4/3] bg-zinc-950 rounded-[3rem] flex items-center justify-center text-9xl shadow-2xl shadow-zinc-950/50 border border-zinc-800 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 z-0"></div>
                  <div className="z-10 w-[80%] h-[80%] relative bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl hover:border-[#FC1D00] transition duration-300 transform hover:scale-[1.02] group-hover:scale-105 drop-shadow-2xl">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-4" />
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 space-y-8">
                  <div>
                    <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-zinc-100">{item.name}</h3>
                    <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium">{item.description}</p>
                  </div>
                  
                  <div className="bg-zinc-950 p-8 rounded-3xl shadow-sm border border-zinc-800">
                    <h4 className="font-bold uppercase text-sm text-zinc-500 mb-6 tracking-widest">Key Features</h4>
                    <ul className="space-y-4">
                      {item.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-4 font-semibold text-lg text-zinc-300">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FC1D00]/20 flex items-center justify-center text-[#FC1D00]">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl pt-1">🎯</div>
                      <div>
                        <p className="text-lg font-bold text-zinc-100">Use Case</p>
                        <p className="text-lg font-medium text-zinc-400">{item.useCase}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-3xl pt-1">✨</div>
                      <div>
                        <p className="text-lg font-bold text-[#FC1D00]">The Benefit</p>
                        <p className="text-lg font-medium text-zinc-300">{item.benefit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Benefits Section (7.4) */}
        <section className="w-full py-24 bg-zinc-950 text-zinc-100 relative overflow-hidden border-t border-zinc-900">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-zinc-100">The unfair advantage</h2>
              <p className="text-xl text-zinc-400 font-medium max-w-3xl mx-auto">Everything you need to succeed, without the guesswork.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {benefits.map((b, i) => (
                <div key={i} className="bg-zinc-900/50 backdrop-blur-sm p-10 rounded-[2rem] border border-zinc-800 hover:border-[#FC1D00]/50 hover:bg-zinc-900 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl mb-8 border border-zinc-700 group-hover:bg-[#FC1D00]/20 group-hover:border-[#FC1D00]/30 transition-colors">
                    {b.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-zinc-100">{b.title}</h3>
                  <p className="text-lg text-zinc-400 font-medium leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Free Courses Section (7.5) */}
        <section className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-bold mb-6 border border-green-500/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Included Free with the Creator Kit
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-zinc-100">Master your craft.</h2>
                <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed">Don't just buy the gear—learn exactly how to use it to grow. Our expert-led masterclasses cover everything from shooting to going viral.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {masteryCourses.map((course, index) => (
                <div key={index} className={`p-10 lg:p-12 rounded-[3rem] border ${course.color} hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-zinc-950/40 relative overflow-hidden group`}>
                  
                  {/* Decorative corner blur */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-zinc-800/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-10 text-white shadow-lg ${course.iconBg}`}>
                    {course.icon}
                  </div>
                  <h3 className="text-3xl font-extrabold mb-5 text-zinc-100">{course.title}</h3>
                  <p className="text-lg text-zinc-400 font-medium leading-relaxed">{course.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Pendrive & Printed Projects Section (7.6) */}
        <section className="w-full py-24 bg-zinc-900 text-zinc-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-zinc-950/50 z-0"></div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">Learn offline.<br/>Build hands-on.</h2>
                <p className="text-xl md:text-2xl text-zinc-400 mb-12 leading-relaxed font-medium">
                  We know that relying solely on internet connectivity can disrupt your flow. That's why we've brought the learning directly to your physical workspace.
                </p>
                
                <div className="space-y-8">
                  <div className="bg-zinc-950/50 border border-zinc-800 p-8 rounded-[2rem] flex gap-8 items-start backdrop-blur-md">
                    <div className="flex-shrink-0 w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-zinc-800 text-[#FC1D00]">
                      💾
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3 text-zinc-100">Physical USB Pendrive</h4>
                      <p className="text-lg text-zinc-400 font-medium leading-relaxed">Lifetime, offline access to all our Mastery Courses pre-loaded on a high-speed flash drive. Plug in and learn anywhere.</p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-950/50 border border-zinc-800 p-8 rounded-[2rem] flex gap-8 items-start backdrop-blur-md">
                    <div className="flex-shrink-0 w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-zinc-800 text-[#FC1D00]">
                      📑
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3 text-zinc-100">Printed Project Workbooks</h4>
                      <p className="text-lg text-zinc-400 font-medium leading-relaxed">Follow along with our high-quality printed workbooks, shot lists, and cheat sheets for tactile learning.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Glow behind the box */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FC1D00] rounded-full blur-[120px] opacity-30"></div>
                
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[4rem] p-12 md:p-20 border border-zinc-700 text-center relative shadow-2xl shadow-black/50 transform rotate-2 hover:rotate-0 transition-transform duration-500 w-full h-full flex flex-col justify-center items-center">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 mb-10 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl hover:border-[#FC1D00] transition duration-300 transform hover:scale-[1.02] filter drop-shadow-2xl">
                    <Image src="/kit 5.webp" alt="Creators Kit Box and Pendrive" fill className="object-contain p-2" />
                  </div>
                  <h3 className="text-4xl font-extrabold mb-6 text-zinc-100">The Complete Box</h3>
                  <p className="text-xl text-zinc-400 font-medium leading-relaxed">The hardware to create, the software to edit, and the knowledge to grow—shipped right to your door.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Creator Workflow (7.7) */}
        <section className="w-full py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-zinc-100">Your streamlined workflow</h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-3xl mx-auto">From unboxing to uploading, we've optimized every step of the content creation journey.</p>
            </div>
            
            <div className="relative w-full">
              {/* Connecting Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-zinc-800 via-[#FC1D00] to-zinc-800 -translate-y-1/2 rounded-full opacity-30"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="bg-zinc-900 p-10 rounded-[2.5rem] shadow-xl shadow-zinc-950/50 border border-zinc-800 relative text-center flex flex-col items-center group hover:-translate-y-3 transition-transform duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FC1D00] to-red-600 text-white rounded-3xl flex items-center justify-center font-black text-3xl mb-8 shadow-lg shadow-[#FC1D00]/20 transform group-hover:scale-110 transition-transform duration-300 ring-8 ring-zinc-950">
                      {index + 1}
                    </div>
                    <h3 className="text-3xl font-extrabold mb-4 text-zinc-100">{step.title}</h3>
                    <p className="text-lg text-zinc-400 font-medium leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Who Is It For? (7.8) */}
        <section className="w-full py-24 bg-zinc-950">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="bg-zinc-900 rounded-[4rem] p-10 md:p-20 lg:p-24 border border-zinc-800 shadow-2xl shadow-zinc-950/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FC1D00]/10 via-transparent to-transparent opacity-70"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
                <div>
                  <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-zinc-100">Who is it for?</h2>
                  <p className="text-2xl text-zinc-400 mb-12 font-medium leading-relaxed">Whether you're looking to build a personal brand, document your life, or market a business, this kit removes all technical barriers.</p>
                  
                  <ul className="space-y-6">
                    {[
                      { title: 'Beginners', desc: 'Looking for an all-in-one plug-and-play solution.' },
                      { title: 'YouTubers', desc: 'Wanting to upgrade their production quality instantly.' },
                      { title: 'Social Creators', desc: 'Focusing on high-performing short-form content.' },
                      { title: 'Small Businesses', desc: 'Recording crisp product demos and marketing videos.' },
                      { title: 'Educators', desc: 'Students and teachers launching online courses.' }
                    ].map((audience, i) => (
                      <li key={i} className="flex items-start gap-6 p-6 rounded-3xl hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-800">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FC1D00]/20 flex items-center justify-center text-[#FC1D00] mt-1">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <span className="text-zinc-100 font-bold block text-2xl mb-2">{audience.title}</span>
                          <span className="text-zinc-400 font-medium block text-lg">{audience.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-[#FC1D00] to-orange-600 rounded-[3rem] w-full aspect-square flex items-center justify-center relative shadow-2xl shadow-[#FC1D00]/20 text-white overflow-hidden p-12 text-center border border-red-500/50">
                   {/* Decorative animated elements */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                   
                   <div className="relative z-10">
                      <span className="text-8xl md:text-9xl mb-8 block animate-bounce drop-shadow-2xl">🚀</span>
                      <h3 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">Ready to launch?</h3>
                      <p className="text-2xl font-medium text-white/90">Join thousands of creators today.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FAQ Section (7.10) */}
        <section className="w-full py-24 bg-zinc-950 border-t border-zinc-900">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="text-center mb-20 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-zinc-100">Frequently Asked Questions</h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium">Everything you need to know before you buy.</p>
            </div>

            <div className="space-y-6 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className={`border ${openFaqIndex === index ? 'border-[#FC1D00]' : 'border-zinc-800'} rounded-[2rem] overflow-hidden bg-zinc-900 shadow-sm transition-colors duration-300`}>
                  <button
                    className="w-full px-8 md:px-10 py-8 text-left flex justify-between items-center hover:bg-zinc-800/50 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                  >
                    <span className="font-bold text-xl md:text-2xl text-zinc-100 pr-4">{faq.question}</span>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${openFaqIndex === index ? 'bg-[#FC1D00]/20 text-[#FC1D00]' : 'bg-zinc-800 text-zinc-400'}`}>
                      <svg className={`w-6 h-6 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`px-8 md:px-10 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Complete Bundle CTA (7.9) */}
        <section className="w-full py-32 bg-[#FC1D00] text-center relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 relative z-10 text-white">
            <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white font-bold text-sm tracking-widest uppercase mb-8 backdrop-blur-sm border border-white/30">
              Limited Time Offer
            </span>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight drop-shadow-md">The Ultimate Creators Kit</h2>
            <p className="text-2xl lg:text-3xl text-white/90 mb-16 max-w-4xl mx-auto font-medium leading-relaxed">
              Hardware + Education + Physical Resources. Get everything you need to start producing professional content today.
            </p>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[4rem] p-12 md:p-20 mb-16 max-w-3xl mx-auto shadow-2xl">
              <p className="text-2xl font-bold text-white/60 line-through mb-4 tracking-wide">Total Value: $450+</p>
              <p className="text-8xl lg:text-9xl font-black text-white mb-8 drop-shadow-lg">$199.99</p>
              <p className="text-xl text-white/90 font-bold bg-white/20 inline-block px-8 py-3 rounded-full border border-white/30">
                Includes Free Nationwide Shipping
              </p>
            </div>

            <Link
              href="/product"
              className="inline-flex items-center gap-4 px-16 py-8 bg-zinc-950 text-white border border-zinc-800 rounded-full font-black text-3xl hover:bg-zinc-900 transition-all hover:scale-105 shadow-2xl"
            >
              Order Your Kit Now
              <svg className="w-10 h-10 text-[#FC1D00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            
            <p className="mt-12 text-lg text-white/80 font-bold flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              30-Day No-Questions-Asked Money-Back Guarantee
            </p>
          </div>
        </section>

      </main>

    </div>
  );
}
