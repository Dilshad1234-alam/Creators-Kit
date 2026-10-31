'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { getImageUrl } from '@/lib/imagekit';
import {
  Diamond,
  GraduationCap,
  Users,
  Headphones,
  ShoppingCart,
  BookOpen,
  Star,
  Box,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award,
} from 'lucide-react';

// Default initial state fallback ensuring instant render without empty states
const defaultAboutContent = {
  hero: {
    badge: 'OUR STORY',
    title: 'Empowering Creators Across',
    highlight: 'India',
    description:
      'At CreatorsKit, we believe everyone has a story to tell. Our mission is to equip creators with the right tools, knowledge and support to turn their passion into a profession.',
    ctaText: 'Shop Our Kits',
    ctaLink: '/product',
    image: '/about5.png',
    features: [
      { text: 'Premium Quality Products', icon: 'Diamond' },
      { text: 'Free Expert Courses', icon: 'GraduationCap' },
      { text: 'Creator Community', icon: 'Users' },
      { text: 'Dedicated Support', icon: 'Headphones' },
    ],
  },
  mission: {
    badge: 'OUR MISSION',
    title: 'To Create More and',
    highlight: 'More Creators',
    suffix: 'Across India',
    description:
      'We aim to make content creation simple, accessible and affordable for everyone. By providing high-quality creator kits, practical courses and a supportive community, we help individuals start, grow and succeed on platforms like Instagram, YouTube and beyond.',
    image: '/about2.png',
  },
  vision: {
    badge: 'OUR VISION',
    title: 'A Creator in',
    highlight: 'Every Home',
    description:
      'We envision a future where content creation becomes a mainstream career choice in India — where anyone, from any background or city, can start creating, share their talent with the world and build a successful career.',
    ctaText: 'Know Our Journey',
    ctaLink: '/contact',
    image: '/about1.png',
  },
  ctaBanner: {
    title: 'Join Our Growing',
    highlight: 'Creator Community',
    description:
      'Get the latest updates, tips, exclusive offers and be part of a community that supports creators across India.',
    ctaText: 'Join Now',
    ctaLink: '/contact',
    image: '/about4.png',
  },
  stats: [
    { value: '50,000+', label: 'Happy Creators', icon: 'Users', order: 1 },
    { value: '10,000+', label: 'Products Delivered', icon: 'Box', order: 2 },
    { value: '500+', label: 'Students Trained', icon: 'GraduationCap', order: 3 },
    { value: '4.8/5', label: 'Customer Rating', icon: 'Star', order: 4 },
  ],
  whyChoose: {
    title: 'Why Creators Choose',
    highlight: 'CreatorsKit?',
    subtitle: "We're more than just an online store. We're a complete ecosystem for creators.",
    cards: [
      {
        title: 'Curated Creator Kits',
        desc: 'High-quality, genuine products selected for creators.',
        icon: 'ShoppingCart',
        order: 1,
      },
      {
        title: 'Free Premium Courses',
        desc: 'Learn Instagram, YouTube, Video Editing and more with bundle purchases.',
        icon: 'BookOpen',
        order: 2,
      },
      {
        title: 'Supportive Community',
        desc: 'Be part of a growing community of creators across India.',
        icon: 'Users',
        order: 3,
      },
      {
        title: 'Expert Support',
        desc: 'Our team is always here to help you at every step of your journey.',
        icon: 'Headphones',
        order: 4,
      },
    ],
  },
  timeline: {
    title: 'Our',
    highlight: 'Story',
    subtitle: "From a small idea to a growing community of creators — here's how CreatorsKit came to life.",
    ctaText: 'Read More',
    ctaLink: '/contact',
    milestones: [
      {
        year: '2022',
        title: 'The Beginning',
        desc: 'We started with a simple mission — to help creators get the right tools at affordable prices.',
        order: 1,
      },
      {
        year: '2023',
        title: 'Building the Community',
        desc: 'Launched our creator bundles and free courses.',
        order: 2,
      },
      {
        year: '2024',
        title: 'Growing Together',
        desc: 'Reached 50,000+ happy creators across India.',
        order: 3,
      },
      {
        year: '2025',
        title: 'Bigger Vision',
        desc: 'Continuing our journey to create more and more creators in every city and town.',
        order: 4,
      },
    ],
  },
  team: {
    title: 'Meet',
    highlight: 'Our Team',
    subtitle: 'A passionate team working to empower creators across India.',
    members: [
      {
        name: 'Manish Kumar',
        role: 'Founder & CEO',
        desc: 'Building a creator-friendly India.',
        image: '/team/manish.jpg',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 1,
      },
      {
        name: 'Priya Sharma',
        role: 'Product & Community',
        desc: 'Connecting and growing our creator community.',
        image: '/team/priya.jpg',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 2,
      },
      {
        name: 'Rahul Verma',
        role: 'Marketing & Growth',
        desc: 'Helping creators reach new heights.',
        image: '/team/rahul.jpg',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 3,
      },
      {
        name: 'Ankit Singh',
        role: 'Operations & Support',
        desc: 'Ensuring the best experience for our creators.',
        image: '/team/ankit.png',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 4,
      },
    ],
  },
};

function renderDynamicIcon(iconName, className = 'w-5 h-5') {
  switch (iconName?.toLowerCase()) {
    case 'users':
      return <Users className={className} />;
    case 'box':
      return <Box className={className} />;
    case 'graduationcap':
      return <GraduationCap className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'shoppingcart':
      return <ShoppingCart className={className} />;
    case 'bookopen':
      return <BookOpen className={className} />;
    case 'headphones':
      return <Headphones className={className} />;
    case 'diamond':
      return <Diamond className={className} />;
    case 'award':
      return <Award className={className} />;
    default:
      return <Star className={className} />;
  }
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState(defaultAboutContent);

  // Fetch dynamic About Us data from MongoDB on mount
  useEffect(() => {
    setMounted(true);

    const loadAboutData = async () => {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setContent(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic about data:', err);
      }
    };

    loadAboutData();
  }, []);

  const teamList = content?.team?.members && content.team.members.length > 0
    ? [...content.team.members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : defaultAboutContent.team.members;

  // Embla Carousel for Team on Mobile
  const [mobileTeamRef, mobileTeamEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollTeamNext = useCallback(() => {
    if (mobileTeamEmbla) mobileTeamEmbla.scrollNext();
  }, [mobileTeamEmbla]);

  const scrollTeamPrev = useCallback(() => {
    if (mobileTeamEmbla) mobileTeamEmbla.scrollPrev();
  }, [mobileTeamEmbla]);

  const mobileTeamList = teamList && teamList.length > 0
    ? (teamList.length <= 4 ? [...teamList, ...teamList, ...teamList] : teamList)
    : [];

  const milestonesList = content?.timeline?.milestones && content.timeline.milestones.length > 0
    ? [...content.timeline.milestones].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : defaultAboutContent.timeline.milestones;

  const statsList = content?.stats && content.stats.length > 0
    ? [...content.stats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : defaultAboutContent.stats;

  const whyChooseCards = content?.whyChoose?.cards && content.whyChoose.cards.length > 0
    ? [...content.whyChoose.cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : defaultAboutContent.whyChoose.cards;

  const heroData = content?.hero || defaultAboutContent.hero;
  const missionData = content?.mission || defaultAboutContent.mission;
  const visionData = content?.vision || defaultAboutContent.vision;
  const ctaBannerData = content?.ctaBanner || defaultAboutContent.ctaBanner;
  const teamMeta = content?.team || defaultAboutContent.team;
  const timelineMeta = content?.timeline || defaultAboutContent.timeline;
  const whyChooseMeta = content?.whyChoose || defaultAboutContent.whyChoose;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FBFBF7] text-neutral-900 font-sans selection:bg-[#900606] selection:text-white pb-0">
      <main className="w-full flex flex-col">

        {/* 1. HERO SECTION (Dark Full-Width Banner with dynamic data) */}
        <section className="relative w-full text-white pt-30 sm:pt-34 pb-2.5 sm:pb-6 md:py-20 overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 w-full h-full z-0">
            <Image 
              src={getImageUrl(heroData.image || '/about5.png')} 
              alt={heroData.title || 'Empowering Creators Across India'} 
              fill 
              unoptimized
              priority
              sizes="100vw" 
              className="object-cover object-center" 
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/35"></div>
          </div>

          <div className="max-w-[1750px] w-full pt-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium mb-3 sm:mb-5">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-neutral-400">›</span>
              <span className="text-white font-semibold">About Us</span>
            </nav>

            <div className="max-w-xl text-left py-1 sm:py-3">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="w-5 h-[2px] bg-red-500"></span>
                <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
                  {heroData.badge || 'OUR STORY'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[3.2rem] font-bold text-white tracking-tight leading-[1.15] mb-3">
                {heroData.title}{' '}
                {heroData.highlight && (
                  <span className="text-red-500 font-extrabold">{heroData.highlight}</span>
                )}
              </h1>

              <p className="text-neutral-200 font-normal text-xs sm:text-sm leading-relaxed mb-5 max-w-lg">
                {heroData.description}
              </p>

              <div>
                <Link 
                  href={heroData.ctaLink || '/product'} 
                  className="relative inline-flex items-center justify-center gap-2.5 bg-white text-[#111827] border-2 border-neutral-200 font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-xl overflow-hidden group/btn transition-all duration-300 shadow-sm"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    <span>{heroData.ctaText || 'Shop Our Kits'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Badges Row at the bottom with comfortable padding */}
          <div className="max-w-[1750px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-3 sm:pt-6 mt-2.5 sm:mt-4 border-t border-white/20 pb-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-200 font-medium">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Diamond className="w-4 h-4 text-white stroke-[1.8] shrink-0" />
                <span className="leading-tight">Premium Quality Products</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <GraduationCap className="w-4 h-4 text-white stroke-[1.8] shrink-0" />
                <span className="leading-tight">Free Expert Courses</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Users className="w-4 h-4 text-white stroke-[1.8] shrink-0" />
                <span className="leading-tight">Creator Community</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Headphones className="w-4 h-4 text-white stroke-[1.8] shrink-0" />
                <span className="leading-tight">Dedicated Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. OUR MISSION SECTION */}
        <section className="w-full pt-2 pb-3 sm:py-4 md:py-6">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left Column: Image */}
            <div className="lg:col-span-6 relative w-full h-[240px] sm:h-[340px] lg:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 shadow-sm bg-neutral-100 group">
              <Image 
                src={getImageUrl(missionData.image || '/about2.png')} 
                alt={missionData.title || 'Our Mission'} 
                fill 
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw" 
                className="object-cover object-center" 
              />
            </div>

            {/* Right Column: Mission Content */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-left">
              <div className="flex items-center gap-3">
                <span className="w-5 h-[2px] bg-[#900606]"></span>
                <span className="text-xs font-bold tracking-widest text-[#900606] uppercase">
                  {missionData.badge || 'OUR MISSION'}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-neutral-900 leading-[1.2] tracking-tight">
                {missionData.title}{' '}
                {missionData.highlight && (
                  <span className="text-[#900606]">{missionData.highlight}</span>
                )}{' '}
                {missionData.suffix || ''}
              </h2>

              <p className="text-neutral-600 font-normal text-xs sm:text-sm md:text-base leading-relaxed pt-1 sm:pt-3">
                {missionData.description}
              </p>
            </div>
          </div>
        </section>

        {/* 3. STATS BAR SECTION */}
        <section className="w-full bg-[#FBFBF7] border-y border-neutral-200/80 py-2.5 sm:py-4 md:py-5">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-center">
              {statsList.map((st, idx) => (
                <div key={st._id || idx} className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#900606]/10 text-[#900606] flex items-center justify-center shrink-0">
                    {renderDynamicIcon(st.icon, 'w-5 h-5 sm:w-6 sm:h-6 stroke-[2]')}
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight leading-none mb-1">
                      {st.value}
                    </p>
                    <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 font-medium">
                      {st.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. OUR VISION SECTION */}
        <section className="w-full pt-2 pb-1 sm:pt-4 sm:pb-3 md:pt-6 md:pb-2">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Vision Content */}
            <div className="lg:col-span-6 space-y-2 sm:space-y-4 text-left order-2 lg:order-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="w-5 h-[2px] bg-[#900606]"></span>
                <span className="text-xs font-bold tracking-widest text-[#900606] uppercase">
                  {visionData.badge || 'OUR VISION'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-neutral-900 leading-[1.2] tracking-tight">
                {visionData.title}{' '}
                {visionData.highlight && (
                  <span className="text-[#900606]">{visionData.highlight}</span>
                )}
              </h2>

              <p className="text-neutral-600 font-normal text-xs sm:text-sm md:text-base leading-relaxed pt-0.5 mb-2 sm:mb-5 max-w-xl">
                {visionData.description}
              </p>

              <div>
                <Link
                  href={visionData.ctaLink || '/contact'}
                  className="relative inline-flex items-center justify-center gap-2 bg-white text-[#111827] border-2 border-neutral-200 font-bold text-xs sm:text-sm px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl overflow-hidden group/btn transition-all duration-300 shadow-sm"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    <span>{visionData.ctaText || 'Know Our Journey'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-6 relative w-full h-[220px] sm:h-[320px] lg:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 shadow-sm bg-neutral-100 group order-1 lg:order-2">
              <Image 
                src={getImageUrl(visionData.image || '/about1.png')} 
                alt={visionData.title || 'Our Vision'} 
                fill 
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw" 
                className="object-cover object-center" 
              />
            </div>

          </div>
        </section>

        {/* 5. WHY CREATORS CHOOSE CREATORSKIT SECTION */}
        <section className="w-full pt-2 pb-2 sm:pt-4 sm:pb-4 md:pt-4 md:pb-3">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
            
            <div className="max-w-3xl mx-auto mb-2.5 sm:mb-5">
              <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-neutral-900 tracking-tight">
                {whyChooseMeta.title}{' '}
                {whyChooseMeta.highlight && (
                  <span className="text-[#900606]">{whyChooseMeta.highlight}</span>
                )}
              </h2>
              <p className="text-neutral-600 text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2.5 font-normal">
                {whyChooseMeta.subtitle}
              </p>
            </div>

            {/* Dynamic Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pb-0">
              {whyChooseCards.map((card, idx) => (
                <div 
                  key={card._id || idx}
                  className="w-full mx-auto bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 text-left shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Circular red badge */}
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#900606]/10 text-[#900606] flex items-center justify-center mb-3 sm:mb-5 shadow-[0_0_20px_rgba(144,6,6,0.1)] ring-4 ring-[#900606]/10 group-hover:scale-105 transition-transform duration-300">
                      {renderDynamicIcon(card.icon, 'w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]')}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-1.5 sm:mb-2 tracking-tight">
                      {card.title}
                    </h3>

                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 6. OUR STORY TIMELINE SECTION */}
        <section className="w-full pt-3 pb-3 sm:pt-5 sm:pb-4 md:pt-6 md:pb-3 border-t border-neutral-200/70">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-16 items-start">
              
              {/* Left Column: Heading & CTA */}
              <div className="lg:col-span-5 text-left pt-0.5">
                <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-neutral-900 tracking-tight leading-[1.2] mb-2 sm:mb-3">
                  {timelineMeta.title}{' '}
                  {timelineMeta.highlight && (
                    <span className="text-[#900606]">{timelineMeta.highlight}</span>
                  )}
                </h2>

                <p className="text-neutral-600 font-normal text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-5 max-w-md">
                  {timelineMeta.subtitle}
                </p>

                <Link
                  href={timelineMeta.ctaLink || '/contact'}
                  className="relative inline-flex items-center justify-center gap-2 bg-white text-[#111827] border-2 border-neutral-200 font-bold text-xs sm:text-sm px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl overflow-hidden group/btn transition-all duration-300 shadow-sm"
                >
                  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    <span>{timelineMeta.ctaText || 'Read More'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </Link>
              </div>

              {/* Right Column: Timeline */}
              <div className="lg:col-span-7 relative pl-5 sm:pl-8 border-l-2 border-[#900606]/30 ml-2.5 sm:ml-4 space-y-3.5 sm:space-y-6 pt-1 sm:pt-0">
                {milestonesList.map((item, idx) => (
                  <div key={item._id || idx} className="relative flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                    {/* Red timeline dot */}
                    <span className="absolute -left-[27px] sm:-left-[39px] top-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#900606] ring-4 ring-[#FBFBF7]"></span>
                    
                    <span className="text-base sm:text-lg font-bold text-[#900606] tracking-tight shrink-0 min-w-[50px] sm:min-w-[56px]">
                      {item.year}
                    </span>

                    <div>
                      <h4 className="text-sm sm:text-base lg:text-lg font-bold text-neutral-900 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-neutral-500 text-xs sm:text-sm font-normal mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 7. MEET OUR TEAM SECTION */}
        <section className="w-full pt-2 pb-5 sm:pt-4 sm:pb-6 md:pt-4 md:pb-8">
          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            
            {/* Header with Navigation Arrows */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2.5 sm:mb-5 gap-2 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-neutral-900 tracking-tight">
                  {teamMeta.title}{' '}
                  {teamMeta.highlight && (
                    <span className="text-[#900606]">{teamMeta.highlight}</span>
                  )}
                </h2>
                <p className="text-neutral-600 text-xs sm:text-sm md:text-base mt-1.5 sm:mt-2 font-normal">
                  {teamMeta.subtitle}
                </p>
              </div>

              {/* Slider / Arrow buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button 
                  type="button" 
                  onClick={scrollTeamPrev}
                  aria-label="Previous team member" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 transition-colors shadow-sm active:scale-90 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </button>
                <button 
                  type="button" 
                  onClick={scrollTeamNext}
                  aria-label="Next team member" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 transition-colors shadow-sm active:scale-90 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* MOBILE VIEW (block md:hidden) - EMBLA SLIDER WITH 1 CARD PER VIEW */}
            <div className="block md:hidden relative w-full px-1">
              <div className="overflow-hidden w-full" ref={mobileTeamRef}>
                <div className="flex">
                  {mobileTeamList.map((member, idx) => (
                    <div
                      key={`mob-${member._id || member.name}-${idx}`}
                      className="flex-[0_0_100%] min-w-0 px-2 shrink-0"
                    >
                      <div className="bg-white border border-neutral-200/90 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between h-full group">
                        <div>
                          {/* Card Portrait Photo - Edge to Edge, No side gap */}
                          <div className="relative w-full aspect-[4/4.2] overflow-hidden bg-neutral-100">
                            <Image 
                              src={getImageUrl(member.image || '/team/manish.jpg')} 
                              alt={member.name} 
                              fill 
                              unoptimized
                              sizes="90vw" 
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                          </div>

                          <div className="p-5 pb-0">
                            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                              {member.name}
                            </h3>
                            <p className="text-xs font-semibold text-[#900606] mt-0.5 mb-1.5">
                              {member.role}
                            </p>
                            <p className="text-neutral-500 text-xs leading-relaxed font-normal mb-3">
                              {member.desc}
                            </p>
                          </div>
                        </div>

                        {/* Social Icons */}
                        <div className="p-5 pt-3">
                          <div className="flex items-center gap-3 pt-2.5 border-t border-neutral-100">
                          {member.linkedin && (
                            <Link 
                              href={member.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              aria-label={`${member.name} LinkedIn`}
                              className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.55a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
                              </svg>
                            </Link>
                          )}
                          {member.instagram && (
                            <Link 
                              href={member.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              aria-label={`${member.name} Instagram`}
                              className="text-[#E4405F] hover:opacity-80 transition-opacity"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {/* DESKTOP VIEW (hidden md:grid) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamList.map((member, idx) => (
                <div 
                  key={member._id || idx}
                  className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Card Portrait Photo - Edge to Edge, No side gap */}
                    <div className="relative w-full aspect-[4/4.2] sm:h-[280px] overflow-hidden bg-neutral-100">
                      <Image 
                        src={getImageUrl(member.image || '/team/manish.jpg')} 
                        alt={member.name} 
                        fill 
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out" 
                      />
                    </div>

                    <div className="p-5 sm:p-6 pb-0">
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#900606] mt-0.5 mb-2">
                        {member.role}
                      </p>
                      <p className="text-neutral-500 text-xs leading-relaxed font-normal mb-2">
                        {member.desc}
                      </p>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="p-5 sm:p-6 pt-3">
                    <div className="flex items-center gap-2.5 pt-3 border-t border-neutral-100">
                      {member.linkedin && (
                        <Link 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label={`${member.name} LinkedIn`}
                          className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.55a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
                          </svg>
                        </Link>
                      )}
                      {member.instagram && (
                        <Link 
                          href={member.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label={`${member.name} Instagram`}
                          className="text-[#E4405F] hover:opacity-80 transition-opacity"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 8. JOIN OUR GROWING COMMUNITY BANNER (Full Width) */}
        <section className="relative w-full bg-[#050505] text-white py-8 sm:py-10 md:py-12 overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0">
            <Image 
              src={getImageUrl(ctaBannerData.image || '/about4.png')} 
              alt={ctaBannerData.title || 'Join Community'} 
              fill 
              unoptimized
              sizes="100vw" 
              className="object-cover object-center" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85 pointer-events-none"></div>

          <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 sm:mb-3">
                {ctaBannerData.title}{' '}
                {ctaBannerData.highlight && (
                  <span className="text-[#900606] text-rose-500">{ctaBannerData.highlight}</span>
                )}
              </h3>
              <p className="text-neutral-200 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                {ctaBannerData.description}
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <Link
                href={ctaBannerData.ctaLink || '/contact'}
                className="relative inline-flex items-center justify-center gap-2.5 bg-white text-[#111827] border-2 border-neutral-200 font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl overflow-hidden group/btn transition-all duration-300 shadow-sm"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                  <span>{ctaBannerData.ctaText || 'Join Now'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
