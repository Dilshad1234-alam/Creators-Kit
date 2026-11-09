'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imagekit';
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

const defaultContactContent = {
  hero: {
    badge: "WE'RE HERE TO HELP",
    title: "Let's Create",
    highlight: "Something Amazing Together",
    description: "Have a question about our products, bundles, courses or your order? Our team is always ready to help you on your creator journey.",
    image: "/contact1.png",
    badges: [
      { icon: 'Headphones', title: 'Quick Support', subtitle: 'Get fast answers', order: 1 },
      { icon: 'ShieldCheck', title: 'Trusted & Reliable', subtitle: '100% genuine products', order: 2 },
      { icon: 'Users', title: 'Creator First', subtitle: "We're creators too", order: 3 }
    ]
  },
  channels: {
    formTitle: "Get in",
    formHighlight: "Touch",
    formSubtitle: "Fill out the form and our team will get back to you as soon as possible. We usually respond within 24 hours.",
    infoTitle: "Contact",
    infoHighlight: "Information",
    infoSubtitle: "You can also reach us directly through the following channels.",
    phone: {
      title: "Call Us",
      number: "+91 98765 43210",
      timings: "Mon – Sat, 10:00 AM – 7:00 PM"
    },
    email: {
      title: "Email Us",
      address: "support@creatorskit.in",
      note: "We usually respond within 24 hours."
    },
    whatsapp: {
      title: "WhatsApp Support",
      number: "+91 98765 43210",
      note: "Chat with us for quick help"
    },
    office: {
      title: "Our Office",
      city: "New Delhi, India",
      fullAddress: "A-123, Creator Hub, Sector 62, Noida, Uttar Pradesh 201309"
    }
  },
  location: {
    title: "Our",
    highlight: "Location",
    subtitle: "Visit our office or find us on the map.",
    mapAddress: "Sector 62, Noida, Uttar Pradesh 201309",
    mapEmbedUrl: "https://maps.google.com/maps?q=Sector+62+Noida+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh",
    officeImage: "/contact.png",
    perks: [
      { icon: 'Navigation', title: 'Easy to Reach', subtitle: 'Located in Noida', order: 1 },
      { icon: 'Car', title: 'Parking Spot', subtitle: 'Hassle-free parking', order: 2 },
      { icon: 'Train', title: 'Metro Friendly', subtitle: 'Near Sector 62', order: 3 }
    ]
  },
  faqs: {
    title: "Frequently Asked",
    highlight: "Questions",
    subtitle: "Find answers to the most common questions. Can't find what you're looking for? Contact us.",
    ctaText: "View All FAQs",
    ctaLink: "/faq",
    items: [
      { 
        question: 'How can I track my order?', 
        answer: 'You can easily track your order status live from your account dashboard or through the tracking link sent to your registered email and WhatsApp number after dispatch.',
        category: 'Orders',
        order: 1
      },
      { 
        question: 'What is the return and refund policy?', 
        answer: 'We offer a 7-day easy replacement policy for any damaged, defective, or incorrect studio gear delivered. Our support team arranges hassle-free doorstep pickup.',
        category: 'Orders',
        order: 2
      },
      { 
        question: 'Do you offer COD (Cash on Delivery)?', 
        answer: 'Yes, Cash on Delivery (COD) is available across major pin codes all over India with no hidden additional fees.',
        category: 'Payments',
        order: 3
      },
      { 
        question: 'How can I get the free courses with bundle purchase?', 
        answer: 'As soon as your bundle order is confirmed, lifetime access credentials and course links for all bonus masterclasses are automatically delivered to your email.',
        category: 'Courses',
        order: 4
      },
      { 
        question: 'How long does delivery take?', 
        answer: 'Standard delivery across India usually takes 3 to 5 business days depending on your delivery address and city tier.',
        category: 'Shipping',
        order: 5
      },
      { 
        question: 'Are your products covered under warranty?', 
        answer: 'Yes, all our creator kits, lighting equipment, condenser mics, and heavy-duty tripods come with an official 1-year manufacturer warranty.',
        category: 'Warranty',
        order: 6
      },
      { 
        question: 'Can I get a bulk order or business inquiry?', 
        answer: 'Yes! For corporate bulk orders, podcast studio setups, schools, or creator academy setups, email us at support@creatorskit.in for custom institutional pricing.',
        category: 'Business',
        order: 7
      },
      { 
        question: 'How can I contact support on WhatsApp?', 
        answer: 'You can click our direct WhatsApp chat link or send a message to +91 98765 43210 for instant creator support and order assistance.',
        category: 'Support',
        order: 8
      }
    ]
  }
};

export default function ContactPage() {
  const [content, setContent] = useState(defaultContactContent);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [mapMode, setMapMode] = useState('studio'); // 'studio' or 'live'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchContent();

    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/contact-content');
      const json = await res.json();
      if (json.success && json.data) {
        setContent(json.data);
      }
    } catch (err) {
      console.error('Failed to load contact content, fallback to default:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');
    
    const form = e.currentTarget;
    const formData = {
      name: form.elements.name?.value?.trim() || '',
      email: form.elements.email?.value?.trim() || '',
      phone: form.elements.phone?.value?.trim() || '',
      subject: form.elements.subject?.value?.trim() || '',
      message: form.elements.message?.value?.trim() || '',
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
        form.reset();
      } else {
        setStatus('Failed to send message: ' + (data.error || 'Please try again.'));
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('Failed to send message. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (id) => {
    setOpenFaq(prev => prev === id ? null : id);
  };

  const renderDynamicIcon = (name, className = 'w-4 h-4 sm:w-5 sm:h-5 stroke-[2]') => {
    switch (name) {
      case 'Headphones':
        return <Headphones className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Navigation':
        return <Navigation className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Train':
        return <Train className={className} />;
      case 'Phone':
        return <Phone className={className} />;
      case 'Mail':
        return <Mail className={className} />;
      case 'MapPin':
        return <MapPin className={className} />;
      default:
        return <Headphones className={className} />;
    }
  };

  const heroData = content?.hero || defaultContactContent.hero;
  const channelsData = content?.channels || defaultContactContent.channels;
  const locationData = content?.location || defaultContactContent.location;
  const faqData = content?.faqs || defaultContactContent.faqs;

  const heroBadges = heroData.badges && heroData.badges.length > 0
    ? [...heroData.badges].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : defaultContactContent.hero.badges;

  const locationPerks = locationData.perks && locationData.perks.length > 0
    ? [...locationData.perks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : defaultContactContent.location.perks;

  const allFaqs = faqData.items && faqData.items.length > 0
    ? [...faqData.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : defaultContactContent.faqs.items;

  const midPoint = Math.ceil(allFaqs.length / 2);
  const leftFaqs = allFaqs.slice(0, midPoint);
  const rightFaqs = allFaqs.slice(midPoint);

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen bg-[#FBFBF7] text-neutral-900 font-sans selection:bg-[#900606] selection:text-white pb-12 sm:pb-16 pt-16 sm:pt-20"
      style={headerHeight ? { paddingTop: `${headerHeight}px` } : undefined}
    >
      
      {/* 1. HERO BANNER SECTION (Single Banner Image matching Live Sale Banner Size) */}
      <section className="relative w-full overflow-hidden bg-[#0a0a0a] mb-2 sm:mb-4">
        <div className="w-full relative z-8 max-w-[3000px] mx-auto">
          <div className="relative w-full aspect-[1023/370] min-h-[190px] xs:min-h-[240px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[480px] xl:min-h-[540px] overflow-hidden bg-[#0a0a0a]">
            <Image
              src="/img-kit17.png"
              alt="Creators Kit Contact Us"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-2.5 sm:mt-6 md:mt-10 space-y-4 sm:space-y-8 md:space-y-10">

        {/* 2. GET IN TOUCH FORM & CONTACT INFORMATION (Clean Individual White Cards) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT: GET IN TOUCH FORM CARD */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[2rem] border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1.5 sm:mb-2 tracking-tight">
                {channelsData.formTitle || 'Get in'}{' '}
                <span className="text-[#900606]">{channelsData.formHighlight || 'Touch'}</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-medium mb-5 sm:mb-8">
                {channelsData.formSubtitle || 'Fill out the form and our team will get back to you as soon as possible. We usually respond within 24 hours.'}
              </p>

              {status && (
                <div className={`mb-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold border ${
                  status.includes('successfully') 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
                {/* Row 1: Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Name *"
                      className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none"
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
                      className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none"
                    />
                  </div>
                </div>

                {/* Row 2: Phone and Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone Number"
                      className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none"
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
                      className="w-full bg-[#FBFBF7] text-neutral-900 pl-11 pr-10 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all shadow-none cursor-pointer appearance-none"
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
                    rows="4"
                    placeholder="Your Message *"
                    className="w-full bg-[#FBFBF7] text-neutral-900 placeholder-neutral-400 pl-11 pr-5 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-medium outline-none border border-neutral-200/80 focus:border-[#900606] focus:bg-white transition-all resize-none shadow-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full py-3.5 sm:py-4 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-xs sm:text-sm tracking-wide overflow-hidden group/btn transition-all duration-300 shadow-sm disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                    <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                      <span>{isSubmitting ? 'Sending...' : 'Send Message ➔'}</span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: CONTACT INFORMATION CARD */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[2rem] border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1.5 sm:mb-2 tracking-tight">
                {channelsData.infoTitle || 'Contact'}{' '}
                <span className="text-[#900606]">{channelsData.infoHighlight || 'Information'}</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                {channelsData.infoSubtitle || 'You can also reach us directly through the following channels.'}
              </p>

              <div className="space-y-4 sm:space-y-6">
                {/* 1. Call Us */}
                {channelsData.phone?.number && (
                  <a 
                    href={`tel:${channelsData.phone.number.replace(/\s+/g, '')}`} 
                    className="flex items-start gap-3 sm:gap-4 p-2 rounded-2xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2] group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                        {channelsData.phone.title || 'Call Us'}
                      </p>
                      <p className="font-bold text-neutral-900 text-sm sm:text-base group-hover:text-[#900606] transition-colors">
                        {channelsData.phone.number}
                      </p>
                      {channelsData.phone.timings && (
                        <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
                          {channelsData.phone.timings}
                        </p>
                      )}
                    </div>
                  </a>
                )}

                {/* 2. Email Us */}
                {channelsData.email?.address && (
                  <a 
                    href={`mailto:${channelsData.email.address}`} 
                    className="flex items-start gap-3 sm:gap-4 p-2 rounded-2xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2] group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                        {channelsData.email.title || 'Email Us'}
                      </p>
                      <p className="font-bold text-neutral-900 text-sm sm:text-base group-hover:text-[#900606] transition-colors">
                        {channelsData.email.address}
                      </p>
                      {channelsData.email.note && (
                        <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
                          {channelsData.email.note}
                        </p>
                      )}
                    </div>
                  </a>
                )}

                {/* 3. WhatsApp Support */}
                {channelsData.whatsapp?.number && (
                  <a 
                    href={`https://wa.me/${channelsData.whatsapp.number.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-start gap-3 sm:gap-4 p-2 rounded-2xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2] group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                        {channelsData.whatsapp.title || 'WhatsApp Support'}
                      </p>
                      <p className="font-bold text-neutral-900 text-sm sm:text-base group-hover:text-[#900606] transition-colors">
                        {channelsData.whatsapp.number}
                      </p>
                      {channelsData.whatsapp.note && (
                        <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
                          {channelsData.whatsapp.note}
                        </p>
                      )}
                    </div>
                  </a>
                )}

                {/* 4. Our Office */}
                {channelsData.office && (
                  <div className="flex items-start gap-3 sm:gap-4 p-2 rounded-2xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center shrink-0 border border-[#FFE2E2]">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                        {channelsData.office.title || 'Our Office'}
                      </p>
                      <p className="font-bold text-neutral-900 text-sm sm:text-base">
                        {channelsData.office.city || 'New Delhi, India'}
                      </p>
                      <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5 leading-relaxed">
                        {channelsData.office.fullAddress || 'A-123, Creator Hub, Sector 62, Noida, Uttar Pradesh 201309'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </section>

        {/* 3. OUR LOCATION SECTION (No Bulky Wrapper Cards - Blends Directly with #FBFBF7) */}
        <section className="w-full">
          <div className="mb-2 sm:mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {locationData.title || 'Our'}{' '}
              <span className="text-[#900606]">{locationData.highlight || 'Location'}</span>
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-0.5 sm:mt-1">
              {locationData.subtitle || 'Visit our office or find us on the map.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
            
            {/* LEFT: MAP DISPLAY CARD */}
            <div className="lg:col-span-7 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white relative flex flex-col justify-between min-h-[280px] sm:min-h-[380px]">
              {/* Map View */}
              <div className="relative w-full h-[280px] sm:h-[380px] overflow-hidden">
                <iframe 
                  title="CreatorsKit Office Google Map"
                  src={
                    locationData.mapEmbedUrl || 
                    `https://maps.google.com/maps?q=${encodeURIComponent(locationData.mapAddress || 'Sector 62, Noida, Uttar Pradesh')}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                  } 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, transform: `scale(${zoomLevel})` }} 
                  allowFullScreen="" 
                  loading="lazy"
                  className="w-full h-full transition-transform duration-300"
                ></iframe>

                {/* Floating Map Controls & Overlays */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-full border border-neutral-200/80 shadow-md text-[11px] sm:text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMapMode('studio')}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${
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
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${
                      mapMode === 'live' 
                        ? 'bg-[#900606] text-white shadow-sm' 
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Live Google Map
                  </button>
                </div>

                {/* Zoom Controls on Right */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-neutral-200/80 shadow-md">
                  <button
                    type="button"
                    title="Zoom in"
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    type="button"
                    title="Zoom out"
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 1))}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Google Maps Directions Link */}
                <a
                  href={
                    locationData.directionsUrl || 
                    `https://maps.google.com/?q=${encodeURIComponent(locationData.mapAddress || 'Sector 62 Noida Uttar Pradesh')}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#900606] text-[11px] sm:text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-neutral-200/80 shadow-md hover:bg-neutral-50 transition-all"
                >
                  <span>Open Directions</span>
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              </div>
            </div>

            {/* RIGHT: OFFICE PHOTO & 3 PILL CARDS */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
              {/* Office Image */}
              <div className="relative w-full h-[190px] sm:h-[230px] lg:h-[260px] rounded-2xl sm:rounded-[2rem] overflow-hidden border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-neutral-900 group">
                <Image 
                  src={getImageUrl(locationData.officeImage || '/contact.png')} 
                  alt="CreatorsKit Office" 
                  fill 
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw" 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
              </div>

              {/* Individual White Perk Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                {locationPerks.map((perk, idx) => (
                  <div 
                    key={perk._id || idx}
                    className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-200/80 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFF1F1] text-[#900606] flex items-center justify-center mb-1 border border-[#FFE2E2]">
                      {renderDynamicIcon(perk.icon, 'w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]')}
                    </div>
                    <p className="font-bold text-[11px] sm:text-xs md:text-sm text-neutral-900 tracking-tight leading-tight">
                      {perk.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium mt-0.5 leading-tight">
                      {perk.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. FREQUENTLY ASKED QUESTIONS SECTION */}
        <section className="w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                {faqData.title || 'Frequently Asked'}{' '}
                <span className="text-[#900606]">{faqData.highlight || 'Questions'}</span>
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm font-medium mt-1">
                {faqData.subtitle || "Find answers to the most common questions. Can't find what you're looking for? Contact us."}
              </p>
            </div>
            
            <Link 
              href={faqData.ctaLink || '/faq'} 
              className="inline-flex items-center gap-1.5 text-[#900606] hover:text-[#7a0505] font-bold text-xs sm:text-sm border border-neutral-200/90 bg-white hover:bg-neutral-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-sm transition-all shrink-0 hover:scale-[1.02]"
            >
              <span>{faqData.ctaText || 'View All FAQs'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          {/* 2-Column FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
            
            {/* Left Column */}
            <div className="space-y-3">
              {leftFaqs.map((faq, idx) => {
                const faqId = faq._id || `left-${idx}`;
                const isOpen = openFaq === faqId;
                return (
                  <div 
                    key={faqId} 
                    className="w-full bg-white border border-neutral-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer transition-all hover:border-neutral-300"
                    onClick={() => toggleFaq(faqId)}
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      <span className="font-semibold text-neutral-900 text-xs sm:text-sm leading-snug">
                        {faq.question}
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
                          <p className="text-neutral-600 text-xs sm:text-sm font-normal mt-2.5 pt-2.5 border-t border-neutral-100 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {rightFaqs.map((faq, idx) => {
                const faqId = faq._id || `right-${idx}`;
                const isOpen = openFaq === faqId;
                return (
                  <div 
                    key={faqId} 
                    className="w-full bg-white border border-neutral-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer transition-all hover:border-neutral-300"
                    onClick={() => toggleFaq(faqId)}
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      <span className="font-semibold text-neutral-900 text-xs sm:text-sm leading-snug">
                        {faq.question}
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
                          <p className="text-neutral-600 text-xs sm:text-sm font-normal mt-2.5 pt-2.5 border-t border-neutral-100 leading-relaxed">
                            {faq.answer}
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
