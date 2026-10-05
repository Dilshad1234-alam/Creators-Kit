'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus('Thanks for reaching out! We will get back to you within 24 hours.');
        e.target.reset();
      } else {
        setStatus('Failed to send message: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-background text-[#900606] dark:text-neutral-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight mb-3 md:mb-4 text-[#900606] dark:text-neutral-100">Contact Us</h1>
          <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400">We're here to help you on your creator journey.</p>
        </div>

        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto rounded-[2.5rem] md:rounded-[3rem] transition-all duration-300 flex-col-reverse flex lg:grid">
          
          {/* Contact Info */}
          <div className="relative z-10 text-[#900606] dark:text-neutral-100 p-6 md:p-10 lg:p-16 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-neutral-200 dark:border-neutral-800 order-2 lg:order-1">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Get in touch</h2>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-8 md:mb-10 leading-relaxed">
                Whether you have a question about the kit, shipping details, or need technical support with your new gear, our dedicated team is ready to assist.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#900606]/20 rounded-full flex items-center justify-center text-[#900606]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">support@creatorskit.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#900606]/20 rounded-full flex items-center justify-center text-[#900606]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">123 Creator Blvd, Tech City, TC 90210</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 md:mt-12">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-[#900606]">Creators Kit</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative z-10 p-6 md:p-10 lg:p-16 order-1 lg:order-2">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#900606] dark:text-neutral-100">Send us a message</h2>
            {status && (
              <div className="mb-6 p-4 bg-[#900606]/10 text-[#900606] border border-[#900606]/20 rounded-xl text-sm font-medium">
                {status}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name" name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-background border border-neutral-700 text-[#900606] dark:text-neutral-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#900606]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email" name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-background border border-neutral-700 text-[#900606] dark:text-neutral-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#900606]"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Message</label>
                <textarea
                  id="message" name="message"
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-background border border-neutral-700 text-[#900606] dark:text-neutral-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#900606] resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 md:py-4 bg-[#900606] text-white rounded-xl font-bold text-base md:text-lg hover:bg-[#700505] transition-colors shadow-md"
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
