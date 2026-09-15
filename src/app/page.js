import Link from 'next/link';

export default function Home() {
  const kitComponents = [
    {
      name: 'Ring Light',
      description: 'Professional 10-inch LED ring light with adjustable color temperatures.',
      features: ['3 Color Modes', '10 Brightness Levels', 'USB Powered'],
      useCase: 'Perfect for well-lit vlogs, beauty tutorials, and streaming.',
      icon: '💡',
    },
    {
      name: 'Ring Light Stand',
      description: 'Sturdy, adjustable tripod stand designed specifically for the ring light.',
      features: ['Adjustable Height (up to 50")', 'Lightweight Aluminum', 'Anti-slip Feet'],
      useCase: 'Keeps your lighting stable and perfectly positioned.',
      icon: '🗼',
    },
    {
      name: 'Wireless Microphone',
      description: 'Crisp, clear audio capture without the hassle of cables.',
      features: ['Noise Reduction', 'Plug-and-Play', '65ft Range'],
      useCase: 'Ideal for interviews, podcasts, and on-the-go vlogging.',
      icon: '🎙️',
    },
    {
      name: 'Tripod for Camera/Phone',
      description: 'Versatile mounting solution for your smartphone or DSLR.',
      features: ['360° Rotation', 'Bluetooth Remote', 'Universal Mount'],
      useCase: 'Achieve stable shots and smooth panning for professional videos.',
      icon: '📸',
    },
    {
      name: 'Green Curtain (Chroma Key)',
      description: 'High-quality green screen backdrop for seamless background replacement.',
      features: ['Wrinkle-resistant', 'Washable', 'Includes Clamps'],
      useCase: 'Easily drop in custom backgrounds for gaming, streaming, or effects.',
      icon: '🟩',
    },
  ];

  const masteryCourses = [
    {
      title: 'Instagram Mastery',
      description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
      icon: '📱',
      color: 'bg-pink-50',
      iconBg: 'bg-pink-100',
    },
    {
      title: 'YouTube Mastery',
      description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
      icon: '▶️',
      color: 'bg-red-50',
      iconBg: 'bg-red-100',
    },
    {
      title: 'Filmora Mastery',
      description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
      icon: '🎬',
      color: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
  ];

  const workflowSteps = [
    { title: 'Setup', description: 'Unbox your gear and follow our quick-start guide to build your studio in 10 minutes.' },
    { title: 'Record', description: 'Hit record with confidence using professional lighting and crystal-clear audio.' },
    { title: 'Edit', description: 'Use the provided Filmora course to edit your footage like a pro without the steep learning curve.' },
    { title: 'Publish', description: 'Deploy our proven Instagram and YouTube strategies to maximize your reach and views.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">


      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-sm font-semibold mb-8 border border-neutral-200">
              <span className="flex h-2 w-2 rounded-full bg-[#FC1D00]"></span>
              Equipment + Courses + Resources
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Start creating with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC1D00] to-orange-500">
                one complete kit.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-neutral-600 mb-10 leading-relaxed">
              Stop guessing what gear you need. We provide the equipment, courses, and resources so you can focus on what matters: making great content.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-[#FC1D00] text-white rounded-full font-bold text-lg hover:bg-[#E01900] transition-transform hover:scale-105 shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
              >
                Get Your Creator Kit
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <a
                href="#whats-inside"
                className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-900 border border-neutral-200 rounded-full font-bold text-lg hover:bg-neutral-50 transition-colors flex items-center justify-center"
              >
                Explore What's Inside
              </a>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
        </section>

        {/* Component Showcase Section */}
        <section id="whats-inside" className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Unbox your potential</h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Every tool in the Creators Kit was hand-selected to give you a professional studio setup right out of the box.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kitComponents.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#FC1D00] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  <div className="text-4xl mb-6 bg-neutral-50 w-16 h-16 rounded-xl flex items-center justify-center border border-neutral-100">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.name}</h3>
                  <p className="text-neutral-600 mb-6 text-sm leading-relaxed">{item.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {item.features.map((feature, fIndex) => (
                          <li key={fIndex} className="text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#FC1D00]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Mastery Courses Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <span className="text-[#FC1D00] font-bold tracking-wider uppercase text-sm mb-2 block">Bonus Value</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Mastery Courses</h2>
                <p className="text-lg text-neutral-600">Don't just buy the gear—learn how to use it. Our expert-led masterclasses cover everything from shooting to going viral.</p>
              </div>
              <div className="bg-green-100 text-green-800 border border-green-200 px-4 py-2 rounded-full text-sm font-bold inline-flex items-center self-start md:self-auto gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Free / Included with Creator Kit
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {masteryCourses.map((course, index) => (
                <div key={index} className={`p-8 rounded-2xl ${course.color} border border-black/5 hover:-translate-y-1 transition-transform`}>
                  <div className={`w-14 h-14 rounded-xl ${course.iconBg} flex items-center justify-center text-3xl mb-6`}>
                    {course.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                  <p className="text-neutral-700 text-sm leading-relaxed">{course.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pendrive & Printed Projects Section */}
        <section className="py-24 bg-neutral-900 text-white overflow-hidden relative">
          {/* Subtle background decoration */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FC1D00] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Offline access + hands-on learning.</h2>
                <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
                  We know that relying solely on internet connectivity can disrupt your flow. That's why we've brought the learning directly to your desk.
                </p>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                      💾
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Physical Pendrive Included</h4>
                      <p className="text-neutral-400">Get lifetime, offline access to all our Mastery Courses directly on a high-speed flash drive. Plug in and learn anywhere, anytime.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                      📑
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Printed Project Materials</h4>
                      <p className="text-neutral-400">Step away from the screen. Follow along with our high-quality printed workbooks, shot lists, and project cheat sheets for tactile, hands-on learning.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-800 rounded-3xl p-8 md:p-12 border border-neutral-700 text-center relative shadow-2xl">
                <div className="text-9xl mb-8">📦</div>
                <h3 className="text-2xl font-bold mb-4">The Complete Box</h3>
                <p className="text-neutral-400 mb-8">The hardware to create, the software to edit, and the knowledge to grow—all in one physical package shipped right to your door.</p>
                <Link
                  href="/register"
                  className="w-full block py-4 bg-[#FC1D00] text-white rounded-full font-bold text-lg hover:bg-[#E01900] transition-colors"
                >
                  Order Your Kit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Workflow & Target Audience Section */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Your streamlined workflow</h2>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">From unboxing to uploading, we've optimized every step of the content creation journey.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Connecting line for desktop */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-neutral-200 -translate-y-1/2 -z-10"></div>
                
                {workflowSteps.map((step, index) => (
                  <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 relative text-center">
                    <div className="w-10 h-10 bg-[#FC1D00] text-white rounded-full flex items-center justify-center font-bold text-lg absolute -top-5 left-1/2 -translate-x-1/2 ring-8 ring-neutral-50">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold mt-4 mb-3">{step.title}</h3>
                    <p className="text-sm text-neutral-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-16 border border-neutral-100 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Who is the Creators Kit for?</h2>
                  <p className="text-lg text-neutral-600 mb-8">Whether you're looking to build a personal brand, document your life, or market a business, this kit removes the technical barriers.</p>
                  <ul className="space-y-4">
                    {[
                      'Beginners looking for an all-in-one starter solution',
                      'YouTubers wanting to upgrade their production quality',
                      'Instagram & TikTok creators focusing on short-form content',
                      'Small Businesses recording product demos and marketing videos',
                      'Students launching their first podcast or vlog'
                    ].map((audience, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-[#FC1D00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-neutral-700 font-medium">{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-neutral-900 rounded-2xl aspect-square md:aspect-auto md:h-full flex items-center justify-center relative overflow-hidden">
                   <div className="text-center z-10 px-8">
                      <span className="text-6xl mb-4 block">🚀</span>
                      <h3 className="text-2xl font-bold text-white mb-2">Ready to launch?</h3>
                      <p className="text-neutral-400">Join the community today.</p>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#FC1D00]/20 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 bg-white border-t border-neutral-100 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to hit record?</h2>
            <p className="text-lg text-neutral-600 mb-10">
              Join thousands of creators who leveled up their production quality overnight.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FC1D00] text-white rounded-full font-bold text-lg hover:bg-[#E01900] transition-colors shadow-lg shadow-red-500/20"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Creators Kit. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
