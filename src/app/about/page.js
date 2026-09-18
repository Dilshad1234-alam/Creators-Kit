'use client';
import { useState } from 'react';

const faqs = [
  {
    question: "What exactly is included in the Creators Kit bundle?",
    answer: "The bundle includes a 10-inch LED Ring Light, an adjustable aluminum stand, a wireless noise-canceling microphone, a flexible smartphone/camera tripod, a chroma key green curtain with clamps, a physical USB pendrive containing all our Mastery Courses, and printed masterclass workbooks."
  },
  {
    question: "Are the Mastery Courses really free?",
    answer: "Yes! The Instagram Mastery, YouTube Mastery, and Filmora Mastery courses are 100% included with your purchase of the Creators Kit. You'll receive them pre-loaded on the physical USB pendrive for lifetime, offline access."
  },
  {
    question: "Does the microphone work with my smartphone?",
    answer: "Yes, our wireless microphone includes adapters for both USB-C and Lightning ports, making it plug-and-play compatible with modern iPhones and Android devices."
  },
  {
    question: "How long does shipping take?",
    answer: "We offer fast and free nationwide delivery. Orders are typically processed within 24 hours and delivered within 3-5 business days."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee. If you are not completely satisfied with your Creators Kit, you can return it within 30 days of receiving it for a full refund, no questions asked."
  }
];

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState(-1);
  return (
    <div className="min-h-screen bg-[#0B0D0E] text-zinc-100 w-full font-sans overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full py-12 lg:py-20 bg-[#0B0D0E]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FF3B14]/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="w-full px-6 lg:px-16 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#FF3B14]/10 text-[#FF3B14] text-sm font-bold mb-10 border border-[#FF3B14]/30 shadow-[0_0_20px_rgba(255,59,20,0.2)] transition-all">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3B14]"></span>
            </span>
            Empowering the next generation
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-zinc-100 leading-[1.1] max-w-4xl mx-auto">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B14] to-orange-500">Creators Kit</span>
          </h1>
          <p className="max-w-3xl text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium mx-auto">
            We believe that high-quality content creation should be accessible to everyone. 
            No more endless research, incompatible gear, or confusing tutorials.
          </p>
        </div>
      </section>

      {/* Mission Statement & Story */}
      <section className="w-full py-12 lg:py-20 bg-[#0B0D0E] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="w-full px-6 lg:px-16 mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Mission Card */}
          <div className="bg-zinc-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-zinc-800/80 shadow-2xl relative overflow-hidden group flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3B14]/5 rounded-full blur-[80px] group-hover:bg-[#FF3B14]/15 transition-colors duration-700"></div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight text-white relative z-10">Our Mission</h2>
            <div className="w-20 h-1.5 bg-[#FF3B14] mb-8 rounded-full relative z-10"></div>
            <p className="text-xl md:text-2xl text-neutral-400 font-medium leading-relaxed relative z-10">
              To eliminate the technical barriers of content creation, allowing you to focus entirely on your message, your art, and your audience.
            </p>
          </div>

          {/* Story Card */}
          <div className="bg-zinc-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-zinc-800/80 shadow-2xl relative overflow-hidden group flex flex-col justify-center">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF3B14]/5 rounded-full blur-[80px] group-hover:bg-[#FF3B14]/15 transition-colors duration-700"></div>
            <h3 className="text-3xl font-bold mb-6 text-zinc-100 relative z-10">The Story</h3>
            <p className="text-neutral-400 leading-relaxed mb-6 font-medium relative z-10 text-lg">
              Creators Kit was born out of a simple frustration: starting a YouTube channel, podcast, or TikTok page is overwhelming. You spend weeks researching what camera to buy, what microphone sounds best, and how to light your room, only to realize you still don't know how to edit the footage.
            </p>
            <p className="text-neutral-400 leading-relaxed font-medium relative z-10 text-lg">
              We realized that creators don't just need gear; they need an <strong className="text-white">ecosystem</strong>. They need the hardware to record, the software knowledge to edit, and the strategies to publish and grow. 
            </p>
          </div>
        </div>
      </section>

      {/* The Ecosystem (Core Philosophy) */}
      <section className="w-full py-12 lg:py-20 bg-[#0B0D0E] border-t border-zinc-900/50">
        <div className="w-full px-6 lg:px-16">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-zinc-100">The Creator Ecosystem</h2>
            <p className="text-xl text-zinc-400 font-medium">The three pillars that guarantee your success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Equipment */}
            <div className="bg-zinc-900/40 p-10 lg:p-12 rounded-[2.5rem] shadow-lg border border-zinc-800/60 hover:border-[#FF3B14]/50 hover:bg-zinc-900/80 hover:shadow-[0_0_40px_rgba(255,59,20,0.15)] transform hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-inner border border-zinc-700/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                🎥
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-zinc-100 group-hover:text-[#FF3B14] transition-colors duration-300">Equipment</h3>
              <p className="text-lg text-zinc-400 font-medium leading-relaxed">Professional-grade, plug-and-play hardware curated to work perfectly together right out of the box.</p>
            </div>
            
            {/* Education */}
            <div className="bg-zinc-900/40 p-10 lg:p-12 rounded-[2.5rem] shadow-lg border border-zinc-800/60 hover:border-[#FF3B14]/50 hover:bg-zinc-900/80 hover:shadow-[0_0_40px_rgba(255,59,20,0.15)] transform hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-inner border border-zinc-700/50 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                🧠
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-zinc-100 group-hover:text-[#FF3B14] transition-colors duration-300">Education</h3>
              <p className="text-lg text-zinc-400 font-medium leading-relaxed">Included mastery courses for YouTube, Instagram, and Filmora to help you maximize your gear.</p>
            </div>
            
            {/* Resources */}
            <div className="bg-zinc-900/40 p-10 lg:p-12 rounded-[2.5rem] shadow-lg border border-zinc-800/60 hover:border-[#FF3B14]/50 hover:bg-zinc-900/80 hover:shadow-[0_0_40px_rgba(255,59,20,0.15)] transform hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-inner border border-zinc-700/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                📑
              </div>
              <h3 className="text-2xl font-extrabold mb-4 text-zinc-100 group-hover:text-[#FF3B14] transition-colors duration-300">Resources</h3>
              <p className="text-lg text-zinc-400 font-medium leading-relaxed">Physical pendrives for offline learning and printed project workbooks for hands-on, tactile mastery.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#0B0D0E] border-t border-zinc-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-zinc-100">Frequently Asked Questions</h2>
            <p className="text-xl text-zinc-400 font-medium">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200 bg-zinc-900"
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                >
                  <span className="font-bold text-lg text-zinc-100">{faq.question}</span>
                  <svg 
                    className={`w-6 h-6 text-[#FF3B14] transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 py-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-zinc-400 leading-relaxed font-medium">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/80 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FF3B14]/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 group-hover:bg-[#FF3B14]/15 transition-colors duration-700 pointer-events-none"></div>
            <h3 className="text-2xl font-bold mb-2 text-zinc-100 relative z-10">Still have questions?</h3>
            <p className="text-zinc-400 mb-8 font-medium relative z-10">Our support team is ready to help you out.</p>
            <a href="/contact" className="relative z-10 inline-flex items-center justify-center px-8 py-3.5 font-bold rounded-full text-white bg-[#FF3B14] hover:bg-[#E01900] transition-colors shadow-[0_0_20px_rgba(255,59,20,0.3)] hover:shadow-[0_0_30px_rgba(255,59,20,0.5)]">
              Contact Support
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
