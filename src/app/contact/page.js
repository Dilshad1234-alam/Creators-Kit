'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks for reaching out! We will get back to you within 24 hours.');
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-zinc-100">Contact Us</h1>
          <p className="text-xl text-zinc-400">We're here to help you on your creator journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 overflow-hidden">
          
          {/* Contact Info */}
          <div className="bg-[#0d0d0d] text-zinc-100 p-10 md:p-16 flex flex-col justify-between border-r border-zinc-800">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in touch</h2>
              <p className="text-zinc-400 mb-10 leading-relaxed">
                Whether you have a question about the kit, shipping details, or need technical support with your new gear, our dedicated team is ready to assist.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#FF3B14]/20 rounded-full flex items-center justify-center text-[#FF3B14]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-neutral-300">support@creatorskit.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#FF3B14]/20 rounded-full flex items-center justify-center text-[#FF3B14]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className="text-neutral-300">123 Creator Blvd, Tech City, TC 90210</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <span className="text-2xl font-black tracking-tighter text-[#FF3B14]">Creators Kit</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 md:p-16">
            <h2 className="text-2xl font-bold mb-6 text-zinc-100">Send us a message</h2>
            {status && (
              <div className="mb-6 p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-sm font-medium">
                {status}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0d0d0d] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF3B14]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0d0d0d] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF3B14]"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-1">Message</label>
                <textarea
                  id="message"
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-[#0d0d0d] border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF3B14] resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#FF3B14] text-white rounded-xl font-bold text-lg hover:bg-[#E01900] transition-colors shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
