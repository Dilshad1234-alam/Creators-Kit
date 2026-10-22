'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Headphones, 
  ShieldCheck, 
  Users, 
  User, 
  Mail, 
  Phone, 
  ChevronDown, 
  MessageSquare, 
  ArrowRight, 
  MapPin, 
  Car, 
  Train, 
  Navigation, 
  Plus, 
  Minus, 
  ExternalLink,
  Tag,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [mapMode, setMapMode] = useState('studio'); // 'studio' or 'live'
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending your message...');
    
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      subject: e.target.subject.value,
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
        setStatus('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
        e.target.reset();
      } else {
        setStatus('Failed to send message: ' + (data.error || 'Please try again.'));
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const leftFaqs = [
    { 
      id: 'l1',
      q: 'How can I track my order?', 
      a: 'You can easily track your order status live from your account dashboard or through the tracking link sent to your registered email and WhatsApp number after dispatch.' 
    },
    { 
      id: 'l2',
      q: 'What is the return and refund policy?', 
      a: 'We offer a 7-day easy replacement policy for any damaged, defective, or incorrect studio gear delivered. Our support team arranges hassle-free doorstep pickup.' 
    },
    { 
      id: 'l3',
      q: 'Do you offer COD (Cash on Delivery)?', 
      a: 'Yes, Cash on Delivery (COD) is available across major pin codes all over India with no hidden additional fees.' 
    },
    { 
      id: 'l4',
      q: 'How can I get the free courses with bundle purchase?', 
      a: 'As soon as your bundle order is confirmed, lifetime access credentials and course links for all bonus masterclasses are automatically delivered to your email.' 
    }
  ];

  const rightFaqs = [
    { 
      id: 'r1',
      q: 'How long does delivery take?', 
      a: 'Standard delivery across India usually takes 3 to 5 business days depending on your delivery address and city tier.' 
    },
    { 
      id: 'r2',
      q: 'Are your products covered under warranty?', 
      a: 'Yes, all our creator kits, lighting equipment, condenser mics, and heavy-duty tripods come with an official 1-year manufacturer warranty.' 
    },
    { 
      id: 'r3',
      q: 'Can I get a bulk order or business inquiry?', 
      a: 'Yes! For corporate bulk orders, podcast studio setups, schools, or creator academy setups, email us at support@creatorskit.in for custom institutional pricing.' 
    },
    { 
      id: 'r4',
      q: 'How can I contact support on WhatsApp?', 
      a: 'You can click our direct WhatsApp chat link or send a message to +91 98765 43210 for instant creator support and order assistance.' 
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-neutral-900 font-sans selection:bg-[#900606] selection:text-white pb-15">
      
      {/* 1. HERO BANNER SECTION (Strictly Matching Reference Layout) */}
      <section className="relative w-full pt-28 pb-16 md:pt-32 md:pb-20 bg-[#0c0c0c] text-white overflow-hidden">
        {/* Background Visual: Studio photo with creator, neon sign, ring light & gradient overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0c0c0c] pointer-events-none">
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] h-full">
            <Image 
              src="/contact1.png" 
              alt="CreatorsKit Creator Studio" 
              fill 
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 60vw" 
              className="object-cover object-right md:object-center opacity-85" 
            />
            {/* Dark gradient overlay on left for razor-sharp text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/90 md:via-[#0c0c0c]/80 lg:via-[#0c0c0c]/35 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/40 via-transparent to-[#0c0c0c]"></div>
          </div>
          {/* Subtle warm ambient glow */}
          <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[#900606]/15 blur-[130px] rounded-full"></div>
        </div>

        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className="max-w-2xl text-left">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-neutral-500">›</span>
              <span className="text-neutral-300">Contact Us</span>
            </nav>

            {/* Red Pre-heading Label */}
            <p className="text-xs font-bold tracking-[0.2em] text-[#900606] uppercase mb-4">
              WE&apos;RE HERE TO HELP
            </p>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold sm:font-extrabold text-white tracking-tight leading-[1.14] mb-5">
              Let&apos;s Create<br />
              Something Amazing<br />
              <span className="text-[#900606]">Together</span>
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-300 font-normal text-sm sm:text-base leading-relaxed max-w-xl mb-10">
              Have a question about our products, bundles, courses or your order? Our team is always ready to help you on your creator journey.
            </p>

            {/* Quick Checkmark Badges Matching Reference */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2">
              {/* Badge 1: Quick Support */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-red-500/30 bg-red-950/30 text-[#900606] flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5 stroke-[2] text-[#900606]" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm tracking-tight leading-tight">Quick Support</p>
                  <p className="text-neutral-400 text-[11px] sm:text-xs">Get fast answers</p>
                </div>
              </div>

              {/* Badge 2: Trusted & Reliable */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-red-500/30 bg-red-950/30 text-[#900606] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2] text-[#900606]" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm tracking-tight leading-tight">Trusted & Reliable</p>
                  <p className="text-neutral-400 text-[11px] sm:text-xs">100% genuine products</p>
                </div>
              </div>

              {/* Badge 3: Creator First */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-red-500/30 bg-red-950/30 text-[#900606] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 stroke-[2] text-[#900606]" />
                </div>
                <div>
                  <p className="text-white font-bold text-xs sm:text-sm tracking-tight leading-tight">Creator First</p>
                  <p className="text-neutral-400 text-[11px] sm:text-xs">We&apos;re creators too</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-12 sm:mt-16 space-y-8 sm:space-y-10">

        {/* 2. GET IN TOUCH FORM & CONTACT INFORMATION (Clean Individual White Cards) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT: GET IN TOUCH FORM CARD */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 rounded-[2rem] border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
                Get in <span className="text-[#900606]">Touch</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-medium mb-8">
                Fill out the form and our team will get back to you as soon as possible. We usually respond within 24 hours.
              </p>

              {status && (
                <div className={`mb-6 p-4 rounded-2xl text-xs sm:text-sm font-semibold border ${
                  status.includes('successfully') 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Name *"
                      className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3.5 rounded-full text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Your Email *"
                      className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3.5 rounded-full text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none"
                    />
                  </div>
                </div>

                {/* Row 2: Phone and Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone Number"
                      className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3.5 rounded-full text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <Tag className="w-4 h-4" />
                    </span>
                    <select
                      name="subject"
                      required
                      defaultValue=""
                      className="w-full bg-[#FBFBF7] text-neutral-900 pl-11 pr-10 py-3.5 rounded-full text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none cursor-pointer appearance-none"
                    >
                      <option value="" disabled>Select Subject *</option>
                      <option value="Order & Delivery Inquiry">Order & Delivery Inquiry</option>
                      <option value="Product Details & Compatibility">Product Details & Compatibility</option>
                      <option value="Creator Bundle Support">Creator Bundle Support</option>
                      <option value="Free Masterclasses Access">Free Masterclasses Access</option>
                      <option value="Bulk Order / Business Inquiry">Bulk Order / Business Inquiry</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Row 3: Message Textarea */}
                <div className="relative">
                  <span className="absolute left-4 top-4 text-neutral-400 pointer-events-none">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    placeholder="Your Message *"
                    className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3.5 rounded-[1.5rem] text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all resize-none shadow-none"
                  ></textarea>
                </div>

                {/* Submit Button: Pill-shaped Solid Red button matching prompt */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#900606] hover:bg-[#700505] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_8px_20px_rgba(144,6,6,0.3)] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message ➔'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: CONTACT INFORMATION CARD */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-10 lg:p-12 rounded-[2rem] border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
                Contact <span className="text-[#900606]">Information</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-medium mb-8">
                You can also reach us directly through the following channels.
              </p>

              <div className="space-y-6">
                {/* 1. Call Us */}
                <a 
                  href="tel:+919876543210" 
                  className="flex items-start gap-4 p-2 -mx-2 rounded-2xl hover:bg-neutral-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2] group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Call Us</p>
                    <p className="font-bold text-neutral-900 text-base group-hover:text-[#900606] transition-colors">
                      +91 98765 43210
                    </p>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">Mon – Sat, 10:00 AM – 7:00 PM</p>
                  </div>
                </a>

                {/* 2. Email Us */}
                <a 
                  href="mailto:support@creatorskit.in" 
                  className="flex items-start gap-4 p-2 -mx-2 rounded-2xl hover:bg-neutral-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2] group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Email Us</p>
                    <p className="font-bold text-neutral-900 text-base group-hover:text-[#900606] transition-colors">
                      support@creatorskit.in
                    </p>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">We usually respond within 24 hours.</p>
                  </div>
                </a>

                {/* 3. WhatsApp Support */}
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start gap-4 p-2 -mx-2 rounded-2xl hover:bg-neutral-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2] group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">WhatsApp Support</p>
                    <p className="font-bold text-neutral-900 text-base group-hover:text-[#900606] transition-colors">
                      +91 98765 43210
                    </p>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">Chat with us for quick help</p>
                  </div>
                </a>

                {/* 4. Our Office */}
                <div className="flex items-start gap-4 p-2 -mx-2 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2]">
                    <MapPin className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Our Office</p>
                    <p className="font-bold text-neutral-900 text-base">New Delhi, India</p>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5 leading-relaxed">
                      A-123, Creator Hub, Sector 62, Noida, Uttar Pradesh 201309
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* 3. OUR LOCATION SECTION (No Bulky Wrapper Cards - Blends Directly with #FBFBF7) */}
        <section className="w-full">
          <div className="mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Our <span className="text-[#900606]">Location</span>
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-1">
              Visit our office or find us on the map.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* LEFT: MAP DISPLAY CARD */}
            <div className="lg:col-span-7 rounded-[2rem] overflow-hidden border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white relative flex flex-col justify-between min-h-[360px] sm:min-h-[400px]">
  {/* Map View */}
  <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden">
    <iframe 
      title="CreatorsKit Office Google Map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562304192663!2d77.35987627549887!3d28.627885075667375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5456ef36d9f%3A0x3b7191b12861362!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
      width="100%" 
      height="100%" 
      style={{ border: 0, transform: `scale(${zoomLevel})` }} 
      allowFullScreen="" 
      loading="lazy"
      className="w-full h-full transition-transform duration-300"
    ></iframe>

    {/* Floating Map Controls & Overlays */}
    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-full border border-neutral-200/80 shadow-md text-xs font-semibold">
      <button
        type="button"
        onClick={() => setMapMode('studio')}
        className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
          mapMode === 'studio' 
            ? 'bg-[#900606] text-white shadow-sm' 
            : 'text-neutral-600 hover:text-neutral-900'
        }`}
      >
        Studio Map
      </button>
      <button
        type="button"
        onClick={() => setMapMode('live')}
        className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
          mapMode === 'live' 
            ? 'bg-[#900606] text-white shadow-sm' 
            : 'text-neutral-600 hover:text-neutral-900'
        }`}
      >
        Live Google Map
      </button>
    </div>

    {/* Zoom Controls on Right */}
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-neutral-200/80 shadow-md">
      <button
        type="button"
        title="Zoom in"
        onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        type="button"
        title="Zoom out"
        onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 1))}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
    </div>

    {/* Google Maps Directions Link */}
    <a
      href="https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#900606] text-xs font-bold px-3.5 py-2 rounded-full border border-neutral-200/80 shadow-md hover:bg-neutral-50 transition-all"
    >
      <span>Open Directions</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  </div>
</div>

            {/* RIGHT: OFFICE PHOTO & 3 PILL CARDS */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              {/* Office Image */}
              <div className="relative w-full h-[230px] sm:h-[260px] rounded-[2rem] overflow-hidden border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-neutral-900 group">
                <Image 
                  src="/contact.png" 
                  alt="CreatorsKit Noida Office" 
                  fill 
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw" 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
              </div>

              {/* 3 Individual White Perk Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {/* 1. Easy to Reach */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center mb-1.5 border border-[#FFE2E2]">
                    <Navigation className="w-4 h-4 stroke-[2]" />
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-neutral-900 tracking-tight">Easy to Reach</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Located in Noida</p>
                </div>

                {/* 2. Parking Available */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center mb-1.5 border border-[#FFE2E2]">
                    <Car className="w-4 h-4 stroke-[2]" />
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-neutral-900 tracking-tight">Parking Available</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Hassle-free spot</p>
                </div>

                {/* 3. Metro Friendly */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center mb-1.5 border border-[#FFE2E2]">
                    <Train className="w-4 h-4 stroke-[2]" />
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-neutral-900 tracking-tight">Metro Friendly</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Close to Sector 62</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. FREQUENTLY ASKED QUESTIONS SECTION (Clean 2-Column Accordion Layout directly on #FBFBF7) */}
        <section className="w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Frequently Asked <span className="text-[#900606]">Questions</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-1">
                Find answers to the most common questions. Can&apos;t find what you&apos;re looking for? Contact us.
              </p>
            </div>
            
            <Link 
              href="/faq" 
              className="inline-flex items-center gap-1.5 text-[#900606] hover:text-[#7a0505] font-bold text-xs sm:text-sm border border-neutral-200/90 bg-white hover:bg-neutral-50 px-5 py-2.5 rounded-full shadow-sm transition-all shrink-0 hover:scale-[1.02]"
            >
              <span>View All FAQs</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          {/* 2-Column FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            
            {/* Left Column (4 FAQs) */}
            <div className="space-y-4">
              {leftFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer transition-all hover:border-neutral-300"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-neutral-900 text-xs sm:text-sm">
                        {faq.q}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600 shrink-0">
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-[#900606] stroke-[2.5]" />
                        ) : (
                          <Plus className="w-4 h-4 text-neutral-500 stroke-[2]" />
                        )}
                      </span>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-neutral-600 text-xs sm:text-sm font-normal mt-3 pt-3 border-t border-neutral-100 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Column (4 FAQs) */}
            <div className="space-y-4">
              {rightFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer transition-all hover:border-neutral-300"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-neutral-900 text-xs sm:text-sm">
                        {faq.q}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600 shrink-0">
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-[#900606] stroke-[2.5]" />
                        ) : (
                          <Plus className="w-4 h-4 text-neutral-500 stroke-[2]" />
                        )}
                      </span>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-neutral-600 text-xs sm:text-sm font-normal mt-3 pt-3 border-t border-neutral-100 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}